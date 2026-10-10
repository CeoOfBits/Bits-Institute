'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const isRfpMode = searchParams.get('type') === 'rfp';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [programOrService, setProgramOrService] = useState(
    isRfpMode ? 'Network Engineering & Infrastructure' : 'CCNA 200-301 Enterprise Networking',
  );
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'ADMISSION' | 'SERVICE'>(isRfpMode ? 'SERVICE' : 'ADMISSION');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('type') === 'rfp') {
      setType('SERVICE');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'SERVICE') {
        // Submit directly to IT Service Requests API
        const res = await fetch('http://localhost:4000/api/public/services/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: fullName,
            clientEmail: email || 'contact@client.com',
            clientPhone: phone,
            companyName: organization || undefined,
            category: programOrService,
            title: `${programOrService} Project Request`,
            description: message || 'Detailed proposal request submitted via web portal.',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Submission failed');
        setTicketNo(data.ticketNumber);
        setSubmitted(true);
      } else {
        // Submit to General Admissions Inquiry API
        const res = await fetch('http://localhost:4000/api/public/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            phone,
            email,
            programOrService,
            organization,
            message,
            type: 'ADMISSION',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Submission failed');
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please verify network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0056D2] text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Admissions, Campus Tours & IT Services RFP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {type === 'SERVICE' ? 'Request Enterprise IT Service Proposal' : 'Contact BITS Institute'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
            Have questions regarding upcoming batches, lab timings, installment plans, or corporate IT solutions?
            Our career counselors and technical advisors respond within 24 hours.
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
                  <h3 className="font-bold text-slate-900 text-sm">Official Email</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    admissions@bits.edu.pk • services@bits.edu.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Campus & Hands-On Lab Hours</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Monday – Saturday: 9:00 AM – 9:30 PM PKT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            {/* Type selector toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setType('ADMISSION')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  type === 'ADMISSION' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Course Admission
              </button>
              <button
                type="button"
                onClick={() => setType('SERVICE')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  type === 'SERVICE' ? 'bg-white text-[#0056D2] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Enterprise IT Services RFP
              </button>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold">
                  {type === 'SERVICE' ? 'Project RFP Registered!' : 'Inquiry Received!'}
                </h3>
                {ticketNo && (
                  <p className="text-xs font-mono font-bold text-emerald-900 bg-white/70 py-1 px-3 rounded-lg border border-emerald-200 inline-block">
                    Tracking Ticket: {ticketNo}
                  </p>
                )}
                <p className="text-xs text-emerald-700">
                  {type === 'SERVICE'
                    ? 'Our Lead Solutions Architect will review your scope and follow up with an NDA and commercial quotation within 24 hours.'
                    : 'An admissions advisor will contact you within 24 hours on your phone/WhatsApp.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">
                    {type === 'SERVICE' ? 'Contact / Client Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ali@company.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                    />
                  </div>
                </div>

                {type === 'SERVICE' && (
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase">Company / Organization</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Tech Enterprise Ltd."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">
                    {type === 'SERVICE' ? 'Service Required' : 'Program of Interest'}
                  </label>
                  {type === 'SERVICE' ? (
                    <select
                      value={programOrService}
                      onChange={(e) => setProgramOrService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                    >
                      <option>Networking & Infrastructure</option>
                      <option>Cyber Security & Threat Defense</option>
                      <option>Web Development & Modern Applications</option>
                      <option>Cloud Infrastructure & DevOps</option>
                      <option>Digital Marketing & Performance Growth</option>
                      <option>IP Camera & Enterprise Surveillance</option>
                      <option>Other Custom IT Services</option>
                    </select>
                  ) : (
                    <select
                      value={programOrService}
                      onChange={(e) => setProgramOrService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                    >
                      <option>CCNA 200-301 Enterprise Networking</option>
                      <option>Certified Ethical Hacker & Cyber Defense</option>
                      <option>Full-Stack Web Engineering</option>
                      <option>AI & Machine Learning with Python</option>
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">
                    {type === 'SERVICE' ? 'Project Description & Requirements' : 'Message / Specific Inquiries'}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      type === 'SERVICE'
                        ? 'Outline scope, current infrastructure, and estimated timeline...'
                        : 'Ask about weekend or evening batches, prerequisites, installments...'
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#0056D2] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {loading
                    ? 'Submitting Request...'
                    : type === 'SERVICE'
                    ? 'Submit Enterprise Project Request'
                    : 'Submit Admissions Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-semibold text-slate-500">Loading Contact Form...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
