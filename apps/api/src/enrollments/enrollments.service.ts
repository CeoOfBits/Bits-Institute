import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.module.js';
import { PrismaService } from '../prisma/prisma.module.js';
import { pageMeta } from '../common/utils.js';
import { syncBatchStatus } from '../batches/batches.service.js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export interface EnrollStudentInput {
  studentId: string;
  courseId: string;
  batchId: string;
}

export interface TransferBatchInput {
  studentId: string;
  fromBatchId: string;
  toBatchId: string;
  reason?: string;
}

export interface TransferCourseInput {
  studentId: string;
  fromCourseEnrollmentId: string;
  toCourseId: string;
  toBatchId: string;
  reason?: string;
}

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Enroll a student into a Course and an initial Batch.
   * Maintains clean history: CourseEnrollment -> BatchEnrollment.
   */
  async enrollStudent(input: EnrollStudentInput, adminUserId: string, ip?: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: input.studentId },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    const course = await this.prisma.course.findFirst({
      where: { id: input.courseId, deletedAt: null },
    });
    if (!course) throw new NotFoundException('Course not found');

    const batch = await this.prisma.batch.findFirst({
      where: { id: input.batchId, courseId: input.courseId, deletedAt: null },
    });
    if (!batch) throw new NotFoundException('Batch not found or does not belong to this course');

    if (batch.status === 'COMPLETED' || batch.status === 'ARCHIVED') {
      throw new BadRequestException('Cannot enroll student into a completed or archived batch');
    }

    // Check capacity
    const activeEnrolled = await this.prisma.batchEnrollment.count({
      where: { batchId: batch.id, status: 'ACTIVE' },
    });
    if (activeEnrolled >= batch.capacity) {
      throw new BadRequestException(`Batch is full (${activeEnrolled}/${batch.capacity})`);
    }

    // Check existing active course enrollment
    let courseEnrollment = await this.prisma.courseEnrollment.findFirst({
      where: { studentId: student.id, courseId: course.id, status: 'ACTIVE' },
    });

    return await this.prisma.$transaction(async (tx) => {
      if (!courseEnrollment) {
        courseEnrollment = await tx.courseEnrollment.create({
          data: {
            studentId: student.id,
            courseId: course.id,
            status: 'ACTIVE',
          },
        });
      }

      // Check if student is already active in this batch
      const existingBatchEnrollment = await tx.batchEnrollment.findFirst({
        where: { studentId: student.id, batchId: batch.id, status: 'ACTIVE' },
      });
      if (existingBatchEnrollment) {
        throw new ConflictException('Student is already actively enrolled in this batch');
      }

      const batchEnrollment = await tx.batchEnrollment.create({
        data: {
          studentId: student.id,
          batchId: batch.id,
          courseEnrollmentId: courseEnrollment.id,
          status: 'ACTIVE',
        },
      });

      await syncBatchStatus(tx, batch.id);

      await this.audit.record({
        userId: adminUserId,
        action: 'student.enroll',
        entityType: 'BatchEnrollment',
        entityId: batchEnrollment.id,
        metadata: {
          studentId: student.id,
          courseId: course.id,
          batchId: batch.id,
        },
        ip,
      });

      return {
        courseEnrollment,
        batchEnrollment,
      };
    });
  }

  /**
   * CRITICAL BRIEF REQUIREMENT (Section 9):
   * Move student from Batch A -> Batch B without destroying historical records!
   * Creates BatchTransfer audit and updates status to TRANSFERRED while creating new ACTIVE BatchEnrollment.
   */
  async transferBatch(input: TransferBatchInput, adminUserId: string, ip?: string) {
    if (input.fromBatchId === input.toBatchId) {
      throw new BadRequestException('Target batch must be different from source batch');
    }

    const currentEnrollment = await this.prisma.batchEnrollment.findFirst({
      where: {
        studentId: input.studentId,
        batchId: input.fromBatchId,
        status: 'ACTIVE',
      },
      include: {
        batch: true,
        courseEnrollment: true,
      },
    });

    if (!currentEnrollment) {
      throw new NotFoundException('Student is not actively enrolled in the source batch');
    }

    const targetBatch = await this.prisma.batch.findFirst({
      where: { id: input.toBatchId, deletedAt: null },
    });
    if (!targetBatch) throw new NotFoundException('Target batch not found');

    if (targetBatch.courseId !== currentEnrollment.batch.courseId) {
      throw new BadRequestException(
        'Batch transfer only applies within the same course. For changing courses, use Course Transfer.',
      );
    }

    if (targetBatch.status === 'COMPLETED' || targetBatch.status === 'ARCHIVED') {
      throw new BadRequestException('Cannot transfer student to an archived or completed batch');
    }

    // Check capacity of target batch
    const targetEnrolled = await this.prisma.batchEnrollment.count({
      where: { batchId: targetBatch.id, status: 'ACTIVE' },
    });
    if (targetEnrolled >= targetBatch.capacity) {
      throw new BadRequestException(`Target batch is full (${targetEnrolled}/${targetBatch.capacity})`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      // 1. Close current batch enrollment (preserving history)
      await tx.batchEnrollment.update({
        where: { id: currentEnrollment.id },
        data: {
          status: 'TRANSFERRED',
          leftAt: now,
        },
      });

      // 2. Open new batch enrollment
      const newEnrollment = await tx.batchEnrollment.create({
        data: {
          studentId: input.studentId,
          batchId: targetBatch.id,
          courseEnrollmentId: currentEnrollment.courseEnrollmentId,
          status: 'ACTIVE',
          joinedAt: now,
        },
      });

      // 3. Record formal transfer audit record
      const transferRecord = await tx.batchTransfer.create({
        data: {
          studentId: input.studentId,
          fromBatchId: input.fromBatchId,
          toBatchId: input.toBatchId,
          fromEnrollmentId: currentEnrollment.id,
          toEnrollmentId: newEnrollment.id,
          reason: input.reason ?? 'Administrative batch transfer',
          performedById: adminUserId,
          transferredAt: now,
        },
      });

      // 4. Update both batch statuses if capacity changed
      await syncBatchStatus(tx, input.fromBatchId);
      await syncBatchStatus(tx, input.toBatchId);

      await this.audit.record({
        userId: adminUserId,
        action: 'student.transfer_batch',
        entityType: 'BatchTransfer',
        entityId: transferRecord.id,
        metadata: {
          studentId: input.studentId,
          fromBatchId: input.fromBatchId,
          toBatchId: input.toBatchId,
          reason: input.reason,
        },
        ip,
      });

      return {
        success: true,
        transferRecord,
        newEnrollment,
      };
    });
  }

  /**
   * CRITICAL BRIEF REQUIREMENT (Section 10):
   * Course transfer: e.g. CCNA -> Cyber Security
   * Preserves old course enrollment history as TRANSFERRED and begins new course & batch enrollment.
   */
  async transferCourse(input: TransferCourseInput, adminUserId: string, ip?: string) {
    const currentCourseEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id: input.fromCourseEnrollmentId },
      include: {
        batchEnrollments: { where: { status: 'ACTIVE' } },
      },
    });

    if (!currentCourseEnrollment) {
      throw new NotFoundException('Current course enrollment not found');
    }

    const targetCourse = await this.prisma.course.findFirst({
      where: { id: input.toCourseId, deletedAt: null },
    });
    if (!targetCourse) throw new NotFoundException('Target course not found');

    const targetBatch = await this.prisma.batch.findFirst({
      where: { id: input.toBatchId, courseId: input.toCourseId, deletedAt: null },
    });
    if (!targetBatch) throw new NotFoundException('Target batch not found in new course');

    const targetEnrolled = await this.prisma.batchEnrollment.count({
      where: { batchId: targetBatch.id, status: 'ACTIVE' },
    });
    if (targetEnrolled >= targetBatch.capacity) {
      throw new BadRequestException('Target batch in new course is full');
    }

    return await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      // 1. Close current active batch enrollments under old course
      for (const b of currentCourseEnrollment.batchEnrollments) {
        await tx.batchEnrollment.update({
          where: { id: b.id },
          data: { status: 'TRANSFERRED', leftAt: now },
        });
        await syncBatchStatus(tx, b.batchId);
      }

      // 2. Mark old course enrollment as TRANSFERRED
      await tx.courseEnrollment.update({
        where: { id: currentCourseEnrollment.id },
        data: {
          status: 'TRANSFERRED',
          endedAt: now,
          endReason: input.reason ?? 'Course Transfer',
        },
      });

      // 3. Create new CourseEnrollment linked back to old one
      const newCourseEnrollment = await tx.courseEnrollment.create({
        data: {
          studentId: input.studentId,
          courseId: targetCourse.id,
          status: 'ACTIVE',
          startedAt: now,
          transferredFromId: currentCourseEnrollment.id,
        },
      });

      // 4. Enroll in target batch
      const newBatchEnrollment = await tx.batchEnrollment.create({
        data: {
          studentId: input.studentId,
          batchId: targetBatch.id,
          courseEnrollmentId: newCourseEnrollment.id,
          status: 'ACTIVE',
          joinedAt: now,
        },
      });

      await syncBatchStatus(tx, targetBatch.id);

      await this.audit.record({
        userId: adminUserId,
        action: 'student.transfer_course',
        entityType: 'CourseEnrollment',
        entityId: newCourseEnrollment.id,
        metadata: {
          fromCourseId: currentCourseEnrollment.courseId,
          toCourseId: targetCourse.id,
          toBatchId: targetBatch.id,
          reason: input.reason,
        },
        ip,
      });

      return {
        newCourseEnrollment,
        newBatchEnrollment,
      };
    });
  }

  /**
   * Complete student enrollment and academic history view
   */
  async getStudentHistory(studentId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        courseEnrollments: {
          orderBy: { startedAt: 'desc' },
          include: {
            course: { select: { id: true, title: true, slug: true } },
            batchEnrollments: {
              orderBy: { joinedAt: 'desc' },
              include: {
                batch: { select: { id: true, name: true, code: true, startDate: true, endDate: true } },
              },
            },
          },
        },
        batchEnrollments: {
          orderBy: { joinedAt: 'desc' },
          include: {
            batch: { select: { id: true, name: true, code: true, courseId: true } },
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    const transfers = await this.prisma.batchTransfer.findMany({
      where: { studentId },
      orderBy: { transferredAt: 'desc' },
      include: {
        fromBatch: { select: { id: true, name: true, code: true } },
        toBatch: { select: { id: true, name: true, code: true } },
      },
    });

    return {
      student,
      transfers,
    };
  }

  /**
   * List students with filters, pagination, batch and course info
   */
  async listStudents(q: { search?: string; courseId?: string; batchId?: string; page: number; pageSize: number }) {
    const where: any = {};
    if (q.search) {
      where.OR = [
        { registrationNo: { contains: q.search, mode: 'insensitive' } },
        { user: { firstName: { contains: q.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: q.search, mode: 'insensitive' } } },
        { user: { email: { contains: q.search, mode: 'insensitive' } } },
      ];
    }
    if (q.batchId) {
      where.batchEnrollments = { some: { batchId: q.batchId, status: 'ACTIVE' } };
    } else if (q.courseId) {
      where.courseEnrollments = { some: { courseId: q.courseId, status: 'ACTIVE' } };
    }

    const [total, items] = await Promise.all([
      this.prisma.studentProfile.count({ where }),
      this.prisma.studentProfile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, status: true } },
          batchEnrollments: {
            where: { status: 'ACTIVE' },
            include: { batch: { select: { id: true, name: true, code: true } } },
          },
          _count: { select: { certificates: true, attendance: true } },
        },
      }),
    ]);

    return {
      items,
      meta: pageMeta(total, q.page, q.pageSize),
    };
  }
}
