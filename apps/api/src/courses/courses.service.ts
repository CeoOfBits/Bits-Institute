import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.module.js';
import { PrismaService } from '../prisma/prisma.module.js';
import { pageMeta, slugify } from '../common/utils.js';
import { seatMap, seatInfo } from '../batches/seats.js';

export interface CourseInput {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  imageUrl?: string | null;
  durationHours?: number | null;
  durationLabel?: string | null;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  requirements?: string[];
  outcomes?: string[];
  priceMinor?: number;
  currency?: string;
  enrollmentOpen?: boolean;
  certificateEnabled?: boolean;
  certificateCode?: string | null;
  defaultInstructorId?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  faqs?: { question: string; answer: string }[];
  modules?: {
    title: string;
    lessons?: {
      title: string;
      type?: 'VIDEO' | 'TEXT' | 'FILE' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE';
      content?: string;
      durationMins?: number;
      isPreview?: boolean;
    }[];
  }[];
}

const instructorSelect = {
  id: true,
  headline: true,
  bio: true,
  expertise: true,
  experience: true,
  user: { select: { firstName: true, lastName: true, avatarUrl: true } },
} as const;

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listPublic(q: { category?: string; search?: string; page: number; pageSize: number }) {
    const where = {
      status: 'PUBLISHED' as const,
      deletedAt: null,
      ...(q.category ? { category: { slug: q.category } } : {}),
      ...(q.search
        ? {
            OR: [
              { title: { contains: q.search, mode: 'insensitive' as const } },
              { shortDescription: { contains: q.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, items] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        select: {
          id: true, title: true, slug: true, shortDescription: true, imageUrl: true,
          durationLabel: true, durationHours: true, level: true, priceMinor: true, currency: true,
          enrollmentOpen: true, category: { select: { name: true, slug: true } },
          _count: { select: { batches: { where: { deletedAt: null, status: { in: ['UPCOMING', 'ACTIVE'] } } } } },
        },
      }),
    ]);
    return { items, meta: pageMeta(total, q.page, q.pageSize) };
  }

  async getPublic(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        category: { select: { name: true, slug: true } },
        defaultInstructor: { select: instructorSelect },
        faqs: { orderBy: { sortOrder: 'asc' } },
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: { id: true, title: true, type: true, durationMins: true, isPreview: true },
            },
          },
        },
        batches: {
          where: { deletedAt: null, status: { in: ['UPCOMING', 'ACTIVE', 'FULL'] } },
          orderBy: { startDate: 'asc' },
          include: {
            instructors: {
              where: { unassignedAt: null },
              include: { instructor: { select: instructorSelect } },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    const seats = await seatMap(this.prisma, course.batches.map((b) => b.id));
    return {
      ...course,
      batches: course.batches.map((b) => ({ ...b, ...seatInfo(b, seats.get(b.id) ?? 0) })),
    };
  }

  async listAdmin(q: { search?: string; status?: string; categoryId?: string; page: number; pageSize: number }) {
    const where = {
      deletedAt: null,
      ...(q.status ? { status: q.status as never } : {}),
      ...(q.categoryId ? { categoryId: q.categoryId } : {}),
      ...(q.search ? { title: { contains: q.search, mode: 'insensitive' as const } } : {}),
    };
    const [total, items] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { category: { select: { name: true } }, _count: { select: { batches: true, enrollments: true } } },
      }),
    ]);
    return { items, meta: pageMeta(total, q.page, q.pageSize) };
  }

  async getAdmin(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: {
        modules: { orderBy: { sortOrder: 'asc' }, include: { lessons: { orderBy: { sortOrder: 'asc' } } } },
        faqs: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  private async uniqueSlug(base: string, ignoreId?: string) {
    let slug = slugify(base) || 'course';
    for (let i = 2; ; i++) {
      const hit = await this.prisma.course.findUnique({ where: { slug } });
      if (!hit || hit.id === ignoreId) return slug;
      slug = `${slugify(base)}-${i}`;
    }
  }

  async create(input: CourseInput, userId: string, ip?: string) {
    const { modules, faqs, slug, ...data } = input;
    if (slug) {
      if (await this.prisma.course.findUnique({ where: { slug: slugify(slug) } })) {
        throw new ConflictException('Slug is already in use');
      }
    }
    const course = await this.prisma.course.create({
      data: {
        ...data,
        slug: slug ? slugify(slug) : await this.uniqueSlug(input.title),
        faqs: { create: (faqs ?? []).map((f, i) => ({ ...f, sortOrder: i })) },
        modules: {
          create: (modules ?? []).map((m, mi) => ({
            title: m.title,
            sortOrder: mi,
            lessons: { create: (m.lessons ?? []).map((l, li) => ({ ...l, sortOrder: li })) },
          })),
        },
      },
    });
    await this.audit.record({ userId, action: 'course.create', entityType: 'Course', entityId: course.id, metadata: { title: course.title }, ip });
    return course;
  }

  async update(id: string, input: Partial<CourseInput>, userId: string, ip?: string) {
    await this.getAdmin(id);
    const { modules: _m, faqs, slug, ...data } = input;
    if (slug) {
      const hit = await this.prisma.course.findUnique({ where: { slug: slugify(slug) } });
      if (hit && hit.id !== id) throw new ConflictException('Slug is already in use');
    }
    const course = await this.prisma.$transaction(async (tx) => {
      if (faqs) {
        await tx.courseFaq.deleteMany({ where: { courseId: id } });
        await tx.courseFaq.createMany({ data: faqs.map((f, i) => ({ ...f, courseId: id, sortOrder: i })) });
      }
      return tx.course.update({ where: { id }, data: { ...data, ...(slug ? { slug: slugify(slug) } : {}) } });
    });
    await this.audit.record({ userId, action: 'course.update', entityType: 'Course', entityId: id, ip });
    return course;
  }

  /** Soft delete; courses with enrollments are archived instead of removed from history. */
  async remove(id: string, userId: string, ip?: string) {
    await this.getAdmin(id);
    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED', enrollmentOpen: false },
    });
    await this.audit.record({ userId, action: 'course.delete', entityType: 'Course', entityId: id, ip });
    return { success: true };
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true, slug: true } });
  }
}
