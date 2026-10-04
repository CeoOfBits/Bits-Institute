import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

async function getCourse(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/public/courses/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: 'Course Not Found — BITS Institute' };

  return {
    title: course.seoTitle || `${course.title} — BITS Institute`,
    description: course.seoDescription || course.shortDescription,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen space-y-16 pb-20">
      {/* ── COURSE HERO (CLEAN BLUE TINT) ── */}
      <section className="bg-gradient-to-b from-blue-50/80 via-white to-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0056D2]">
                {course.category?.name}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Level: {course.level}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                {course.durationLabel} ({course.durationHours} Hours Lab)
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {course.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0056D2]" />
                <span>Verifiable BITS Certificate ({course.certificateCode})</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hands-on Enterprise Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT & BATCHES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Overview, Outcomes, Curriculum, FAQs */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Course Overview</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </section>

            {/* Learning Outcomes */}
            {course.outcomes?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">What You Will Learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.outcomes.map((outcome: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 leading-relaxed font-medium">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum Breakdown */}
            {course.modules?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Curriculum & Modules</h2>
                  <span className="text-xs font-semibold text-slate-500">
                    {course.modules.length} Modules Total
                  </span>
                </div>

                <div className="space-y-3">
                  {course.modules.map((mod: any, mIdx: number) => (
                    <div
                      key={mod.id || mIdx}
                      className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
                    >
                      <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                        <span>{mod.title}</span>
                        <span className="text-xs text-[#0056D2] font-semibold">
                          {mod.lessons?.length || 0} Lessons
                        </span>
                      </div>

                      {mod.lessons?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {mod.lessons.map((lesson: any, lIdx: number) => (
                            <div
                              key={lesson.id || lIdx}
                              className="flex items-center justify-between text-xs py-1.5 text-slate-700"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-[#0056D2]" />
                                <span>{lesson.title}</span>
                                {lesson.isPreview && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#0056D2]">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              {lesson.durationMins && (
                                <span className="text-slate-400">{lesson.durationMins} mins</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisites */}
            {course.requirements?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Prerequisites</h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {course.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0056D2]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {course.faqs?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {course.faqs.map((faq: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                    >
                      <h3 className="font-bold text-slate-900">{faq.question}</h3>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Dynamic Batches & Capacity (Coursera Sidebar Style) */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md sticky top-28 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold mb-1">
                  Tuition Fee
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    PKR {(course.priceMinor / 100).toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">Installment Options</span>
                </div>
              </div>

              {/* Batches with Live Capacity */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Available Batches
                  </h3>
                  <span className="text-xs text-[#0056D2] font-semibold">
                    {course.batches?.length || 0} Open
                  </span>
                </div>

                {course.batches?.length === 0 ? (
                  <p className="text-xs text-slate-500">No active cohorts right now. Contact admissions for upcoming dates.</p>
                ) : (
                  <div className="space-y-3">
                    {course.batches.map((batch: any) => {
                      const isFull = batch.seatsRemaining === 0;
                      return (
                        <div
                          key={batch.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isFull
                              ? 'bg-slate-50 border-rose-200'
                              : 'bg-blue-50/50 border-blue-200 hover:border-[#0056D2]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{batch.name}</div>
                              <div className="text-[11px] text-slate-500">
                                Shift: {batch.shift || 'Evening'} • {batch.mode}
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isFull
                                  ? 'bg-rose-100 text-rose-800'
                                  : batch.seatsRemaining <= 3
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {batch.seatsLabel}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                            <div>Schedule: {batch.scheduleNote || 'TBA'}</div>
                            <div>
                              Starts: {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="font-medium text-slate-700">
                              Enrolled: {batch.enrolled || 0} / {batch.capacity} Students
                            </div>
                          </div>

                          <div className="mt-3 pt-2">
                            {isFull ? (
                              <button
                                disabled
                                className="w-full py-2 rounded-lg bg-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed"
                              >
                                Batch Full • Waitlist Only
                              </button>
                            ) : (
                              <Link
                                href={`/contact?enroll=true&course=${course.slug}&batch=${batch.id}`}
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs transition-all"
                              >
                                <span>Reserve Seat in Batch {batch.code}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* BITS Guarantee */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                  <span>BITS Academic Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Includes physical lab hardware access, official study guides, LMS access with gamified XP tracking,
                  and verifiable graduation certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
