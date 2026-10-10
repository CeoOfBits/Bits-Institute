'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, MessageSquare, PhoneCall } from 'lucide-react';

export function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is BITS Institute Cisco certified and are graduation certificates recognized?',
      a: 'Yes. BITS Institute is an Authorized Cisco Certified Academy partner adhering strictly to the official Cisco Networking Academy (NetAcad) curriculum. Every graduate receives a tamper-proof credential with a unique cryptographic verification ID and QR code registry that employers worldwide can instantly verify at /verify.',
    },
    {
      q: 'Do I need prior IT, networking, or coding experience to join?',
      a: 'No prior experience is necessary for our fundamental and associate tracks (such as CCNA 200-301, Web Development, or IP Cameras). We start from foundational networking and computer architecture before transitioning into hands-on advanced lab exercises and real packet dissection.',
    },
    {
      q: 'What are the batch timings for Weekend and Evening classes?',
      a: 'We offer flexible schedules tailored for working professionals and university students: Weekend Cohorts run on Saturdays & Sundays (2:00 PM – 6:00 PM), while Evening Cohorts run Monday through Thursday (6:00 PM – 8:00 PM). Each batch has strictly limited seats to ensure guaranteed 1:1 hardware workstation access.',
    },
    {
      q: 'How do students practice on physical Cisco hardware racks?',
      a: 'Unlike theoretical institutes that only use packet tracer software, BITS Institute campus hosts dedicated physical Cisco 2960 switches, 2911 series enterprise routers, and patch panels. Students physically wire, configure, and troubleshoot real hardware during every lab session.',
    },
    {
      q: 'How can corporate businesses hire BITS for IT services, CCTV, and software?',
      a: 'You can explore our 7 enterprise services on the /services page or submit a discovery request. Our Lead Solutions Architect conducts a preliminary technical assessment, prepares an NDA-protected Statement of Work (SOW) with clear milestone deliverables, and provides guaranteed SLA support.',
    },
    {
      q: 'What is the refund and enrollment transfer policy?',
      a: 'If your work schedule changes, BITS Institute provides non-destructive student batch transfers (Section 9 Academic Policy), allowing you to move to a morning, evening, or weekend cohort without losing your academic attendance records or grades.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-semibold shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#0056D2]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal">
          Have questions regarding admissions, hardware labs, certifications, or enterprise IT services?
          Find answers to common inquiries below.
        </p>
      </div>

      {/* ── ACCORDION LIST ── */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#0056D2] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed font-normal border-t border-blue-100/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── STILL HAVE QUESTIONS BANNER ── */}
      <div className="max-w-2xl mx-auto text-center p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#0056D2] shrink-0" />
          <span>Still have questions about admissions or corporate contracts?</span>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold shrink-0 transition-colors"
        >
          Speak with Advisor
        </Link>
      </div>
    </div>
  );
}
