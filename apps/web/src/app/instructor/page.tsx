'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  Plus,
  AlertCircle,
  GraduationCap,
  LogOut,
  ExternalLink,
  Award,
  Layers,
  Send,
  Edit3,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function InstructorPortalPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'batches' | 'grading' | 'schedule' | 'create-assignment'>('batches');

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Excellent hands-on topology configuration. All criteria met.');
  const [gradingLoading, setGradingLoading] = useState(false);
  const [gradingSuccess, setGradingSuccess] = useState<string | null>(null);

  // Live Class Scheduling Form State
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [classTopic, setClassTopic] = useState('');
  const [classStartsAt, setClassStartsAt] = useState('');
  const [classEndsAt, setClassEndsAt] = useState('');
  const [classMeetingUrl, setClassMeetingUrl] = useState('');
  const [classLoading, setClassLoading] = useState(false);
  const [classSuccess, setClassSuccess] = useState<string | null>(null);

  // Assignment Creation Form State
  const [asgBatchId, setAsgBatchId] = useState('');
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgDueAt, setAsgDueAt] = useState('');
  const [asgMaxMarks, setAsgMaxMarks] = useState(100);
  const [asgLoading, setAsgLoading] = useState(false);
  const [asgSuccess, setAsgSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInstructorData();
  }, []);

  const loadInstructorData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bits_access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/learning/instructor/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('bits_access_token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load instructor portal data.');
      }

      const result = await res.json();
      setData(result);
      if (result.batches && result.batches.length > 0) {
        setSelectedBatchId(result.batches[0].batchId);
        setAsgBatchId(result.batches[0].batchId);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to instructor management server.');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    const token = localStorage.getItem('bits_access_token');
    if (!token) return;

    setGradingLoading(true);
    setGradingSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/api/learning/submissions/${selectedSubmission.id}/grade`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marks: Number(gradeMarks),
          feedback: gradeFeedback,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Failed to submit grade');

      setGradingSuccess('Grade recorded successfully and student notified!');
      setTimeout(() => {
        setSelectedSubmission(null);
        setGradingSuccess(null);
        loadInstructorData();
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Grading failed');
    } finally {
      setGradingLoading(false);
    }
  };

  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    const token = localStorage.getItem('bits_access_token');
    if (!token) return;

    setClassLoading(true);
    setClassSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/api/learning/batches/${selectedBatchId}/live-classes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: classTopic,
          startsAt: classStartsAt,
          endsAt: classEndsAt,
          meetingUrl: classMeetingUrl || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to create live class');

      setClassSuccess('Live class scheduled and published to student dashboards!');
      setClassTopic('');
      setClassMeetingUrl('');
      await loadInstructorData();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule class');
    } finally {
      setClassLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgBatchId) return;
    const token = localStorage.getItem('bits_access_token');
    if (!token) return;

    setAsgLoading(true);
    setAsgSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/api/learning/batches/${asgBatchId}/assignments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: asgTitle,
          description: asgDesc,
          dueAt: asgDueAt,
          maxMarks: Number(asgMaxMarks),
        }),
      });

      if (!res.ok) throw new Error('Failed to create assignment');

      setAsgSuccess('Assignment published to the selected batch!');
      setAsgTitle('');
      setAsgDesc('');
      await loadInstructorData();
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    } finally {
      setAsgLoading(false);
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
          <div className="text-base font-bold text-slate-800">Loading Instructor Workspace...</div>
          <div className="text-xs text-slate-500">Retrieving assigned batches, student rosters and pending submissions...</div>
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
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">{error || 'Instructor profile not found or insufficient privileges.'}</p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#0056D2] text-white rounded-xl text-xs font-bold hover:bg-[#0041a8] transition-all"
            >
              Sign In with Instructor Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { instructor, stats, batches, pendingSubmissions } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>FACULTY & INSTRUCTOR PORTAL</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
                  {instructor.headline || 'Senior Technical Instructor'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {instructor.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {instructor.email} • Managing {stats.totalBatches} Active Batch{stats.totalBatches !== 1 ? 'es' : ''} • Teaching {stats.totalStudents} Enrolled Cadet{stats.totalStudents !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Quick Metrics & Logout */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-xl font-black text-slate-900">{stats.totalBatches}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Batches</div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-xl font-black text-[#0056D2]">{stats.totalStudents}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Students</div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-xl font-black text-amber-600">{stats.pendingGradingCount}</div>
                <div className="text-[10px] text-amber-700 uppercase font-bold">Pending Review</div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out of instructor portal"
                className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'batches'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Assigned Batches & Rosters ({batches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'grading'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submissions & Grading ({pendingSubmissions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Schedule Live Class</span>
            </button>
            <button
              onClick={() => setActiveTab('create-assignment')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'create-assignment'
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Assignment</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: BATCHES & STUDENTS ROSTER ── */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            {batches.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Batches Currently Assigned</h3>
                <p className="text-xs text-slate-500">Contact institute admin to assign you as lead or assistant instructor to active batches.</p>
              </div>
            ) : (
              batches.map((b: any) => (
                <div key={b.batchId} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {b.role} INSTRUCTOR
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{b.courseTitle}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{b.batchName}</h3>
                      <p className="text-xs text-slate-500">
                        Delivery Mode: <strong>{b.mode}</strong> • Shift: <strong>{b.scheduleNote || 'Scheduled sessions'}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-xs text-slate-500">Active Students Roster</div>
                      <div className="text-2xl font-black text-[#0056D2]">{b.activeStudentsCount}</div>
                    </div>
                  </div>

                  {/* Student list table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students in this Batch</h4>
                    {b.students.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 text-slate-400 text-xs text-center border border-slate-200">
                        No students enrolled in this batch yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                            <tr>
                              <th className="p-3">Registration ID</th>
                              <th className="p-3">Student Name</th>
                              <th className="p-3">Email Address</th>
                              <th className="p-3">Enrolled Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {b.students.map((st: any) => (
                              <tr key={st.id} className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono font-semibold text-[#0056D2]">{st.registrationNo}</td>
                                <td className="p-3 font-bold text-slate-900">{st.name}</td>
                                <td className="p-3 text-slate-500">{st.email}</td>
                                <td className="p-3 text-slate-500">{new Date(st.joinedAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 2: PENDING SUBMISSIONS & GRADING ── */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Assignment Submissions</h2>
                <p className="text-xs text-slate-500">Review lab tasks, inspect configurations, and award grades with constructive feedback.</p>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <div className="text-sm font-bold text-slate-700">All Caught Up!</div>
                  <p>There are no pending student submissions requiring grading in your assigned batches.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Awaiting Grade
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">Max: {sub.maxMarks} Marks</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{sub.assignmentTitle}</h4>
                        <p className="text-xs text-slate-600">
                          Student: <strong className="text-slate-900">{sub.student?.user?.firstName} {sub.student?.user?.lastName}</strong> • Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                        {sub.text && (
                          <p className="text-xs text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-2 max-w-xl">
                            "{sub.text}"
                          </p>
                        )}
                        {sub.links && sub.links.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {sub.links.map((link: string, idx: number) => (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-[#0056D2] hover:underline flex items-center gap-1 font-semibold"
                              >
                                <span>Submission Link {idx + 1}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setGradeMarks(Math.round(sub.maxMarks * 0.85));
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-xs transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Grade & Feedback</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: SCHEDULE LIVE CLASS ── */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Schedule Live Lecture / Lab Demo</h2>
                <p className="text-xs text-slate-500">Live sessions immediately show up on enrolled student portal dashboards.</p>
              </div>

              {classSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{classSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateLiveClass} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Batch</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  >
                    {batches.map((b: any) => (
                      <option key={b.batchId} value={b.batchId}>
                        {b.batchName} ({b.courseTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Topic / Lecture Title</label>
                  <input
                    type="text"
                    required
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    placeholder="e.g. OSPF Routing Protocol & Multi-Area Lab Demonstration"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Starts At (Date & Time)</label>
                    <input
                      type="datetime-local"
                      required
                      value={classStartsAt}
                      onChange={(e) => setClassStartsAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Ends At (Date & Time)</label>
                    <input
                      type="datetime-local"
                      required
                      value={classEndsAt}
                      onChange={(e) => setClassEndsAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Meeting / Zoom URL</label>
                  <input
                    type="url"
                    value={classMeetingUrl}
                    onChange={(e) => setClassMeetingUrl(e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={classLoading}
                  className="px-6 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  {classLoading ? 'Scheduling...' : 'Schedule Live Class'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 4: PUBLISH ASSIGNMENT ── */}
        {activeTab === 'create-assignment' && (
          <div className="space-y-6">
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Publish Lab Assignment</h2>
                <p className="text-xs text-slate-500">Provide instructions, guidelines, and submission deadlines.</p>
              </div>

              {asgSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{asgSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Batch</label>
                  <select
                    value={asgBatchId}
                    onChange={(e) => setAsgBatchId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  >
                    {batches.map((b: any) => (
                      <option key={b.batchId} value={b.batchId}>
                        {b.batchName} ({b.courseTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={asgTitle}
                    onChange={(e) => setAsgTitle(e.target.value)}
                    placeholder="e.g. Cisco Packet Tracer Lab: VLAN Routing & EtherChannel"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Task Instructions</label>
                  <textarea
                    rows={4}
                    required
                    value={asgDesc}
                    onChange={(e) => setAsgDesc(e.target.value)}
                    placeholder="Describe tasks, required deliverables, topology diagram guidelines, and evaluation rubrics..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Submission Due Date</label>
                    <input
                      type="date"
                      required
                      value={asgDueAt}
                      onChange={(e) => setAsgDueAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Maximum Marks</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={100}
                      value={asgMaxMarks}
                      onChange={(e) => setAsgMaxMarks(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={asgLoading}
                  className="px-6 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  {asgLoading ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── GRADING MODAL ── */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grade Student Submission</h3>
                  <p className="text-xs text-slate-500">{selectedSubmission.assignmentTitle}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {gradingSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{gradingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleGradeSubmission} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Awarded Marks (Max: {selectedSubmission.maxMarks})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={selectedSubmission.maxMarks}
                    required
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Instructor Feedback Note</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056D2]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={gradingLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                  >
                    {gradingLoading ? 'Submitting...' : 'Confirm Grade & Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
