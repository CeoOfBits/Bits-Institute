import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';

@Injectable()
export class LearningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ───────────────────────── Live Classes & Attendance ─────────────────────────

  async createLiveClass(batchId: string, instructorId: string, input: { topic: string; startsAt: Date; endsAt: Date; meetingUrl?: string; provider?: string }) {
    return this.prisma.liveClass.create({
      data: {
        batchId,
        instructorId,
        topic: input.topic,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        meetingUrl: input.meetingUrl,
        provider: input.provider ?? 'ZOOM',
      },
    });
  }

  async markAttendance(
    liveClassId: string,
    records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }[],
    markedById: string,
  ) {
    const liveClass = await this.prisma.liveClass.findUnique({ where: { id: liveClassId } });
    if (!liveClass) throw new NotFoundException('Live class not found');

    const results = await this.prisma.$transaction(
      records.map((r) =>
        this.prisma.attendance.upsert({
          where: { liveClassId_studentId: { liveClassId, studentId: r.studentId } },
          update: { status: r.status, markedById, markedAt: new Date() },
          create: { liveClassId, studentId: r.studentId, status: r.status, markedById },
        }),
      ),
    );

    return { success: true, count: results.length };
  }

  async getBatchAttendance(batchId: string) {
    const classes = await this.prisma.liveClass.findMany({
      where: { batchId },
      include: {
        attendance: {
          include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
        },
      },
      orderBy: { startsAt: 'desc' },
    });
    return classes;
  }

  async getStudentAttendanceSummary(studentId: string) {
    const records = await this.prisma.attendance.findMany({
      where: { studentId },
    });
    const total = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const late = records.filter((r) => r.status === 'LATE').length;
    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return {
      total,
      present,
      absent: records.filter((r) => r.status === 'ABSENT').length,
      late,
      excused: records.filter((r) => r.status === 'EXCUSED').length,
      percentage,
    };
  }

  // ───────────────────────── Assignments & Submissions ─────────────────────────

  async createAssignment(batchId: string, input: { title: string; description: string; dueAt: Date; maxMarks?: number; attachments?: any }) {
    return this.prisma.assignment.create({
      data: {
        batchId,
        title: input.title,
        description: input.description,
        dueAt: input.dueAt,
        maxMarks: input.maxMarks ?? 100,
        attachments: input.attachments,
      },
    });
  }

  async submitAssignment(assignmentId: string, studentId: string, input: { text?: string; links?: string[]; files?: any }) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    return this.prisma.submission.upsert({
      where: { id: `${assignmentId}-${studentId}` }, // or by query
      update: {
        text: input.text,
        links: input.links ?? [],
        files: input.files,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId,
        text: input.text,
        links: input.links ?? [],
        files: input.files,
      },
    });
  }

  async gradeSubmission(submissionId: string, input: { marks: number; feedback?: string }, instructorUserId: string) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });
    if (!sub) throw new NotFoundException('Submission not found');
    if (input.marks > sub.assignment.maxMarks) {
      throw new BadRequestException(`Marks cannot exceed maximum marks (${sub.assignment.maxMarks})`);
    }

    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        marks: input.marks,
        feedback: input.feedback,
        status: 'GRADED',
        gradedById: instructorUserId,
        gradedAt: new Date(),
      },
    });
  }

  // ───────────────────────── Quizzes & Attempts ─────────────────────────

  async createQuiz(batchId: string, input: {
    title: string;
    durationMins?: number;
    passingPercent?: number;
    maxAttempts?: number;
    questions: {
      type: 'MCQ_SINGLE' | 'MCQ_MULTIPLE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
      prompt: string;
      options?: any;
      answerText?: string;
      marks?: number;
    }[];
  }) {
    return this.prisma.quiz.create({
      data: {
        batchId,
        title: input.title,
        durationMins: input.durationMins ?? 30,
        passingPercent: input.passingPercent ?? 60,
        maxAttempts: input.maxAttempts ?? 1,
        questions: {
          create: input.questions.map((q, idx) => ({
            type: q.type,
            prompt: q.prompt,
            options: q.options,
            answerText: q.answerText,
            marks: q.marks ?? 1,
            sortOrder: idx,
          })),
        },
      },
      include: { questions: true },
    });
  }

  async startQuizAttempt(quizId: string, studentId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          select: {
            id: true,
            type: true,
            prompt: true,
            options: true,
            marks: true,
            sortOrder: true,
          },
        },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const pastAttempts = await this.prisma.quizAttempt.count({
      where: { quizId, studentId },
    });
    if (pastAttempts >= quiz.maxAttempts) {
      throw new ForbiddenException(`Maximum attempts (${quiz.maxAttempts}) reached for this quiz`);
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        startedAt: new Date(),
      },
    });

    // Strip answers from options if stored
    const sanitizedQuestions = quiz.questions.map((q) => {
      let options = q.options as any[];
      if (Array.isArray(options)) {
        options = options.map(({ id, text }) => ({ id, text }));
      }
      return { ...q, options };
    });

    return {
      attemptId: attempt.id,
      durationMins: quiz.durationMins,
      questions: sanitizedQuestions,
    };
  }

  async submitQuizAttempt(
    attemptId: string,
    studentId: string,
    answers: { questionId: string; response: any }[],
  ) {
    const attempt = await this.prisma.quizAttempt.findFirst({
      where: { id: attemptId, studentId },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    });
    if (!attempt) throw new NotFoundException('Quiz attempt not found');
    if (attempt.submittedAt) throw new BadRequestException('Quiz already submitted');

    let totalScore = 0;
    let maxScore = 0;

    const answerRecords: any[] = [];

    for (const q of attempt.quiz.questions) {
      maxScore += q.marks;
      const given = answers.find((a) => a.questionId === q.id);
      let isCorrect = false;

      if (given) {
        if (q.type === 'MCQ_SINGLE' || q.type === 'TRUE_FALSE') {
          const opts = (q.options as any[]) || [];
          const correctOpt = opts.find((o) => o.correct === true);
          if (correctOpt && String(correctOpt.id) === String(given.response)) {
            isCorrect = true;
          }
        } else if (q.type === 'SHORT_ANSWER') {
          if (q.answerText && String(given.response).trim().toLowerCase() === q.answerText.trim().toLowerCase()) {
            isCorrect = true;
          }
        }
      }

      const awarded = isCorrect ? q.marks : 0;
      totalScore += awarded;

      answerRecords.push({
        attemptId: attempt.id,
        questionId: q.id,
        response: given?.response ?? null,
        isCorrect,
        awarded,
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= attempt.quiz.passingPercent;

    await this.prisma.$transaction([
      this.prisma.quizAnswer.createMany({ data: answerRecords }),
      this.prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          submittedAt: new Date(),
          score: totalScore,
          maxScore,
          passed,
        },
      }),
      // Award XP to student if passed!
      ...(passed
        ? [
            this.prisma.xpEvent.create({
              data: {
                studentId,
                points: totalScore * 10,
                reason: `Passed quiz: ${attempt.quiz.title}`,
              },
            }),
            this.prisma.studentProfile.update({
              where: { id: studentId },
              data: { xp: { increment: totalScore * 10 } },
            }),
          ]
        : []),
    ]);

    return {
      score: totalScore,
      maxScore,
      percentage,
      passed,
      passingPercent: attempt.quiz.passingPercent,
    };
  }
}
