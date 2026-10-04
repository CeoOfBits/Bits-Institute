import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { ClientInfo, CurrentUser, RequirePermissions } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { pagination, parseId, uuid } from '../common/utils.js';
import { EnrollmentsService } from './enrollments.service.js';

const enrollSchema = z.object({
  studentId: uuid,
  courseId: uuid,
  batchId: uuid,
});

const transferBatchSchema = z.object({
  studentId: uuid,
  fromBatchId: uuid,
  toBatchId: uuid,
  reason: z.string().max(500).optional(),
});

const transferCourseSchema = z.object({
  studentId: uuid,
  fromCourseEnrollmentId: uuid,
  toCourseId: uuid,
  toBatchId: uuid,
  reason: z.string().max(500).optional(),
});

const listStudentsQuery = pagination.extend({
  search: z.string().max(100).optional(),
  courseId: uuid.optional(),
  batchId: uuid.optional(),
});

type Ctx = { ip?: string };

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollments: EnrollmentsService) {}

  @RequirePermissions('student:read')
  @Get('students')
  listStudents(@Query(new ZodPipe(listStudentsQuery)) q: z.infer<typeof listStudentsQuery>) {
    return this.enrollments.listStudents(q);
  }

  @RequirePermissions('student:read')
  @Get('students/:id/history')
  getStudentHistory(@Param('id') id: string) {
    return this.enrollments.getStudentHistory(parseId(id));
  }

  @RequirePermissions('enrollment:create')
  @Post('enrollments')
  enrollStudent(
    @Body(new ZodPipe(enrollSchema)) body: z.infer<typeof enrollSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.enrollments.enrollStudent(body, user.id, ctx.ip);
  }

  @RequirePermissions('student:transfer')
  @Post('enrollments/transfer-batch')
  transferBatch(
    @Body(new ZodPipe(transferBatchSchema)) body: z.infer<typeof transferBatchSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.enrollments.transferBatch(body, user.id, ctx.ip);
  }

  @RequirePermissions('student:transfer')
  @Post('enrollments/transfer-course')
  transferCourse(
    @Body(new ZodPipe(transferCourseSchema)) body: z.infer<typeof transferCourseSchema>,
    @CurrentUser() user: AuthUser,
    @ClientInfo() ctx: Ctx,
  ) {
    return this.enrollments.transferCourse(body, user.id, ctx.ip);
  }
}
