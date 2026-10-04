'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Terminal,
  Code2,
  Cpu,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  priceMinor: number;
  durationLabel: string;
  category?: {
    name: string;
    slug: string;
  };
  _count?: {
    batches?: number;
  };
}

// Domain-specific metadata enhancement for maximum visual appeal
const COURSE_ENHANCEMENTS: Record<string, {
  badge: string;
  tagline: string;
  gradient: string;
  iconBg: string;
  icon: any;
  bullets: string[];
  instructor: { name: string; title: string; initials: string };
  urgency: string;
  urgencyColor: string;
  reviews: number;
}> = {
  'ccna-enterprise-networking': {
    badge: '★ #1 Most Enrolled',
    tagline: 'Physical Cisco 2960/2911 Rack Hardware',
    gradient: 'from-[#0056D2] via-[#0041a8] to-[#002875]',
    iconBg: 'bg-blue-600/30 text-white',
    icon: Server,
    bullets: [
      'Physical Cisco 2960 switches & 2911 series routers access',
      'OSPFv2, VLAN Trunking, STP & IPv4/IPv6 Subnetting mastery',
      'Official Cisco CCNA 200-301 Exam Simulation & Prep',
    ],
    instructor: { name: 'Engr. Ahmed Khan', title: 'CCIE Enterprise #49218', initials: 'AK' },
    urgency: 'Only 2 Seats Left',
    urgencyColor: 'bg-rose-50 text-rose-700 border-rose-200',
    reviews: 342,
  },
  'ethical-hacking-offensive-security': {
    badge: '🔥 Highest Career Demand',
    tagline: 'Real Cyber Range Sandbox Lab',
    gradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    icon: Terminal,
    bullets: [
      'Kali Linux, Metasploit, Nmap & Burp Suite Professional',
      'Live vulnerability exploitation in isolated sandbox environments',
      'CEH & OSCP Practical Methodology with Tamper-Proof Credential',
    ],
    instructor: { name: 'Dr. Farhan', title: 'OSCP & Lead Penetration Tester', initials: 'DF' },
    urgency: 'Filling Fast • 4 Seats Open',
    urgencyColor: 'bg-amber-50 text-amber-700 border-amber-200',
    reviews: 289,
  },
  'full-stack-web-development': {
    badge: '⚡ Production Portfolio',
    tagline: 'Next.js 16, TypeScript & PostgreSQL',
    gradient: 'from-[#0369A1] via-[#0284C7] to-[#075985]',
    iconBg: 'bg-cyan-500/20 text-cyan-200',
    icon: Code2,
    bullets: [
      'Modern React 19, Next.js 16 App Router & Tailwind CSS',
      'Node.js REST APIs, PostgreSQL database & Prisma ORM',
      'Build & deploy 3 enterprise full-stack web applications',
    ],
    instructor: { name: 'Sara Malik', title: 'Senior Cloud Solutions Architect', initials: 'SM' },
    urgency: 'Weekend Batch Open',
    urgencyColor: 'bg-blue-50 text-blue-700 border-blue-200',
    reviews: 215,
  },
  'ai-machine-learning-python': {
    badge: '🚀 Cutting-Edge 2026',
    tagline: 'PyTorch, Deep Learning & Generative AI',
    gradient: 'from-[#4338CA] via-[#4F46E5] to-[#312E81]',
    iconBg: 'bg-indigo-500/20 text-indigo-200',
    icon: Cpu,
    bullets: [
      'Python data analysis with Pandas, NumPy & Scikit-Learn',
      'Neural networks, computer vision & NLP with PyTorch',
      'Fine-tuning Large Language Models (LLMs) & AI agent APIs',
    ],
    instructor: { name: 'Dr. Farhan & Team', title: 'AI & Data Research Lead', initials: 'FT' },
    urgency: 'Evening Cohort Open',
    urgencyColor: 'bg-purple-50 text-purple-700 border-purple-200',
    reviews: 198,
  },
};

export function FeaturedCoursesShowcase({ courses }: { courses: Course[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Filter categories
  const categories = [
    { key: 'ALL', label: 'All Programs' },
    { key: 'Networking', label: 'Cisco Networking' },
    { key: 'Cyber Security', label: 'Cyber Security' },
    { key: 'Web Development', label: 'Full-Stack Web' },
    { key: 'Artificial Intelligence', label: 'AI & Machine Learning' },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeCategory === 'ALL') return true;
    return course.category?.name?.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-10">
      {/* ── SECTION HEADER & CATEGORY FILTER TABS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 text-[#0056D2] text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>International Curriculum • Q2 2026 Admissions Open</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore Career-Accelerating Programs
          </h2>
          <p className="mt-2 text-slate-600 text-sm max-w-2xl leading-relaxed">
            Every curriculum is engineered with hands-on hardware labs, expert instructors, and
            internationally verifiable graduation credentials recognized by industry employers.
          </p>
        </div>

        <Link
          href="/courses"
          className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-[#0056D2] hover:text-[#0041a8] group"
        >
          <span>View all courses & schedules</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── FILTER PILLS (COURSERA STYLE) ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                isActive
                  ? 'bg-[#0056D2] text-white shadow-md shadow-blue-500/20 transform scale-[1.02]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── COURSES CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {filteredCourses.map((course) => {
          const meta = COURSE_ENHANCEMENTS[course.slug] || {
            badge: 'Certified Program',
            tagline: 'Hands-on Practical Labs',
            gradient: 'from-[#0056D2] to-[#0284C7]',
            iconBg: 'bg-blue-600/20 text-white',
            icon: Server,
            bullets: [
              'Comprehensive hands-on laboratory exercises',
              'Experienced certified trainers and mentoring',
              'Verifiable BITS Institute Graduation Certificate',
            ],
            instructor: { name: 'Faculty Member', title: 'Senior Certified Trainer', initials: 'BF' },
            urgency: 'Batches Open',
            urgencyColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            reviews: 180,
          };
          const Icon = meta.icon;

          return (
            <div
              key={course.id}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-[#0056D2]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* ── CARD TOP ACCENT BANNER (WITH TECH ICON & BADGES) ── */}
              <div className={`p-5 bg-gradient-to-br ${meta.gradient} text-white relative overflow-hidden`}>
                {/* Background decorative graphic */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                <div className="flex items-center justify-between gap-2 relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {meta.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    {course.durationLabel || '3 Months'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 relative z-10">
                  <div className={`w-11 h-11 rounded-xl ${meta.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-cyan-200 font-bold uppercase tracking-wider block">
                      {course.category?.name || 'Technology'}
                    </span>
                    <span className="text-xs font-semibold text-white/90 line-clamp-1">
                      {meta.tagline}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── CARD BODY ── */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Urgency Pill */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.urgencyColor}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {meta.urgency}
                    </span>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                      <span className="text-slate-400 font-normal">({meta.reviews})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  {/* Key Takeaways Checklist */}
                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Practical Competencies
                    </span>
                    {meta.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[11px] leading-tight font-medium">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Instructor Credit */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0056D2] text-[11px] font-extrabold flex items-center justify-center">
                      {meta.instructor.initials}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">
                        {meta.instructor.name}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
                        {meta.instructor.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CARD FOOTER: PRICING & ACTION BUTTONS ── */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Tuition Fee
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        PKR {(course.priceMinor / 100).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Installments Available
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all"
                    >
                      Syllabus
                    </Link>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── UPCOMING BATCHES LIVE TIMETABLE RIBBON ── */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 rounded-2xl p-5 sm:p-6 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0056D2]">
                Upcoming Cohort Schedule
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Weekend Batches (Sat & Sun 2:00 PM – 6:00 PM) & Evening Classes (Mon–Thu 6:00 PM – 8:00 PM)
            </p>
            <p className="text-xs text-slate-500">
              Classes commence on April 15, 2026 • Limited hardware workstations per physical batch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/contact"
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition-all text-center"
          >
            Speak to Advisor
          </Link>
          <Link
            href="/courses"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-sm transition-all text-center"
          >
            View Timetable & Enroll →
          </Link>
        </div>
      </div>
    </div>
  );
}
