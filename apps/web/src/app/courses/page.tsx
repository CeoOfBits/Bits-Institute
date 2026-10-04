import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  Server,
  Terminal,
  Code2,
  Cpu,
  Calendar,
} from 'lucide-react';

async function getCourses(category?: string, search?: string) {
  try {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);

    const res = await fetch(`http://localhost:4000/api/public/courses?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (err) {}
  return [];
}

async function getCategories() {
  try {
    const res = await fetch('http://localhost:4000/api/public/categories', {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return [];
}

export const metadata = {
  title: 'Our Courses & Active Batches — BITS Institute',
  description: 'Explore certified technology and cybersecurity courses with active upcoming batches at BITS Institute.',
};

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
    badge: '★ Cisco Certified Track',
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

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const [courses, categories] = await Promise.all([getCourses(category, search), getCategories()]);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#0056D2] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Interactive Enterprise Curricula • Admissions Open Q2 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Certified Courses & Active Batches
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every program features hands-on physical labs, certified instructors, real-world project portfolios,
            and verifiable graduation certificates recognized by industry employers.
          </p>
        </div>

        {/* Category Filter Pills (Coursera style) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/courses"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              !category
                ? 'bg-[#0056D2] text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Programs
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                category === cat.slug
                  ? 'bg-[#0056D2] text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {courses.map((course: any) => {
            const meta = COURSE_ENHANCEMENTS[course.slug] || {
              badge: 'Certified Program',
              tagline: 'Practical Laboratory Training',
              gradient: 'from-[#0056D2] to-[#0284C7]',
              iconBg: 'bg-blue-600/20 text-white',
              icon: Server,
              bullets: [
                'Hands-on lab equipment exercises',
                'Certified instructor mentoring & guidance',
                'Verifiable Graduation Certificate',
              ],
              instructor: { name: 'Faculty Member', title: 'Certified Trainer', initials: 'BF' },
              urgency: 'Batch Open',
              urgencyColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              reviews: 150,
            };
            const Icon = meta.icon;

            return (
              <div
                key={course.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-[#0056D2]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* ── CARD TOP ACCENT BANNER ── */}
                <div className={`p-6 bg-gradient-to-br ${meta.gradient} text-white relative overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {meta.badge}
                    </span>
                    <span className="text-xs font-semibold text-blue-100 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-300" />
                      {course.durationLabel || '3 Months'}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3.5 relative z-10">
                    <div className={`w-12 h-12 rounded-xl ${meta.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-cyan-200 font-bold uppercase tracking-wider block">
                        {course.category?.name || 'Technology'}
                      </span>
                      <span className="text-xs font-semibold text-white/90">
                        {meta.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── CARD BODY ── */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    {/* Urgency Pill & Rating */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${meta.urgencyColor}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {meta.urgency}
                      </span>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal">({meta.reviews})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug">
                      <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {course.shortDescription}
                    </p>

                    {/* Bullet Points */}
                    <div className="pt-3 space-y-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Hands-on Competencies Covered
                      </span>
                      {meta.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs leading-tight font-medium">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Instructor */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0056D2] text-xs font-extrabold flex items-center justify-center">
                        {meta.instructor.initials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {meta.instructor.name}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">
                          {meta.instructor.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CARD FOOTER ── */}
                  <div className="pt-5 border-t border-slate-100 mt-4 space-y-3.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuition</span>
                        <span className="text-xl font-black text-slate-900">
                          PKR {(course.priceMinor / 100).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        Installments Available
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all"
                      >
                        Syllabus & Labs
                      </Link>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Strip */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl p-6 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0056D2]">
                  Lab Hardware Capacity Notice
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                To guarantee individual Cisco switch/router access, each batch is capped at 16 students.
              </p>
              <p className="text-xs text-slate-500">
                Weekend and evening batch seats are allocated on a first-come, first-served basis.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-sm transition-all text-center"
          >
            Reserve Your Hardware Workstation →
          </Link>
        </div>
      </div>
    </div>
  );
}
