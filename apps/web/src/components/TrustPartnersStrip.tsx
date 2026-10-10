'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export function TrustPartnersStrip() {
  const globalPartners = [
    {
      name: 'Cisco Systems',
      role: 'Official Certified Academy Partner',
      badge: 'CCNA & CCNP Certified Lab Center',
      bg: 'bg-blue-50 text-[#0056D2] border-blue-200',
      tag: 'Authorized NetAcad',
      iconColor: 'text-[#0056D2]',
    },
    {
      name: 'Microsoft',
      role: 'Cloud & Azure Learning Curriculum',
      badge: 'Enterprise Systems Training',
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      tag: 'Azure Aligned',
      iconColor: 'text-sky-600',
    },
    {
      name: 'Google Cloud & Digital',
      role: 'Performance & Analytics Standards',
      badge: 'Google Certified Marketers',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tag: 'Digital & Cloud',
      iconColor: 'text-emerald-600',
    },
    {
      name: 'Huawei ICT Academy',
      role: 'Routing, Switching & Datacom Labs',
      badge: 'HCIA & HCIP Lab Modules',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      tag: 'Enterprise ICT',
      iconColor: 'text-rose-600',
    },
  ];

  const alumniEmployers = [
    'PTCL Telecom',
    'Jazz (VEON)',
    'Nayatel Fiber',
    'Systems Limited',
    'Zong 4G',
    'Bank Alfalah',
    'TechLogix',
    'Telenor Microfinance',
  ];

  return (
    <div className="space-y-6">
      {/* ── CISCO CERTIFIED ACADEMY SPOTLIGHT BANNER ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-[#0056D2] to-sky-700 p-5 sm:p-7 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-cyan-200 text-xs font-bold border border-white/20">
            <Award className="w-4 h-4 text-cyan-300" />
            <span>Official Authorized Academy Partner</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            BITS Institute is a Cisco Certified & Authorized Academy
          </h3>

          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Our campus features dedicated physical Cisco 2960 switches and 2911 series routers racks.
            Students receive official CCIE-led mentoring, hands-on packet tracing, and internationally verifiable certifications.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/90 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>100% Physical Rack Labs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>CCNA 200-301 Official Syllabus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>QR Code Verifiable Credentials</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 z-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/courses/ccna-enterprise-networking"
            className="px-5 py-2.5 rounded-xl bg-white text-[#0056D2] hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Explore CCNA Labs</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            href="/verify"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/25 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-200" />
            <span>Verify Credentials</span>
          </Link>
        </div>

        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* ── TECHNOLOGY PARTNERS & CURRICULUM STRIP (CISCO, MICROSOFT, GOOGLE, HUAWEI) ── */}
      <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056D2] block">
              Global Curriculum & Technology Standards
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              International Vendor Standards Taught at BITS
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Industry Aligned • Official Course Outlines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {globalPartners.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${p.bg}`}>
                    {p.tag}
                  </span>
                  <Award className={`w-4 h-4 ${p.iconColor}`} />
                </div>
                <h5 className="text-sm font-bold text-slate-900">{p.name}</h5>
                <p className="text-xs text-slate-600 line-clamp-1">{p.role}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{p.badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alumni Employers Ticker / Badges */}
        <div className="pt-3 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Where BITS Alumni Excel:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {alumniEmployers.map((emp) => (
              <span
                key={emp}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-2xs"
              >
                {emp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
