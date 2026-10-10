import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  Building,
  Check,
  Layers,
  FileCheck,
} from 'lucide-react';
import { ITService } from '@/components/ServicesShowcase';

const ICON_MAP: Record<string, any> = {
  Server: Server,
  ShieldAlert: ShieldAlert,
  Cloud: Cloud,
  Code: Code2,
  Code2: Code2,
  GraduationCap: GraduationCap,
  Cpu: Cpu,
};

async function getService(slug: string): Promise<ITService | null> {
  try {
    const res = await fetch(`http://localhost:4000/api/public/services/${slug}`, {
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
  const service = await getService(slug);
  if (!service) return { title: 'Service Not Found — BITS Institute' };

  return {
    title: `${service.title} — BITS Institute Corporate Solutions`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const Icon = ICON_MAP[service.iconName] || Server;

  return (
    <div className="bg-white min-h-screen space-y-12 pb-16">
      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-100 pt-10 pb-12 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2]">
                {service.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                Enterprise SLA Guaranteed
              </span>
              {service.turnaroundTime && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                  Delivery: {service.turnaroundTime}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0056D2] text-white flex items-center justify-center shrink-0 shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                {service.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {service.shortDescription}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                <span>NDA & Confidentiality Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Certified Engineers (CCIE / OSCP / AWS)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT & PROPOSAL SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Scope, Features, Deliverables */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Service Overview & Scope</h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                {service.description}
              </p>
            </section>

            {/* Core Capabilities */}
            {service.features?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Capabilities & Technical Scope</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.features.map((feat: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 leading-relaxed font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tangible Deliverables */}
            {service.deliverables?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tangible Contract Deliverables</h2>
                <div className="space-y-3">
                  {service.deliverables.map((del: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-4 h-4 text-[#0056D2] shrink-0" />
                        <span className="font-semibold text-slate-800">{del}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        Included
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SLA Policy */}
            <section className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#0056D2]" />
                <span>BITS Institute Service Level Agreement (SLA)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every commercial engagement is executed under mutual NDA with defined turnaround windows,
                formal change management procedures, and dedicated incident escalation channels.
              </p>
            </section>
          </div>

          {/* Right Column: Pricing & Proposal Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold mb-1">
                  Estimated Engagement Pricing
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {service.pricingStartingAt || 'Custom RFP'}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">Turnkey Scope</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Final proposal customized after initial discovery review.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Turnaround Window:</span>
                  <span className="font-semibold text-slate-900">{service.turnaroundTime || 'Custom'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Practitioner Level:</span>
                  <span className="font-semibold text-slate-900">Senior Certified Leads</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Post-Deployment SLA:</span>
                  <span className="font-semibold text-emerald-600">Included (30 - 90 Days)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.slug)}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Request Proposal / Consultation</span>
                </Link>
              </div>

              <p className="text-[11px] text-slate-500 text-center font-normal">
                Strict NDA adhered. No sales spam. Response within 12 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
