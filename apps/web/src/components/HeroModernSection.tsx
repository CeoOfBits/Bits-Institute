'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Server,
  Terminal,
  Cpu,
  GraduationCap,
  Star,
  CheckCircle2,
  Layers,
  Zap,
  Award,
  Users,
  ExternalLink,
} from 'lucide-react';

interface LabView {
  id: 'campus' | 'cisco' | 'datacenter';
  label: string;
  badge: string;
  image: string;
  caption: string;
  tagline: string;
}

const LAB_VIEWS: LabView[] = [
  {
    id: 'campus',
    label: 'Modern IT Lab',
    badge: 'Campus Lab Pod #04',
    image: '/images/hero/it-training-hero.jpg',
    caption: 'Student workstation with dual-monitors, live topologies, and dedicated server racks',
    tagline: 'Individual Hardware Pod for Every Student',
  },
  {
    id: 'cisco',
    label: 'Cisco Switches & Routers',
    badge: 'Enterprise Hardware',
    image: '/images/hardware/cisco-switch-router-3d.jpg',
    caption: 'Physical Cisco Catalyst 2960-X Switches & ASR 1001-X Routers with live blinking ports',
    tagline: '100% Real Gear • Raw IOS CLI Access',
  },
  {
    id: 'datacenter',
    label: '42U Server Rack',
    badge: 'Fiber Infrastructure',
    image: '/images/hardware/cisco-rack-3d.jpg',
    caption: 'Multi-tiered 42U rack with high-density fiber optic looms and patch matrix',
    tagline: 'Hands-on Cabling & Enterprise Topology',
  },
];

export function HeroModernSection() {
  const [activeView, setActiveView] = useState<LabView>(LAB_VIEWS[0]);

  return (
    <section className="relative overflow-hidden bg-[#040714] text-white pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-cyan-950/40">
      {/* ── HIGH-TECH AMBIENT GLOW EFFECTS ── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/12 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute -top-32 left-10 w-[550px] h-[550px] bg-blue-600/18 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[350px] bg-indigo-600/12 rounded-full blur-[170px] pointer-events-none -z-0" />

      {/* ── HIGH-TECH CYBER GRID PATTERN ── */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none -z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── DIAGONAL LIGHT BEAM & RADIAL VIGNETTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(14,165,233,0.22),rgba(4,7,20,0.95))] pointer-events-none -z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-[800px] bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent rotate-45 pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ══════════════ LEFT COLUMN: COPY & ACTION (6 COLS) ══════════════ */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="tracking-wide">Admissions Open Q2 2026 • Physical Cisco Rack Labs</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.12]">
              Build Your Future in{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                Technology
              </span>
              <br />
              & Cyber Security
            </h1>

            {/* Clear, Engaging Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Learn practical IT skills, configure physical Cisco routers & switches, and defend real-world networks with certified industry leaders.
            </p>

            {/* 3 Quick Value-Proposition Chips */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-medium backdrop-blur-sm">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Physical Cisco Hardware</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-medium backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hands-on Cyber Ranges</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-medium backdrop-blur-sm">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Verifiable Certificates</span>
              </div>
            </div>

            {/* Two High-Impact CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] transition-all transform hover:-translate-y-0.5 group"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Explore Courses & Batches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 hover:text-white border border-slate-700/80 hover:border-cyan-400/50 backdrop-blur-md transition-all shadow-sm"
              >
                <span>Our IT Services</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Social Proof & Rating Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-bold text-white ml-1">4.9/5</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">
                Over <strong className="text-cyan-400 font-bold">15,000+</strong> Trained Alumni in Enterprise IT
              </span>
            </div>
          </div>

          {/* ══════════════ RIGHT COLUMN: MULTI-LAYER INTERACTIVE VISUAL (6 COLS) ══════════════ */}
          <div className="lg:col-span-6 space-y-3">
            {/* Top Interactive Lab View Switcher Tabs */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md text-xs">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 pl-2 hidden sm:inline">
                Live Lab View:
              </span>
              <div className="flex items-center gap-1 w-full sm:w-auto">
                {LAB_VIEWS.map((tab) => {
                  const isActive = activeView.id === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveView(tab)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {tab.id === 'campus' && <GraduationCap className="w-3.5 h-3.5" />}
                      {tab.id === 'cisco' && <Cpu className="w-3.5 h-3.5" />}
                      {tab.id === 'datacenter' && <Server className="w-3.5 h-3.5" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Visual Window with High-End Glass Framing */}
            <div className="relative group/visual">
              {/* Vibrant Ambient Glow behind Window */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/25 via-blue-600/25 to-indigo-600/20 rounded-3xl blur-2xl opacity-75 group-hover/visual:opacity-100 transition duration-700 pointer-events-none -z-0" />

              {/* Glass Frame Container */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.2)]">
                {/* Window Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 ml-2 font-medium">
                      BiTS Campus — {activeView.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Online Active
                    </span>
                  </div>
                </div>

                {/* 16:9 High-Resolution Visual */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <Image
                    key={activeView.id}
                    src={activeView.image}
                    alt={activeView.caption}
                    fill
                    priority
                    className="object-cover object-center transition-all duration-700 group-hover/visual:scale-105"
                  />

                  {/* High-tech Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/60 pointer-events-none" />

                  {/* ── FLOATING GLASS BADGE 1: TOP-RIGHT (HARDWARE STATUS) ── */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase leading-none">
                          Real Gear Labs
                        </div>
                        <div className="text-[9px] text-slate-400 leading-none mt-0.5">
                          Zero Pure Theory
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── FLOATING GLASS BADGE 2: BOTTOM-LEFT (VERIFIED CREDENTIALS) ── */}
                  <div className="absolute bottom-3.5 left-3.5 z-10 hidden sm:block">
                    <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase leading-none">
                          Verifiable Certs
                        </div>
                        <div className="text-[9px] text-slate-400 leading-none mt-0.5">
                          Tamper-proof QR ID
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CAPTION BAR AT BOTTOM OF IMAGE ── */}
                  <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:right-3.5 z-10">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-xl text-right">
                      <p className="text-[11px] font-semibold text-white">
                        {activeView.tagline}
                      </p>
                      <p className="text-[10px] text-cyan-300/90 font-mono">
                        {activeView.badge}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Visual Helper Caption */}
                <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{activeView.caption}</span>
                  </span>
                  <Link
                    href="/courses"
                    className="shrink-0 text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1 ml-2"
                  >
                    <span>View Labs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ BOTTOM HERO 4-PILLAR TRUST BAR ══════════════ */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <h2 className="text-xs sm:text-sm font-bold text-white">Physical Cisco Racks</h2>
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
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <h2 className="text-xs sm:text-sm font-bold text-white">Certified Mentors</h2>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  Trained by Cisco CCIE, CEH, and AWS industry certified lead engineers.
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
                  Globally verified certificates with instant public QR registry & employer check.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
