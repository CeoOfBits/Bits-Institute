import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.module.js';
import { pageMeta } from '../common/utils.js';
import { PrismaService } from '../prisma/prisma.module.js';
import { seatInfo, seatMap } from './seats.js';

type Tx = Prisma.TransactionClient;
type Mode = 'ONLINE' | 'OFFLINE' | 'HYBRID';
type Role = 'LEAD' | 'ASSISTANT' | 'GUEST';

export interface BatchInput {
  courseId: string;
  code?: string;
  capacity: number;
  mode?: Mode;
  location?: string | null;
  scheduleNote?: string | null;
  shift?: string | null;
  startDate: Date;
  endDate?: Date | null;
  instructors?: { instructorId: string; role?: Role }[];
}

/** Recomputes UPCOMING/ACTIVE/FULL for open batches inside the caller's transaction. */
export async function syncBatchStatus(tx: Tx, batchId: string) {
  const batch = await tx.batch.findUniqueOrThrow({ where: { id: batchId } });
  if (batch.status === 'COMPLETED' || batch.status === 'ARCHIVED') return;
  const enrolled = await tx.batchEnrollment.count({ where: { batchId, status: 'ACTIVE' } });
  const next = enrolled >= batch.capacity ? 'FULL' : batch.startDate <= new Date() ? 'ACTIVE' : 'UPCOMING';
  if (next !== batch.status) await tx.batch.update({ where: { id: batchId }, data: { status: next } });
}

const include = {
  course: { select: { id: true, title: true, slug: true } },
  instructors: {
    where: { unassignedAt: null },
    include: { instructor: { select: { id: true, user: { select: { firstName: true, lastName: true } } } } },
  },
} as const;

@Injectable()
export class BatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private async withSeats<T extends { id: string; capacity: number; status: string }>(batches: T[]) {
    const seats = await seatMap(this.prisma, batches.map((b) => b.id));
    return batches.map((b) => ({ ...b, ...seatInfo(b, seats.get(b.id) ?? 0) }));
  }

  async list(q: { courseId?: string; status?: string; instructorId?: string; page: number; pageSize: number }) {
    const where: Prisma.BatchWhereInput = {
      deletedAt: null,
      ...(q.courseId ? { courseId: q.courseId } : {}),
      ...(q.status ? { status: q.status as never } : {}),
      ...(q.instructorId ? { instructors: { some: { instructorId: q.instructorId, unassignedAt: null } } } : {}),
    };
    const [total, rows] = await Promise.all([
      this.prisma.batch.count({ where }),
      this.prisma.batch.findMany({
        where, include, orderBy: { startDate: 'desc' },
        skip: (q.page - 1) * q.pageSize, take: q.pageSize,
      }),
    ]);
    return { items: await this.withSeats(rows), meta: pageMeta(total, q.page, q.pageSize) };
  }

  async get(id: string) {
    const batch = await this.prisma.batch.findFirst({ where: { id, deletedAt: null }, include });
    if (!batch) throw new NotFoundException('Batch not found');
    return (await this.withSeats([batch]))[0];
  }

  async roster(id: string) {
    await this.get(id);
    return this.prisma.batchEnrollment.findMany({
      where: { batchId: id, status: 'ACTIVE' },
      orderBy: { joinedAt: 'asc' },
      include: { student: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
    });
  }

  private async nextCode(courseId: string) {
    const codes = await this.prisma.batch.findMany({ where: { courseId }, select: { code: true } });
    const max = codes.reduce((m, c) => Math.max(m, parseInt(c.code, 10) || 0), 0);
    return String(max + 1).padStart(3, '0');
  }

  async create(input: BatchInput, userId: string, ip?: string) {
    const course = await this.prisma.course.findFirst({ where: { id: input.courseId, deletedAt: null } });
    if (!course) throw new NotFoundException('Course not found');
    if (input.endDate && input.endDate < input.startDate) throw new BadRequestException('End date is before start date');

    const code = input.code ?? (await this.nextCode(course.id));
    const instructors =
      input.instructors ??
      (course.defaultInstructorId ? [{ instructorId: course.defaultInstructorId, role: 'LEAD' as Role }] : []);

    const batch = await this.prisma.batch.create({
      data: {
        courseId: course.id,
        code,
        name: `${course.title} — Batch ${code}`,
        capacity: input.capacity,
        mode: input.mode ?? 'ONLINE',
        location: input.location,
        scheduleNote: input.scheduleNote,
        shift: input.shift,
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.startDate <= new Date() ? 'ACTIVE' : 'UPCOMING',
        instructors: { create: instructors.map((i) => ({ instructorId: i.instructorId, role: i.role ?? 'LEAD' })) },
      },
    });
    await this.audit.record({ userId, action: 'batch.create', entityType: 'Batch', entityId: batch.id, metadata: { name: batch.name }, ip });
    return this.get(batch.id);
  }

  async update(id: string, input: Partial<Omit<BatchInput, 'courseId' | 'instructors'>> & { status?: 'ARCHIVED' | 'COMPLETED' }, userId: string, ip?: string) {
    const batch = await this.get(id);
    if (input.capacity !== undefined && input.capacity < batch.enrolled) {
      throw new BadRequestException(`Capacity cannot be below the ${batch.enrolled} enrolled students`);
    }
    const { code: _c, ...data } = input;
    await this.prisma.$transaction(async (tx) => {
      await tx.batch.update({ where: { id }, data });
      await syncBatchStatus(tx, id);
    });
    const action = input.status === 'ARCHIVED' ? 'batch.archive' : input.status === 'COMPLETED' ? 'batch.complete' : 'batch.update';
    await this.audit.record({ userId, action, entityType: 'Batch', entityId: id, ip });
    return this.get(id);
  }

  /** Create Next Batch: copies schedule/capacity/lead instructor; students only when explicitly requested. */
  async createNext(id: string, input: { startDate: Date; endDate?: Date | null; copyStudents?: boolean; copyInstructors?: boolean }, userId: string, ip?: string) {
    const src = await this.prisma.batch.findFirst({
      where: { id, deletedAt: null },
      include: { instructors: { where: { unassignedAt: null } } },
    });
    if (!src) throw new NotFoundException('Batch not found');
    const code = await this.nextCode(src.courseId);
    const course = await this.prisma.course.findUniqueOrThrow({ where: { id: src.courseId } });

    const created = await this.prisma.$transaction(async (tx) => {
      const next = await tx.batch.create({
        data: {
          courseId: src.courseId, code, name: `${course.title} — Batch ${code}`,
          capacity: src.capacity, mode: src.mode, location: src.location,
          scheduleNote: src.scheduleNote, shift: src.shift,
          startDate: input.startDate, endDate: input.endDate,
          status: input.startDate <= new Date() ? 'ACTIVE' : 'UPCOMING',
          instructors: {
            create: (input.copyInstructors === false ? [] : src.instructors).map((i) => ({ instructorId: i.instructorId, role: i.role })),
          },
        },
      });
      if (input.copyStudents) {
        const active = await tx.batchEnrollment.findMany({ where: { batchId: src.id, status: 'ACTIVE' } });
        if (active.length > next.capacity) throw new BadRequestException('Not enough capacity to copy students');
        await tx.batchEnrollment.createMany({
          data: active.map((e) => ({ studentId: e.studentId, batchId: next.id, courseEnrollmentId: e.courseEnrollmentId })),
        });
        await syncBatchStatus(tx, next.id);
      }
      return next;
    });
    await this.audit.record({ userId, action: 'batch.create_next', entityType: 'Batch', entityId: created.id, metadata: { from: src.id, copyStudents: !!input.copyStudents }, ip });
    return this.get(created.id);
  }

  async assignInstructor(batchId: string, input: { instructorId: string; role: Role }, userId: string, ip?: string) {
    await this.get(batchId);
    const instructor = await this.prisma.instructor.findFirst({ where: { id: input.instructorId, deletedAt: null } });
    if (!instructor) throw new NotFoundException('Instructor not found');

    await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      // A batch has one active lead; assigning a new lead replaces the previous one.
      if (input.role === 'LEAD') {
        await tx.batchInstructor.updateMany({ where: { batchId, role: 'LEAD', unassignedAt: null }, data: { unassignedAt: now } });
      }
      await tx.batchInstructor.updateMany({ where: { batchId, instructorId: input.instructorId, unassignedAt: null }, data: { unassignedAt: now } });
      await tx.batchInstructor.create({ data: { batchId, instructorId: input.instructorId, role: input.role } });
    });
    await this.audit.record({ userId, action: 'batch.assign_instructor', entityType: 'Batch', entityId: batchId, metadata: input, ip });
    return this.get(batchId);
  }

  async unassignInstructor(batchId: string, instructorId: string, userId: string, ip?: string) {
    const r = await this.prisma.batchInstructor.updateMany({
      where: { batchId, instructorId, unassignedAt: null },
      data: { unassignedAt: new Date() },
    });
    if (!r.count) throw new NotFoundException('Instructor is not assigned to this batch');
    await this.audit.record({ userId, action: 'batch.unassign_instructor', entityType: 'Batch', entityId: batchId, metadata: { instructorId }, ip });
    return this.get(batchId);
  }
}
