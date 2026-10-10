'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0056D2] text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Admissions & Campus Tours</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Contact BITS Institute
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
            Have questions regarding upcoming batches, lab timings, installment plans, or syllabus?
            Our career counselors and admissions advisors are ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info Cards */}
          <div className="space-y-5">
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Campus Location</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">
                    BITS Institute, Main Boulevard, Commercial Zone, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Direct Phone & WhatsApp</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Admissions: +92 (42) 3588-BITS • WhatsApp: +92 300 1234567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Email Inquiries</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    admissions@bits.edu.pk • verify@bits.edu.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Campus & Lab Hours</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Monday – Saturday: 9:00 AM – 9:30 PM PKT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">Inquire About Upcoming Cohorts</h2>
            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold">Inquiry Received!</h3>
                <p className="text-xs text-emerald-700">
                  An admissions advisor will contact you within 24 hours on your phone/WhatsApp.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Ali"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Program of Interest</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white">
                    <option>CCNA 200-301 Enterprise Networking</option>
                    <option>Certified Ethical Hacker & Cyber Defense</option>
                    <option>Full-Stack Web Engineering</option>
                    <option>AI & Machine Learning with Python</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Message</label>
                  <textarea
                    rows={3}
                    placeholder="I am interested in evening or weekend batch..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
