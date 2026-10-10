'use client';

import React, { useState } from 'react';
import { MessageCircle, PhoneCall, X } from 'lucide-react';

export function FloatingWhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Official counselor WhatsApp number
  const whatsappNumber = '923001234567';
  const defaultMessage = encodeURIComponent(
    'Hello BITS Institute! I would like to inquire about upcoming course admissions and IT services.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Hover message bubble */}
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span>Chat live with an Admissions Advisor</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-110 active:scale-95"
        aria-label="Contact BITS Institute on WhatsApp"
      >
        {/* Glowing pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-current transition-transform group-hover:rotate-12" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white" />
      </a>
    </div>
  );
}
