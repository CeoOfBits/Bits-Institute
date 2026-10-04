import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser, RequirePermissions, Roles } from '../auth/auth.decorators.js';
import type { AuthUser } from '../auth/auth.decorators.js';
import { ZodPipe } from '../common/zod.pipe.js';
import { parseId, uuid } from '../common/utils.js';
import { LearningService } from './learning.service.js';

const markAttendanceSchema = z.object({
  records: z.array(
    z.object({
      studentId: uuid,
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    }),
  ),
});

const submitAssignmentSchema = z.object({
  text: z.string().optional(),
  links: z.array(z.string().url()).optional(),
  files: z.any().optional(),
});

const gradeSubmissionSchema = z.object({
  marks: z.number().int().min(0),
  feedback: z.string().optional(),
});

const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: uuid,
      response: z.any(),
    }),
  ),
});

@Controller('learning')
export class LearningController {
  constructor(private readonly learning: LearningService) {}

  @RequirePermissions('attendance:mark')
  @Post('live-classes/:id/attendance')
  markAttendance(
    @Param('id') id: string,
    @Body(new ZodPipe(markAttendanceSchema)) body: z.infer<typeof markAttendanceSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.learning.markAttendance(parseId(id), body.records, user.id);
  }

  @RequirePermissions('attendance:read')
  @Get('batches/:id/attendance')
  getBatchAttendance(@Param('id') id: string) {
    return this.learning.getBatchAttendance(parseId(id));
  }

  @RequirePermissions('attendance:read')
  @Get('students/:id/attendance-summary')
  getStudentAttendanceSummary(@Param('id') id: string) {
    return this.learning.getStudentAttendanceSummary(parseId(id));
  }

  @Roles('STUDENT')
  @Post('assignments/:id/submit')
  submitAssignment(
    @Param('id') id: string,
    @Body(new ZodPipe(submitAssignmentSchema)) body: z.infer<typeof submitAssignmentSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.learning.submitAssignment(parseId(id), user.id, body);
  }

  @RequirePermissions('assignment:grade')
  @Patch('submissions/:id/grade')
  gradeSubmission(
    @Param('id') id: string,
    @Body(new ZodPipe(gradeSubmissionSchema)) body: z.infer<typeof gradeSubmissionSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.learning.gradeSubmission(parseId(id), body, user.id);
  }

  @Roles('STUDENT')
  @Post('quizzes/:id/start')
  startQuiz(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.learning.startQuizAttempt(parseId(id), user.id);
  }

  @Roles('STUDENT')
  @Post('quiz-attempts/:id/submit')
  submitQuiz(
    @Param('id') id: string,
    @Body(new ZodPipe(submitQuizSchema)) body: z.infer<typeof submitQuizSchema>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.learning.submitQuizAttempt(parseId(id), user.id, body.answers);
  }
}
