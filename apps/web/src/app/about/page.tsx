import React from 'react';
import { ShieldCheck, Award, Users, Server, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About BITS Institute — Bright Information Technology Solutions',
  description: 'Learn about BITS Institute, our enterprise physical labs, certified instructors, and academic mission.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0056D2] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
            <span>Technology & Cybersecurity Excellence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About BITS Institute
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Bright Information Technology Solutions (BITS Institute) was founded with a singular mission:
            to cultivate world-class technology, networking, and cybersecurity professionals through relentless hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
            <Server className="w-8 h-8 text-[#0056D2]" />
            <h2 className="text-xl font-bold text-slate-900">Physical Cisco Hardware Labs</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike online tutorial platforms, our students work directly with physical Cisco Catalyst switches, ISR routers,
              and isolated cybersecurity target ranges.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
            <Users className="w-8 h-8 text-[#0056D2]" />
            <h2 className="text-xl font-bold text-slate-900">Practicing Industry Faculty</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Courses are designed and delivered by CCIE, OSCP, CEH, and CISSP certified specialists who architect real-world corporate systems daily.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
            <Award className="w-8 h-8 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Verifiable Credentials</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every certification is cryptographically stored in our central academic registry, instantly verifiable by international employers via QR scan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
