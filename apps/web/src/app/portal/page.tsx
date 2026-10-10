'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
  HelpCircle,
  ExternalLink,
  Printer,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function StudentPortalPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'classes' | 'assignments' | 'certificates'>('courses');
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bits_access_token') : null;
    if (!token) {
      router.push('/login?role=student');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/learning/student/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('bits_access_token');
        router.push('/login?role=student');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load student dashboard. Please try again.');
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to learning portal server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    const token = localStorage.getItem('bits_access_token');
    if (!token) return;

    setCompletingLessonId(lessonId);
    try {
      const res = await fetch(`http://localhost:4000/api/learning/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Refresh dashboard data dynamically
        await loadDashboard();
      }
    } catch (e) {
    } finally {
      setCompletingLessonId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bits_access_token');
    localStorage.removeItem('bits_refresh_token');
    localStorage.removeItem('bits_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-base font-bold text-slate-800">Loading Student Learning Portal...</div>
          <div className="text-xs text-slate-500">Syncing enrolled curriculum, live schedules and attendance...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Portal Sync Error</h2>
          <p className="text-xs text-slate-600">{error || 'Unable to load student profile.'}</p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={loadDashboard}
              className="px-4 py-2 bg-[#0056D2] text-white rounded-xl text-xs font-bold hover:bg-[#0041a8] transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Log In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, courses, certificates } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Student Identification Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>STUDENT LEARNING PORTAL</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono font-semibold">
                  REG: {profile.registrationNo}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                {profile.email} • {stats.enrolledCoursesCount} Active Enrollment{stats.enrolledCoursesCount !== 1 ? 's' : ''} • Overall Curriculum Progress: <strong className="text-[#0056D2]">{stats.overallProgress}%</strong>
              </p>
            </div>

            {/* Student Gamified Metrics: Level, XP, Streak, Logout */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              {/* Level */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#0056D2] font-black text-lg">
                  {profile.level || 1}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Student Rank</div>
                  <div className="text-xs font-bold text-slate-900">Cadet Level {profile.level || 1}</div>
                </div>
              </div>

              {/* XP */}
              <div className="space-y-1 min-w-[130px] pr-4 border-r border-slate-200">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">Earned XP</span>
                  <span className="text-[#0056D2] font-bold">{profile.xp.toLocaleString()} XP</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0056D2] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((profile.xp % 1000) / 1000) * 100 || 20)}%` }}
                  />
                </div>
              </div>

              {/* Attendance */}
              <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{stats.attendancePercentage}%</div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">Attendance</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign out of student portal"
                className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Enrolled Courses & Modules ({courses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'classes'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Live Classes & Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Assignments & Assessments</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Issued Certificates ({certificates.length})</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: ENROLLED COURSES & SYLLABUS PROGRESS ── */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No Enrolled Courses Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You are not currently enrolled in any active course batches. Explore our career programs to get started.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056D2] text-white text-xs font-bold hover:bg-[#0041a8] transition-all"
                >
                  Browse Available Batches & Enroll
                </Link>
              </div>
            ) : (
              courses.map((course: any) => (
                <div key={course.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  {/* Course Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {course.level} LEVEL
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{course.durationLabel}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
                      {course.batch && (
                        <p className="text-xs text-slate-500">
                          Enrolled in: <strong className="text-slate-800">{course.batch.name}</strong> • Schedule: {course.batch.scheduleNote || 'TBA'}
                          {course.batch.instructors.length > 0 && ` • Instructor: ${course.batch.instructors[0].name}`}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right shrink-0 space-y-1.5">
                      <div className="text-xs text-slate-500 font-semibold">Course Completion</div>
                      <div className="text-2xl font-black text-[#0056D2]">{course.progressPct}%</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {course.completedCount} of {course.totalLessons} Lessons Completed
                      </div>
                    </div>
                  </div>

                  {/* Modules Accordion / List */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Curriculum & Learning Modules</h3>
                    <div className="space-y-3">
                      {course.modules.map((module: any, mIdx: number) => (
                        <div key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0056D2] flex items-center justify-center text-[10px] font-black">
                                {mIdx + 1}
                              </span>
                              <span>{module.title}</span>
                            </h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              {module.lessons.filter((l: any) => l.completed).length} / {module.lessons.length} Completed
                            </span>
                          </div>

                          {/* Lessons */}
                          <div className="space-y-2">
                            {module.lessons.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                  lesson.completed
                                    ? 'bg-white border-emerald-200 text-slate-800'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                                  )}
                                  <div>
                                    <span className="font-semibold text-slate-900">{lesson.title}</span>
                                    {lesson.durationMins && (
                                      <span className="text-[11px] text-slate-400 ml-2 font-normal">
                                        ({lesson.durationMins} mins)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  {lesson.completed ? (
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      Completed (+25 XP)
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleCompleteLesson(lesson.id)}
                                      disabled={completingLessonId === lesson.id}
                                      className="px-3 py-1 bg-blue-50 hover:bg-[#0056D2] text-[#0056D2] hover:text-white rounded-lg text-[11px] font-bold border border-blue-200 transition-all disabled:opacity-50"
                                    >
                                      {completingLessonId === lesson.id ? 'Marking...' : 'Mark Done'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 2: LIVE CLASSES & SCHEDULE ── */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Upcoming Live Classes & Sessions</h2>
                  <p className="text-xs text-slate-500">Live online lectures, lab demos and interactive Q&A</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Attendance Record</span>
                  <span className="text-base font-extrabold text-emerald-600">{stats.attendancePercentage}% Present</span>
                </div>
              </div>

              {courses.flatMap((c: any) => c.batch?.upcomingClasses || []).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                  <p>No upcoming live sessions scheduled for your active batches at this moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.flatMap((c: any) =>
                    (c.batch?.upcomingClasses || []).map((lc: any) => (
                      <div
                        key={lc.id}
                        className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0">
                            <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056D2] bg-white px-2 py-0.5 rounded-full border border-blue-200">
                              {c.title}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 mt-1">{lc.topic}</h3>
                            <p className="text-xs text-slate-600">
                              {new Date(lc.startsAt).toLocaleString()} – {new Date(lc.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {lc.meetingUrl ? (
                          <a
                            href={lc.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-xs transition-all shrink-0 flex items-center justify-center gap-1.5"
                          >
                            <span>Join Classroom</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold px-3 py-1 bg-white rounded-lg border border-slate-200">
                            Meeting Link Pending
                          </span>
                        )}
                      </div>
                    )),
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: ASSIGNMENTS & QUIZZES ── */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lab Assignments & Continuous Assessments</h2>
                <p className="text-xs text-slate-500">Hands-on tasks and theoretical knowledge evaluations</p>
              </div>

              {courses.flatMap((c: any) => c.batch?.assignments || []).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p>No active assignments assigned to your batches yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.flatMap((c: any) =>
                    (c.batch?.assignments || []).map((a: any) => (
                      <div
                        key={a.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.title}</span>
                          <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                          <p className="text-xs text-slate-500">
                            Due: {new Date(a.dueAt).toLocaleDateString()} • Maximum Score: {a.maxMarks} Marks
                          </p>
                        </div>

                        <div>
                          {a.submission ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {a.submission.status === 'GRADED'
                                  ? `Graded: ${a.submission.marks}/${a.maxMarks}`
                                  : 'Submitted (Pending Review)'}
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                              Pending Submission
                            </span>
                          )}
                        </div>
                      </div>
                    )),
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: ISSUED CERTIFICATES ── */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Official BITS Institute Certificates</h2>
                  <p className="text-xs text-slate-500">Cryptographically verifiable graduation credentials</p>
                </div>
                <Link
                  href="/verify"
                  className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1"
                >
                  <span>Public Registry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-3">
                  <Award className="w-12 h-12 mx-auto text-slate-300" />
                  <div className="font-bold text-slate-700 text-sm">No Issued Certificates Yet</div>
                  <p className="max-w-md mx-auto text-slate-500">
                    Certificates are issued upon successful completion of all required lessons, lab assignments, and passing the final assessment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert: any) => (
                    <div
                      key={cert.id}
                      className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/20 via-white to-blue-50/30 p-6 space-y-5 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              OFFICIAL CREDENTIAL
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-1">{cert.courseTitle}</h3>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Verification Serial ID</div>
                        <div className="text-[#0056D2] font-bold text-sm tracking-wide">{cert.code}</div>
                        <div className="text-slate-500 font-sans text-[11px] pt-1">
                          Grade: <strong className="text-slate-900">{cert.grade || 'Pass (Distinction)'}</strong> • Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Link
                          href={`/verify?code=${encodeURIComponent(cert.code)}`}
                          className="flex-1 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify Authenticity</span>
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
