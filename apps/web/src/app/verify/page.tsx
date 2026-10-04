'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, Award, CheckCircle2, Building, Calendar, User, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function VerifyPage() {
  const [code, setCode] = useState('BITS-CCNA-2026-00482');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:4000/api/public/certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok || data.verified === false) {
        setError(data.message || 'No valid certificate found with this credential ID.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Unable to reach credential verification server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0056D2] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
            <span>Official Public Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Verify BITS Institute Certificate
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Authenticate credentials issued by BITS Institute (Bright Information Technology Solutions).
            Enter the verification serial code printed on the physical or digital certificate.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <form onSubmit={handleVerify} className="space-y-4">
            <label htmlFor="certId" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Certificate Serial Number / Credential ID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="certId"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BITS-CCNA-2026-00482"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all shrink-0"
              >
                {loading ? (
                  <span>Validating...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Format: BITS-[COURSE]-[YEAR]-[SERIAL] (Try sample code: <strong className="text-[#0056D2]">BITS-CCNA-2026-00482</strong>)
            </p>
          </form>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Verification Failed</div>
              <div className="text-xs text-rose-700 mt-1">{error}</div>
            </div>
          </div>
        )}

        {/* Verified Certificate Card (Crisp White & Blue Trust Seal) */}
        {result && (
          <div className="rounded-3xl bg-white border-2 border-emerald-500/60 p-8 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Status banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {result.status} CREDENTIAL
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Authentic Institute Certificate</h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Credential ID</div>
                <div className="font-mono text-sm font-bold text-[#0056D2]">{result.code}</div>
              </div>
            </div>

            {/* Certificate Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <User className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Graduate Student</span>
                </div>
                <div className="text-base font-bold text-slate-900">{result.studentName}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Award className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Graduation Program</span>
                </div>
                <div className="text-base font-bold text-[#0056D2]">{result.courseTitle}</div>
                <div className="text-xs text-slate-500">{result.courseDuration}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Academic Grade</span>
                </div>
                <div className="text-base font-bold text-emerald-700">{result.grade || 'Certified Graduate'}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Date of Issuance</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {new Date(result.issuedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Issuer Seal */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold">
                <Building className="w-4 h-4 text-[#0056D2]" />
                <span>Issued by: {result.institute}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Verified against BITS Central Academic Registry. All records cryptographically stored.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
