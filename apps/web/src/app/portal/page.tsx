'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function StudentPortalPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('bits_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome & Gamification Ribbon (Clean Blue & White) */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#0056D2]" />
                <span>ACTIVE CADET • CYBER EXPLORER TRACK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'Cadet'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                CCNA 200-301 Enterprise Networking • <span className="text-[#0056D2] font-bold">Batch 001 (Evening)</span>
              </p>
            </div>

            {/* Gamified Stats (Level, XP, Streak) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              {/* Level */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#0056D2] font-black text-lg">
                  12
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Level 12</div>
                  <div className="text-xs font-bold text-slate-900">Cyber Explorer</div>
                </div>
              </div>

              {/* XP */}
              <div className="space-y-1.5 min-w-[140px] pr-4 border-r border-slate-200">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">XP Progress</span>
                  <span className="text-[#0056D2] font-bold">7,420 / 10,000</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0056D2] h-full w-[74%] rounded-full" />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Flame className="w-5 h-5 fill-amber-500/30 text-amber-500" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">14 Days</div>
                  <div className="text-[10px] text-amber-700 font-bold uppercase">Learning Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Active Courses + Live Classroom Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: My Active Courses & Lessons */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Enrolled Course & Progress</h2>
              <span className="text-xs text-[#0056D2] font-bold">68% Completed</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Cisco Networking Track
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    CCNA 200-301 Enterprise Networking
                  </h3>
                  <p className="text-xs text-slate-500">Instructor: Engr. Ahmed Khan • Shift: Evening (MWF)</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Attendance Record</span>
                  <span className="text-base font-extrabold text-emerald-600">92.5% Present</span>
                </div>
              </div>

              {/* Next Live Class Alert */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Next Live Class: OSPF Multi-Area Routing Lab</div>
                    <div className="text-[11px] text-[#0056D2] font-semibold">Today, 7:00 PM – 9:00 PM PKT • Live Classroom</div>
                  </div>
                </div>

                <a
                  href="#live"
                  className="px-4 py-2 rounded-lg bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold text-center shadow-xs transition-all shrink-0"
                >
                  Join Live Class
                </a>
              </div>

              {/* Modules Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Module Progression</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Module 1: IPv4 Subnetting & VLSM Architecture</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Completed</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Module 2: Cisco Switching & VLAN 802.1Q Trunks</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Completed</span>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between text-slate-900 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#0056D2] animate-ping" />
                      <span>Module 3: Dynamic IP Routing & OSPF Operations</span>
                    </div>
                    <span className="text-[10px] text-[#0056D2] font-bold uppercase">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Badges & Certificate Status */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Earned Badges & Credentials</h2>

            {/* Badges Display */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Achievement Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-[#0056D2]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Quiz Master</div>
                  <div className="text-[10px] text-slate-500">90%+ on 5 Quizzes</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Fast Learner</div>
                  <div className="text-[10px] text-slate-500">Module 1 Cleared Early</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-[#0056D2]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Cyber Explorer</div>
                  <div className="text-[10px] text-slate-500">Level 10 Achieved</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-amber-600">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Streak Pioneer</div>
                  <div className="text-[10px] text-slate-500">14-Day Streak</div>
                </div>
              </div>
            </div>

            {/* Certificate Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#0056D2] font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Verifiable Credential</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">BITS Certificate Eligibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete remaining 3 modules and the final lab exam with 70%+ score to unlock your official verifiable certificate.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-1.5 text-xs text-[#0056D2] hover:underline font-bold pt-1"
              >
                <span>Explore Certificate Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
