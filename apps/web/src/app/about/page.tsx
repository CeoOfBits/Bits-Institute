import React from 'react';
import { ShieldCheck, Award, Users, Server, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About BITS Institute — Bright Information Technology Solutions',
  description: 'Learn about BITS Institute, our enterprise physical labs, certified instructors, and academic mission.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0056D2] text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Technology & Cybersecurity Excellence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            About BITS Institute
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
            Bright Information Technology Solutions (BITS Institute) was founded with a singular mission:
            to cultivate world-class technology, networking, and cybersecurity professionals through relentless hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Physical Cisco Hardware Labs</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Unlike online tutorial platforms, our students work directly with physical Cisco Catalyst switches, ISR routers,
              and isolated cybersecurity target ranges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Practicing Industry Faculty</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Courses are designed and delivered by CCIE, OSCP, CEH, and CISSP certified specialists who architect real-world corporate systems daily.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Verifiable Credentials</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Every certification is cryptographically stored in our central academic registry, instantly verifiable by international employers via QR scan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
