'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  ShieldAlert,
  Cloud,
  Code2,
  GraduationCap,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Zap,
  TrendingUp,
  Palette,
  Camera,
  Bot,
} from 'lucide-react';

export interface ITService {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  iconName: string;
  features: string[];
  deliverables: string[];
  pricingStartingAt?: string;
  turnaroundTime?: string;
  featured?: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

const ICON_MAP: Record<string, any> = {
  TrendingUp: TrendingUp,
  Palette: Palette,
  Code2: Code2,
  Code: Code2,
  Server: Server,
  Camera: Camera,
  ShieldAlert: ShieldAlert,
  Bot: Bot,
  Cloud: Cloud,
  GraduationCap: GraduationCap,
  Cpu: Cpu,
};

const SERVICE_THEMES: Record<string, { gradient: string; iconBg: string }> = {
  'digital-marketing': {
    gradient: 'from-[#D97706] via-[#B45309] to-[#78350F]',
    iconBg: 'bg-amber-500/20 text-amber-200',
  },
  'graphic-designing': {
    gradient: 'from-[#9333EA] via-[#7E22CE] to-[#581C87]',
    iconBg: 'bg-fuchsia-500/20 text-fuchsia-200',
  },
  'website-development': {
    gradient: 'from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]',
    iconBg: 'bg-blue-500/20 text-blue-200',
  },
  'it-networking': {
    gradient: 'from-[#0056D2] via-[#0284C7] to-[#075985]',
    iconBg: 'bg-sky-500/20 text-sky-200',
  },
  'cameras-ip': {
    gradient: 'from-[#0D9488] via-[#0F766E] to-[#134E4A]',
    iconBg: 'bg-teal-500/20 text-teal-200',
  },
  'cybersecurity': {
    gradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  'ai-agents': {
    gradient: 'from-[#4F46E5] via-[#4338CA] to-[#312E81]',
    iconBg: 'bg-violet-500/20 text-violet-200',
  },
  // Fallbacks
  'enterprise-cisco-networking': {
    gradient: 'from-[#0056D2] via-[#0284C7] to-[#075985]',
    iconBg: 'bg-blue-600/20 text-white',
  },
  'cybersecurity-vapt-audits': {
    gradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  'cloud-architecture-devops': {
    gradient: 'from-[#0284C7] via-[#0369A1] to-[#0C4A6E]',
    iconBg: 'bg-cyan-500/20 text-cyan-200',
  },
  'custom-enterprise-software': {
    gradient: 'from-[#4338CA] via-[#4F46E5] to-[#312E81]',
    iconBg: 'bg-indigo-500/20 text-indigo-200',
  },
};

export function ServicesShowcase({ services }: { services: ITService[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: 'All Services' },
    { key: 'Marketing', label: 'Digital Marketing' },
    { key: 'Graphic', label: 'Graphic Designing' },
    { key: 'Website', label: 'Website Dev' },
    { key: 'Network', label: 'IT Networking' },
    { key: 'Camera', label: 'IP Cameras' },
    { key: 'Cybersecurity', label: 'Cybersecurity' },
    { key: 'AI', label: 'AI Agents' },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'ALL') return true;
    return s.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold mb-2.5 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Enterprise Solutions • BITS Corporate Technology Wing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Enterprise IT & Cybersecurity Services
          </h2>
          <p className="mt-1.5 text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            From physical Cisco network rollouts and offensive cyber penetration testing to bespoke cloud & software architecture,
            our certified engineers deliver enterprise-grade execution with stringent SLAs.
          </p>
        </div>

        <Link
          href="/services"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0056D2] hover:text-[#0041a8] group"
        >
          <span>Explore all corporate services</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── CATEGORY FILTER TABS ── */}
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

      {/* ── SERVICES CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const theme = SERVICE_THEMES[service.slug] || {
            gradient: 'from-[#0056D2] to-[#0284C7]',
            iconBg: 'bg-blue-600/20 text-white',
          };
          const Icon = ICON_MAP[service.iconName] || Server;

          return (
            <div
              key={service.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Accent Top */}
              <div className={`p-4 sm:p-5 bg-gradient-to-br ${theme.gradient} text-white relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                <div className="flex items-center justify-between gap-2 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {service.category}
                  </span>
                  {service.turnaroundTime && (
                    <span className="text-[11px] font-medium text-blue-100 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-200" />
                      {service.turnaroundTime}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2.5 relative z-10">
                  <div className={`w-10 h-10 rounded-xl ${theme.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                      {service.title}
                    </h3>
                    <span className="text-[11px] text-cyan-200 font-medium">
                      Enterprise Guaranteed SLA
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Core Features */}
                  <div className="pt-2.5 space-y-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Scope & Capabilities
                    </span>
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[11px] leading-tight font-normal">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 mt-2 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Estimated Tier
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-900">
                        {service.pricingStartingAt || 'Custom Quote'}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Verified SLA
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-all"
                    >
                      Specifications
                    </Link>

                    <Link
                      href={`/contact?service=${encodeURIComponent(service.slug)}`}
                      className="py-2 px-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold text-center shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-1"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CORPORATE SLA GUARANTEE BANNER ── */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-2xl p-5 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056D2]">
                Enterprise Contract Assurance
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Need Non-Disclosure Agreement (NDA) or Customized RFP Bid Response?
            </p>
            <p className="text-[11px] text-slate-500">
              Our corporate solutions team responds to commercial RFPs and institutional inquiries within 12 business hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            href="/contact?type=corporate_rfp"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs transition-all text-center flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Book Consultation</span>
          </Link>
          <Link
            href="/services"
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold shadow-2xs transition-all text-center"
          >
            All Services Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}
