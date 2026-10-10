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

  // ───────────────────────── Student Dashboard (Real Data) ─────────────────────────

  async getStudentDashboard(userId: string) {
    let student = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        certificates: {
          include: { course: { select: { title: true, slug: true, durationLabel: true } } },
          orderBy: { issuedAt: 'desc' },
        },
      },
    });

    if (!student) {
      // Auto-initialize student profile if authenticated user logs in as student
      student = await this.prisma.studentProfile.create({
        data: {
          userId,
          registrationNo: `BITS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
          certificates: {
            include: { course: { select: { title: true, slug: true, durationLabel: true } } },
            orderBy: { issuedAt: 'desc' },
          },
        },
      });
    }

    // Load active enrollments
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { studentId: student.id, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: { orderBy: { sortOrder: 'asc' } } },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        batchEnrollments: {
          where: { status: 'ACTIVE' },
          include: {
            batch: {
              include: {
                instructors: { include: { instructor: { include: { user: { select: { firstName: true, lastName: true } } } } } },
                liveClasses: {
                  where: { startsAt: { gte: new Date(Date.now() - 3600000) } },
                  orderBy: { startsAt: 'asc' },
                  take: 3,
                },
                assignments: {
                  include: {
                    submissions: { where: { studentId: student.id } },
                  },
                  orderBy: { dueAt: 'asc' },
                },
                quizzes: {
                  include: {
                    attempts: { where: { studentId: student.id }, orderBy: { startedAt: 'desc' } },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Completed lessons
    const completedLessons = await this.prisma.lessonProgress.findMany({
      where: { studentId: student.id, completedAt: { not: null } },
      select: { lessonId: true },
    });
    const completedLessonIds = new Set(completedLessons.map((l) => l.lessonId));

    // Attendance stats
    const attendanceStats = await this.getStudentAttendanceSummary(student.id);

    // Calculate total & completed lessons across enrolled courses
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const formattedCourses = enrollments.map((enr) => {
      const course = enr.course;
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const cTotal = allLessons.length;
      const cCompleted = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
      totalLessonsCount += cTotal;
      completedLessonsCount += cCompleted;

      const progressPct = cTotal > 0 ? Math.round((cCompleted / cTotal) * 100) : 0;
      const activeBatch = enr.batchEnrollments[0]?.batch;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        durationLabel: course.durationLabel,
        level: course.level,
        progressPct,
        completedCount: cCompleted,
        totalLessons: cTotal,
        batch: activeBatch
          ? {
              id: activeBatch.id,
              name: activeBatch.name,
              code: activeBatch.code,
              mode: activeBatch.mode,
              scheduleNote: activeBatch.scheduleNote,
              instructors: activeBatch.instructors.map((i) => ({
                name: `${i.instructor.user.firstName} ${i.instructor.user.lastName}`,
                role: i.role,
              })),
              upcomingClasses: activeBatch.liveClasses,
              assignments: activeBatch.assignments.map((a) => ({
                id: a.id,
                title: a.title,
                dueAt: a.dueAt,
                maxMarks: a.maxMarks,
                submission: a.submissions[0] || null,
              })),
              quizzes: activeBatch.quizzes.map((q) => ({
                id: q.id,
                title: q.title,
                durationMins: q.durationMins,
                passingPercent: q.passingPercent,
                latestAttempt: q.attempts[0] || null,
              })),
            }
          : null,
        modules: course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            durationMins: l.durationMins,
            type: l.type,
            completed: completedLessonIds.has(l.id),
          })),
        })),
      };
    });

    const overallProgress = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    return {
      profile: {
        id: student.id,
        registrationNo: student.registrationNo,
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        xp: student.xp,
        level: student.level,
        streakDays: student.streakDays,
      },
      stats: {
        enrolledCoursesCount: enrollments.length,
        overallProgress,
        completedLessonsCount,
        totalLessonsCount,
        attendancePercentage: attendanceStats.percentage,
        attendanceSummary: attendanceStats,
      },
      courses: formattedCourses,
      certificates: student.certificates.map((c) => ({
        id: c.id,
        code: c.code,
        courseTitle: c.course.title,
        grade: c.grade,
        status: c.status,
        issuedAt: c.issuedAt,
      })),
    };
  }

  async completeLesson(lessonId: string, userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const progress = await this.prisma.lessonProgress.upsert({
      where: { lessonId_studentId: { lessonId, studentId: student.id } },
      update: { completedAt: new Date() },
      create: { lessonId, studentId: student.id, completedAt: new Date() },
    });

    // Reward 25 XP
    await this.prisma.$transaction([
      this.prisma.xpEvent.create({
        data: {
          studentId: student.id,
          points: 25,
          reason: 'Lesson completed',
        },
      }),
      this.prisma.studentProfile.update({
        where: { id: student.id },
        data: { xp: { increment: 25 } },
      }),
    ]);

    return { success: true, progress };
  }

  // ───────────────────────── Instructor Portal (Real Data) ─────────────────────────

  async getInstructorDashboard(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        batchRoles: {
          include: {
            batch: {
              include: {
                course: { select: { id: true, title: true, slug: true } },
                enrollments: {
                  where: { status: 'ACTIVE' },
                  include: {
                    student: {
                      include: { user: { select: { firstName: true, lastName: true, email: true } } },
                    },
                  },
                },
                liveClasses: {
                  where: { startsAt: { gte: new Date(Date.now() - 3600000) } },
                  orderBy: { startsAt: 'asc' },
                  take: 5,
                },
                assignments: {
                  include: {
                    submissions: {
                      include: {
                        student: { include: { user: { select: { firstName: true, lastName: true } } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found for this user');
    }

    const assignedBatches = instructor.batchRoles.map((br) => {
      const b = br.batch;
      const pendingSubmissions = b.assignments.flatMap((a) =>
        a.submissions.filter((s) => s.status === 'SUBMITTED').map((s) => ({
          ...s,
          assignmentTitle: a.title,
          maxMarks: a.maxMarks,
        })),
      );

      return {
        batchId: b.id,
        role: br.role,
        batchName: b.name,
        batchCode: b.code,
        courseTitle: b.course.title,
        mode: b.mode,
        scheduleNote: b.scheduleNote,
        activeStudentsCount: b.enrollments.length,
        students: b.enrollments.map((enr) => ({
          id: enr.student.id,
          registrationNo: enr.student.registrationNo,
          name: `${enr.student.user.firstName} ${enr.student.user.lastName}`,
          email: enr.student.user.email,
          joinedAt: enr.joinedAt,
        })),
        upcomingClasses: b.liveClasses,
        pendingSubmissions,
      };
    });

    const totalStudents = new Set(
      assignedBatches.flatMap((b) => b.students.map((s) => s.id)),
    ).size;

    const allPendingSubmissions = assignedBatches.flatMap((b) => b.pendingSubmissions);

    return {
      instructor: {
        id: instructor.id,
        name: `${instructor.user.firstName} ${instructor.user.lastName}`,
        email: instructor.user.email,
        headline: instructor.headline,
        expertise: instructor.expertise,
      },
      stats: {
        totalBatches: assignedBatches.length,
        totalStudents,
        pendingGradingCount: allPendingSubmissions.length,
        upcomingClassesCount: assignedBatches.flatMap((b) => b.upcomingClasses).length,
      },
      batches: assignedBatches,
      pendingSubmissions: allPendingSubmissions,
    };
  }
}
