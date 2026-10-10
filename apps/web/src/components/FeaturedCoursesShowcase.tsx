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
  image: string;
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
    image: '/images/courses/ccna.jpg',
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
    image: '/images/courses/ethical-hacking.jpg',
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
    image: '/images/courses/web-dev.jpg',
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
    image: '/images/courses/ai-python.svg',
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
    <div className="space-y-8">
      {/* ── SECTION HEADER & CATEGORY FILTER TABS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>International Curriculum • Q2 2026 Admissions Open</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore Career-Accelerating Programs
          </h2>
          <p className="mt-1.5 text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Every curriculum is engineered with hands-on hardware labs, expert instructors, and
            internationally verifiable graduation credentials recognized by industry employers.
          </p>
        </div>

        <Link
          href="/courses"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0056D2] hover:text-[#0041a8] group"
        >
          <span>View all courses & schedules</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── FILTER PILLS (REFINED MODERN SIZING) ── */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                isActive
                  ? 'bg-[#0056D2] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── COURSES CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* ── CARD TOP PHOTO BANNER (REAL COURSE IMAGE WITH TECH BADGES) ── */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={meta.image || '/images/courses/ccna.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {meta.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    {course.durationLabel || '3 Months'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${meta.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider block">
                      {course.category?.name || 'Technology'}
                    </span>
                    <span className="text-xs font-bold text-white line-clamp-1 drop-shadow-xs">
                      {meta.tagline}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── CARD BODY ── */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Urgency Pill & Rating */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.urgencyColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {meta.urgency}
                    </span>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                      <span className="text-slate-400 font-normal text-[11px]">({meta.reviews})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  {/* Key Takeaways Checklist */}
                  <div className="pt-2 space-y-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Key Competencies
                    </span>
                    {meta.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[11px] leading-tight font-normal">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Instructor Credit */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0056D2] text-[10px] font-bold flex items-center justify-center">
                      {meta.instructor.initials}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                        {meta.instructor.name}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
                        {meta.instructor.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CARD FOOTER: PRICING & ACTION BUTTONS ── */}
                <div className="pt-3 border-t border-slate-100 mt-2 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Tuition Fee
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-900">
                        PKR {(course.priceMinor / 100).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Installments
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-all"
                    >
                      Syllabus
                    </Link>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="py-2 px-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold text-center shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-1"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── EXPLORE ALL COURSES BUTTON ── */}
      <div className="pt-1 pb-1 text-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/15 transition-all group"
        >
          <span>Explore All Courses & Batches</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── UPCOMING BATCHES LIVE TIMETABLE RIBBON ── */}
      <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056D2]">
                Upcoming Cohort Schedule
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Weekend Batches (Sat & Sun 2:00 PM – 6:00 PM) & Evening Classes (Mon–Thu 6:00 PM – 8:00 PM)
            </p>
            <p className="text-[11px] text-slate-500">
              Classes commence on April 15, 2026 • Limited hardware workstations per physical batch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            href="/contact"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs transition-all text-center"
          >
            Speak to Advisor
          </Link>
          <Link
            href="/courses"
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold shadow-2xs transition-all text-center"
          >
            View Timetable & Enroll →
          </Link>
        </div>
      </div>
    </div>
  );
}
