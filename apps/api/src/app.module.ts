import { Controller, Get, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditModule } from './audit/audit.module.js';
import { AuthController } from './auth/auth.controller.js';
import { AccessGuard, JwtAuthGuard } from './auth/auth.guards.js';
import { AuthService } from './auth/auth.service.js';
import { Public } from './auth/auth.decorators.js';
import { env } from './config/env.js';
import { PrismaModule, PrismaService } from './prisma/prisma.module.js';

// LMS & Platform Controllers and Services
import { CoursesController } from './courses/courses.controller.js';
import { CoursesService } from './courses/courses.service.js';
import { BatchesController } from './batches/batches.controller.js';
import { BatchesService } from './batches/batches.service.js';
import { EnrollmentsController } from './enrollments/enrollments.controller.js';
import { EnrollmentsService } from './enrollments/enrollments.service.js';
import { CertificatesController } from './certificates/certificates.controller.js';
import { CertificatesService } from './certificates/certificates.service.js';
import { LearningController } from './learning/learning.controller.js';
import { LearningService } from './learning/learning.service.js';
import { CmsController } from './cms/cms.controller.js';
import { CmsService } from './cms/cms.service.js';
import { ServicesController } from './services/services.controller.js';
import { ServicesService } from './services/services.service.js';

@Controller()
class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('health')
  async health() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', time: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    JwtModule.register({
      global: true,
      secret: env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: env.JWT_ACCESS_TTL as never },
    }),
    PrismaModule,
    AuditModule,
  ],
  controllers: [
    HealthController,
    AuthController,
    CoursesController,
    BatchesController,
    EnrollmentsController,
    CertificatesController,
    LearningController,
    CmsController,
    ServicesController,
  ],
  providers: [
    AuthService,
    CoursesService,
    BatchesService,
    EnrollmentsService,
    CertificatesService,
    LearningService,
    CmsService,
    ServicesService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AccessGuard },
  ],
})
export class AppModule {}
