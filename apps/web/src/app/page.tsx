import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  GraduationCap,
  Terminal,
  Server,
  Code2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  Search,
} from 'lucide-react';
import { FeaturedCoursesShowcase } from '@/components/FeaturedCoursesShowcase';

async function getFeaturedCourses() {
  try {
    const res = await fetch('http://localhost:4000/api/public/courses?pageSize=6', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (err) {}
  return [];
}

export default async function HomePage() {
  const courses = await getFeaturedCourses();

  return (
    <div className="space-y-20 pb-20 bg-white">
      {/* ── HERO BANNER (HIGH-CONVERTING COURSERA BLUE & WHITE STYLE) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Announcement Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-[#0056D2] text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-[#0056D2]" />
                <span>Admissions Open for Q2 2026 Cohorts • Real Cisco Rack Hardware</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Learn Technology & Cyber Security from{' '}
                <span className="text-[#0056D2]">Certified Industry Leaders</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                BITS Institute (Bright Information Technology Solutions) delivers career-accelerating education
                in Cisco Enterprise Networking, Ethical Hacking, Cloud, and Full-Stack Engineering.
                Master real hardware, earn XP in our interactive student LMS, and graduate with verifiable credentials.
              </p>

              {/* ── TWO MAIN STUDENT BUTTONS (STUDENT ENROLLMENT & PORTAL) ── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {/* Button 1: Start Your Learning (Registration for Students) */}
                <Link
                  href="/login?tab=register&role=student"
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#0056D2] hover:bg-[#0041a8] shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 group"
                >
                  <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
                  <span>Start Your Learning</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Button 2: Student Portal Login (Sign In for Existing Students) */}
                <Link
                  href="/login?tab=login&role=student"
                  className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-[#0056D2] bg-blue-50/70 hover:bg-blue-100/90 border-2 border-blue-200 hover:border-[#0056D2] transition-all shadow-xs"
                >
                  <GraduationCap className="w-5 h-5 text-[#0056D2]" />
                  <span>Student Portal Login</span>
                </Link>
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                <span>Want to see our curriculum first?</span>
                <Link href="/courses" className="text-[#0056D2] hover:underline font-bold flex items-center gap-1">
                  Explore Courses & Batches →
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/verify" className="text-slate-600 hover:text-[#0056D2] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify Certificate</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-semibold border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Physical Cisco 2960/2911 Hardware Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Interactive LMS with XP & Badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Weekend & Evening Batches</span>
                </div>
              </div>
            </div>

            {/* Right Card: Live Student LMS & Portal Experience Showcase (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-100 space-y-6 relative">
                {/* Header status */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Student LMS Portal
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Session
                  </span>
                </div>

                {/* Student Profile Overview */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0056D2] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      AK
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">Ali Khan</div>
                      <div className="text-[11px] font-semibold text-[#0056D2]">Level 12 • Cyber Analyst</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md block">
                      ⚡ 1,850 XP
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold mt-1 block">🔥 14-Day Streak</span>
                  </div>
                </div>

                {/* Course In-Progress */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">CCNA 200-301 Enterprise Networking</span>
                    <span className="font-extrabold text-[#0056D2]">68% Complete</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-[#0056D2] rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>8 of 12 Lab Modules Finished</span>
                    <span className="text-emerald-600 font-bold">Passing with Grade A+</span>
                  </div>
                </div>

                {/* Next Live Lab Schedule */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#0056D2]" />
                    <div>
                      <span className="font-bold text-slate-800 block">Next Live Lab: Cisco Switch VTP & Trunking</span>
                      <span className="text-[11px] text-slate-500">Today • 06:00 PM (Lab Room 2)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-[#0056D2] px-2 py-1 rounded-md">
                    Join
                  </span>
                </div>

                {/* Direct Action Link to Student Login / Register */}
                <div className="space-y-2 pt-2">
                  <Link
                    href="/login?tab=register&role=student"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Create Free Student Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                    <span>Already enrolled?</span>
                    <Link
                      href="/login?tab=login&role=student"
                      className="text-[#0056D2] font-bold hover:underline"
                    >
                      Sign In to Student Portal →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="text-center space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-3xl font-extrabold text-[#0056D2]">15,000+</div>
              <div className="text-xs font-semibold text-slate-600">Certified Alumni</div>
            </div>
            <div className="text-center space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-3xl font-extrabold text-[#0284C7]">98.4%</div>
              <div className="text-xs font-semibold text-slate-600">Completion Rate</div>
            </div>
            <div className="text-center space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-3xl font-extrabold text-slate-900">40+</div>
              <div className="text-xs font-semibold text-slate-600">Hardware Labs</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs font-semibold text-slate-600">Verifiable Credentials</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR COURSES SECTION (ENHANCED COURSERA SHOWCASE) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedCoursesShowcase courses={courses} />
      </section>

      {/* ── WHY BITS INSTITUTE (CLEAN WHITE 4-COLUMN GRID) ── */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] block mb-2">
              The BITS Academic Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Why Professionals & Beginners Choose BITS Institute
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              We focus on practical hardware competency, rigorous lab tasks, and verified credentials
              recognized by enterprise employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#0056D2]">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Physical Cisco Hardware</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work directly with physical Cisco 2960 switches, 2911 series routers, and virtualized EVE-NG topologies.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#0056D2]">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cybersecurity Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Isolated sandbox cyber ranges, active packet dissection, vulnerability exploitation, and Kali Linux tool mastery.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#0056D2]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gamified LMS & XP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Earn XP points, unlock cyber badges, maintain daily learning streaks, and track real-time attendance in your portal.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#0056D2]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verifiable Credentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every graduate receives an internationally verifiable certificate with tamper-proof unique ID and QR code registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER (DEEP ROYAL BLUE GRADIENT) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0056D2] via-[#0284C7] to-[#1E3A8A] p-10 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-3 py-1 rounded-full">
              Q2 2026 Admissions Open
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready to Upgrade Your Technology Career?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Seats in each batch are strictly limited to ensure individual lab hardware access.
              Reserve your seat today in our upcoming weekend or evening cohort.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/courses"
              className="px-8 py-3.5 rounded-xl bg-white text-[#0056D2] hover:bg-blue-50 font-bold text-sm text-center shadow-md transition-all"
            >
              Browse Open Batches
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-[#0041a8] hover:bg-[#003588] text-white font-bold text-sm text-center border border-white/30 transition-all"
            >
              Speak with an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
