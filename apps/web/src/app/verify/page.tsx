'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  AlertCircle,
  Award,
  CheckCircle2,
  Building,
  Calendar,
  User,
  Printer,
  XCircle,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      performVerification(initialCode);
    }
  }, [initialCode]);

  const performVerification = async (certCode: string) => {
    if (!certCode.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:4000/api/public/certificates/verify/${encodeURIComponent(certCode.trim().toUpperCase())}`,
      );
      const data = await res.json();
      if (!res.ok || data.verified === false) {
        if (data.status === 'REVOKED') {
          setResult(data);
        } else {
          setError(data.message || 'No certificate record found matching this credential identifier.');
        }
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Unable to reach credential verification registry. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(code);
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Title */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0056D2] text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Official Public Credential Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Verify BITS Institute Certificate
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
            Authenticate diplomas and career certifications issued by BITS Institute (Bright Information Technology Solutions).
            Enter the unique verification serial code printed on the physical or digital diploma.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-sm disabled:opacity-50 transition-all shrink-0"
              >
                {loading ? (
                  <span>Validating Registry...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Standard Format: BITS-[COURSE]-[YEAR]-[SERIAL]</span>
              <button
                type="button"
                onClick={() => {
                  setCode('BITS-CCNA-2026-00482');
                  performVerification('BITS-CCNA-2026-00482');
                }}
                className="text-[#0056D2] hover:underline font-bold"
              >
                Try sample CCNA verification
              </button>
            </div>
          </form>
        </div>

        {/* Error / Not Found State */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3.5 text-sm animate-in fade-in">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900">Certificate Not Found</div>
              <div className="text-xs text-rose-700 mt-1">{error}</div>
              <div className="text-[11px] text-rose-600 mt-2">
                Please double-check the credential ID or contact the BITS Institute Examination Department at{' '}
                <strong>verify@bits.edu.pk</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Revoked State */}
        {result && result.status === 'REVOKED' && (
          <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-rose-600 px-2.5 py-0.5 rounded-full">
                  REVOKED CREDENTIAL
                </span>
                <h3 className="text-lg font-bold mt-1">This Certificate Has Been Officially Revoked</h3>
              </div>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-normal">
              Credential ID <strong className="font-mono">{result.code}</strong> was revoked on{' '}
              {result.revokedAt ? new Date(result.revokedAt).toLocaleDateString() : 'record'}. This certificate is invalid and cannot be recognized for academic or employment verification.
            </p>
          </div>
        )}

        {/* Authentic Certificate Card */}
        {result && result.verified && (
          <div className="rounded-3xl bg-white border-2 border-emerald-500/60 p-8 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    OFFICIALLY VERIFIED CREDENTIAL
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Authentic Institute Diploma</h3>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Credential Serial</div>
                <div className="font-mono text-base font-bold text-[#0056D2]">{result.code}</div>
              </div>
            </div>

            {/* Certificate Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <User className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Certified Candidate</span>
                </div>
                <div className="text-base font-bold text-slate-900">{result.studentName}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Award className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Program Title</span>
                </div>
                <div className="text-base font-bold text-[#0056D2]">{result.courseTitle}</div>
                {result.courseDuration && (
                  <div className="text-xs text-slate-500">{result.courseDuration}</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Academic Evaluation</span>
                </div>
                <div className="text-base font-bold text-emerald-700">{result.grade || 'Passed (Certified)'}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Date of Issuance</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {new Date(result.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Issuing Authority Seal */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-[#0056D2] font-black text-xs">
                  BITS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{result.institute}</div>
                  <div className="text-[11px] text-slate-500">Government Registered Technical Education Center</div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Official Verification Record</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-semibold text-slate-500">Loading Credential Registry...</div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}
