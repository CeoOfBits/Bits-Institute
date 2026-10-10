import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { ServicesHomeBanner } from '@/components/ServicesHomeBanner';
import { TrustPartnersStrip } from '@/components/TrustPartnersStrip';
import { StudentTestimonials } from '@/components/StudentTestimonials';
import { HomeFaq } from '@/components/HomeFaq';
import { ITService } from '@/components/ServicesShowcase';
import { HeroModernSection } from '@/components/HeroModernSection';

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

async function getFeaturedServices(): Promise<ITService[]> {
  try {
    const res = await fetch('http://localhost:4000/api/public/services', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return [];
}

export default async function HomePage() {
  const [courses, services] = await Promise.all([
    getFeaturedCourses(),
    getFeaturedServices(),
  ]);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 sm:pb-20 bg-white">
      {/* ── HERO BANNER (MODERN, BEAUTIFUL & INTERACTIVE IT ACADEMY) ── */}
      <HeroModernSection />

      {/* ── CISCO CERTIFIED ACADEMY & GLOBAL PARTNERS STRIP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustPartnersStrip />
      </section>

      {/* ── POPULAR COURSES SECTION (ENHANCED COURSERA SHOWCASE) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedCoursesShowcase courses={courses} />
      </section>

      {/* ── ENTERPRISE IT & DIGITAL SERVICES SPOTLIGHT BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesHomeBanner services={services} />
      </section>

      {/* ── WHY BITS INSTITUTE (CLEAN WHITE 4-COLUMN GRID) ── */}
      <section className="bg-slate-50/70 py-14 sm:py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] block mb-2">
              The BITS Academic Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Professionals & Beginners Choose BITS Institute
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
              We focus on practical hardware competency, rigorous lab tasks, and verified credentials
              recognized by enterprise employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Physical Cisco Hardware</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Work directly with physical Cisco 2960 switches, 2911 series routers, and virtualized EVE-NG topologies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cybersecurity Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Isolated sandbox cyber ranges, active packet dissection, vulnerability exploitation, and Kali Linux tool mastery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Gamified LMS & XP</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Earn XP points, unlock cyber badges, maintain daily learning streaks, and track real-time attendance in your portal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Verifiable Credentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every graduate receives an internationally verifiable certificate with tamper-proof unique ID and QR code registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALUMNI REVIEWS & TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentTestimonials />
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeFaq />
      </section>

      {/* ── CALL TO ACTION BANNER (DEEP ROYAL BLUE GRADIENT) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0056D2] via-[#0284C7] to-[#1E3A8A] p-8 sm:p-12 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Q2 2026 Admissions Open
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Ready to Upgrade Your Technology Career?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Seats in each batch are strictly limited to ensure individual lab hardware access.
              Reserve your seat today in our upcoming weekend or evening cohort.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/courses"
              className="px-6 py-3 rounded-xl bg-white text-[#0056D2] hover:bg-blue-50 font-semibold text-xs sm:text-sm text-center shadow-md transition-all"
            >
              Browse Open Batches
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#0041a8] hover:bg-[#003588] text-white font-semibold text-xs sm:text-sm text-center border border-white/30 transition-all"
            >
              Speak with an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
