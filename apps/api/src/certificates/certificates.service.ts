import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';
import { pageMeta } from '../common/utils.js';

export interface IssueCertificateInput {
  studentId: string;
  courseId: string;
  batchId?: string;
  grade?: string;
}

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * CRITICAL REQUIREMENT (Section 19):
   * Public certificate verification endpoint without exposing private student personal data.
   * e.g. BITS-CCNA-2026-00482
   */
  async verifyCertificate(code: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            durationLabel: true,
          },
        },
      },
    });

    if (!cert) {
      return {
        verified: false,
        message: 'No certificate found with the provided credential ID.',
      };
    }

    if (cert.status === 'REVOKED') {
      return {
        verified: false,
        status: 'REVOKED',
        code: cert.code,
        message: 'This certificate has been revoked.',
        revokedAt: cert.revokedAt,
      };
    }

    return {
      verified: true,
      status: 'VERIFIED',
      code: cert.code,
      studentName: `${cert.student.user.firstName} ${cert.student.user.lastName}`,
      courseTitle: cert.course.title,
      courseDuration: cert.course.durationLabel,
      grade: cert.grade,
      issuedAt: cert.issuedAt,
      institute: 'BITS Institute (Bright Information Technology Solutions)',
    };
  }

  async list(q: { search?: string; courseId?: string; page: number; pageSize: number }) {
    const where: any = {};
    if (q.search) {
      where.OR = [
        { code: { contains: q.search, mode: 'insensitive' } },
        { student: { user: { firstName: { contains: q.search, mode: 'insensitive' } } } },
        { student: { user: { lastName: { contains: q.search, mode: 'insensitive' } } } },
      ];
    }
    if (q.courseId) where.courseId = q.courseId;

    const [total, items] = await Promise.all([
      this.prisma.certificate.count({ where }),
      this.prisma.certificate.findMany({
        where,
        orderBy: { issuedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          student: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          course: { select: { id: true, title: true } },
        },
      }),
    ]);

    return {
      items,
      meta: pageMeta(total, q.page, q.pageSize),
    };
  }

  async issue(input: IssueCertificateInput, adminUserId: string, ip?: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: input.studentId },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student profile not found');

    const course = await this.prisma.course.findUnique({
      where: { id: input.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    // Check for existing valid certificate
    const existing = await this.prisma.certificate.findFirst({
      where: { studentId: input.studentId, courseId: input.courseId, status: 'VALID' },
    });
    if (existing) {
      throw new ConflictException(`Student already holds an active certificate for this course (${existing.code})`);
    }

    const year = new Date().getFullYear();
    const prefix = course.certificateCode || 'CERT';
    const count = await this.prisma.certificate.count();
    const code = `BITS-${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;

    const cert = await this.prisma.certificate.create({
      data: {
        code,
        studentId: input.studentId,
        courseId: input.courseId,
        batchId: input.batchId,
        grade: input.grade,
        status: 'VALID',
      },
      include: {
        course: { select: { title: true } },
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    await this.audit.record({
      userId: adminUserId,
      action: 'certificate.issue',
      entityType: 'Certificate',
      entityId: cert.id,
      metadata: { code: cert.code, studentId: cert.studentId, courseId: cert.courseId },
      ip,
    });

    return cert;
  }

  async revoke(id: string, reason: string, adminUserId: string, ip?: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokeReason: reason,
      },
    });

    await this.audit.record({
      userId: adminUserId,
      action: 'certificate.revoke',
      entityType: 'Certificate',
      entityId: cert.id,
      metadata: { code: cert.code, reason },
      ip,
    });

    return updated;
  }
}
