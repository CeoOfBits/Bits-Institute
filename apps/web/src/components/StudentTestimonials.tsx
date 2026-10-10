'use client';

import React from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, Quote, ArrowRight, Award, UserCheck } from 'lucide-react';

export function StudentTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Muhammad Usman',
      initials: 'MU',
      role: 'Network Engineer at PTCL Telecom',
      course: 'CCNA 200-301 Enterprise Networking',
      batch: 'Batch 2025-Q4',
      rating: 5,
      review:
        'The hands-on physical Cisco 2960 switches and 2911 router lab at BITS made all the difference. In my technical job interview at PTCL, I was able to explain subnetting and OSPF configuration from real practice. Cleared my official Cisco CCNA exam on my first attempt!',
      avatarBg: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'Ayesha Siddiqui',
      initials: 'AS',
      role: 'SOC Analyst at Cyber Defense Lab',
      course: 'Ethical Hacking & Cyber Defense',
      batch: 'Batch 2026-Q1',
      rating: 5,
      review:
        'Finding an institute with an actual isolated cyber range sandbox was difficult until I joined BITS. Dr. Farhan guided us through real packet dissection, Burp Suite, and vulnerability exploitation. The tamper-proof certificate with QR code was instantly verified by my employer.',
      avatarBg: 'bg-emerald-600',
    },
    {
      id: 3,
      name: 'Hamza Tariq',
      initials: 'HT',
      role: 'Full-Stack Developer at TechLogix',
      course: 'Full-Stack Next.js & Web Development',
      batch: 'Batch 2025-Q3',
      rating: 5,
      review:
        'We built 3 real production web applications using Next.js, PostgreSQL, and TypeScript rather than just watching theory videos. The student LMS streak system and weekly code reviews kept me completely motivated throughout.',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: 4,
      name: 'Bilawal Raza',
      initials: 'BR',
      role: 'IT Infrastructure & CCTV Lead',
      course: 'Enterprise IT & IP Cameras Systems',
      batch: 'Batch 2026-Q1',
      rating: 5,
      review:
        'From CAT6 structured cable dressing to Dahua/Hikvision 4K NVR configuration, the training was 100% practical. I now lead enterprise surveillance and network deployment contracts with complete technical confidence.',
      avatarBg: 'bg-cyan-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold mb-2 shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Alumni Verification & Career Outcomes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Real Student Success Stories
          </h2>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            See how graduates from BITS Institute mastered real technologies, passed international certifications,
            and transitioned into high-paying engineering roles.
          </p>
        </div>

        <Link
          href="/verify"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0056D2] hover:text-[#0041a8] group"
        >
          <span>Verify Graduate Certificates</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── TESTIMONIALS 4-COLUMN GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
          >
            <div className="space-y-3">
              {/* Star Rating & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-slate-300" />
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{t.review}&rdquo;
              </p>
            </div>

            {/* Student Info Card Footer */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full ${t.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{t.name}</h4>
                  <p className="text-[11px] text-[#0056D2] font-semibold line-clamp-1">{t.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span className="font-medium line-clamp-1 max-w-[140px]">{t.course}</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                  {t.batch}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
