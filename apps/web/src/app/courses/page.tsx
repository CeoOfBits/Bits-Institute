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
  ShieldCheck,
  Award,
  GraduationCap,
  Users,
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
    <div className="bg-white min-h-screen space-y-16 pb-16">
      {/* ── HERO BANNER (MATCHING HOME & SERVICES MODERN DARK HIGH-TECH STYLE) ── */}
      <section className="relative overflow-hidden bg-[#040714] text-white pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-20 border-b border-cyan-950/40">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-cyan-500/12 rounded-full blur-[150px] pointer-events-none -z-0" />
        <div className="absolute -top-20 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-0" />

        {/* Cyber Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none -z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(14,165,233,0.2),rgba(4,7,20,0.96))] pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span>Interactive Enterprise Curricula • Admissions Open Q2 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Certified Technology Courses &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                Active Cohorts
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Every program features hands-on physical Cisco hardware labs, certified mentors, live projects,
              and verifiable graduation certificates recognized by industry employers globally.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <a
                href="#courses-catalog"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Explore Open Batches</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 hover:border-cyan-400/50 backdrop-blur-md transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify a Credential</span>
              </Link>
            </div>
          </div>

          {/* ── 4-PILLAR ACADEMY GUARANTEE BARS (SAME DESIGN AS HOME PAGE) ── */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Physical Cisco Hardware</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Real 2960 switches & 2911 routers. Hands-on console cable configuration.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Cyber Range Sandboxes</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Offensive penetration testing, defensive SOC analysis, and Kali Linux labs.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">16-Student Lab Cap</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Guaranteed individual hardware access for every enrolled student.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Verifiable Credentials</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Globally verified certificates with instant public QR registry check.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES CATALOG & FILTER AREA ── */}
      <div id="courses-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Link
            href="/courses#courses-catalog"
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              !category
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Programs
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}#courses-catalog`}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === cat.slug
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
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
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* ── CARD TOP ACCENT BANNER ── */}
                <div className={`p-4 sm:p-5 bg-gradient-to-br ${meta.gradient} text-white relative overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {meta.badge}
                    </span>
                    <span className="text-[11px] font-medium text-blue-100 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-200" />
                      {course.durationLabel || '3 Months'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5 relative z-10">
                    <div className={`w-10 h-10 rounded-xl ${meta.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider block">
                        {course.category?.name || 'Technology'}
                      </span>
                      <span className="text-xs font-semibold text-white/90">
                        {meta.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── CARD BODY ── */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Urgency Pill & Rating */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.urgencyColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {meta.urgency}
                      </span>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal text-[11px]">({meta.reviews})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug">
                      <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>

                    {/* Bullet Points */}
                    <div className="pt-2.5 space-y-1.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Hands-on Competencies Covered
                      </span>
                      {meta.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight font-normal">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Instructor */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0056D2] text-[10px] font-bold flex items-center justify-center">
                        {meta.instructor.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 leading-tight">
                          {meta.instructor.name}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          {meta.instructor.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CARD FOOTER ── */}
                  <div className="pt-3 border-t border-slate-100 mt-2 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tuition</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900">
                          PKR {(course.priceMinor / 100).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Installments Available
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-all"
                      >
                        Syllabus & Labs
                      </Link>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2 px-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold text-center shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Lab Hardware Capacity Notice
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                To guarantee individual Cisco switch/router access, each batch is strictly capped at 16 students.
              </p>
              <p className="text-[11px] text-slate-400">
                Weekend and evening batch workstations are allocated on a first-come, first-served basis.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all text-center"
          >
            Reserve Your Hardware Workstation →
          </Link>
        </div>
      </div>
    </div>
  );
}
