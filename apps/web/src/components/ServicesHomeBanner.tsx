'use client';

import React from 'react';
import Link from 'next/link';
import {
  Network,
  Camera,
  Megaphone,
  ShieldCheck,
  Code2,
  ArrowRight,
} from 'lucide-react';

export interface ServiceCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  icon: any;
  badgeBg: string;
  arrowBg: string;
  arrowHoverBg: string;
  arrowText: string;
}

export function ServicesHomeBanner({ services: _services }: { services?: any[] } = {}) {
  const services: ServiceCardData[] = [
    {
      id: 'networking',
      slug: 'it-networking',
      title: 'Networking',
      description:
        'Secure, reliable and scalable network solutions for your business and organization.',
      image: '/images/services/networking.jpg',
      icon: Network,
      badgeBg: 'bg-[#0056D2]',
      arrowBg: 'bg-blue-50 text-[#0056D2]',
      arrowHoverBg: 'group-hover:bg-[#0056D2] group-hover:text-white',
      arrowText: 'text-[#0056D2]',
    },
    {
      id: 'ip-camera',
      slug: 'cameras-ip',
      title: 'IP Camera',
      description:
        'Advanced surveillance solutions with high-quality IP cameras for complete security and peace of mind.',
      image: '/images/services/ip-camera.jpg',
      icon: Camera,
      badgeBg: 'bg-emerald-500',
      arrowBg: 'bg-emerald-50 text-emerald-600',
      arrowHoverBg: 'group-hover:bg-emerald-500 group-hover:text-white',
      arrowText: 'text-emerald-600',
    },
    {
      id: 'digital-marketing',
      slug: 'digital-marketing',
      title: 'Digital Marketing',
      description:
        'Grow your brand with strategic digital marketing solutions that get you noticed and drive results.',
      image: '/images/services/digital-marketing.jpg',
      icon: Megaphone,
      badgeBg: 'bg-purple-600',
      arrowBg: 'bg-purple-50 text-purple-600',
      arrowHoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
      arrowText: 'text-purple-600',
    },
    {
      id: 'cybersecurity',
      slug: 'cybersecurity',
      title: 'Cybersecurity',
      description:
        'Protect your data, systems and business with advanced security solutions and expert support.',
      image: '/images/services/cybersecurity.jpg',
      icon: ShieldCheck,
      badgeBg: 'bg-rose-500',
      arrowBg: 'bg-rose-50 text-rose-600',
      arrowHoverBg: 'group-hover:bg-rose-500 group-hover:text-white',
      arrowText: 'text-rose-600',
    },
    {
      id: 'web-development',
      slug: 'website-development',
      title: 'Web Development',
      description:
        'Custom, modern and responsive websites and web applications built to fit your goals.',
      image: '/images/services/web-dev.jpg',
      icon: Code2,
      badgeBg: 'bg-amber-500',
      arrowBg: 'bg-amber-50 text-amber-600',
      arrowHoverBg: 'group-hover:bg-amber-500 group-hover:text-white',
      arrowText: 'text-amber-600',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 py-12 sm:py-16 rounded-3xl border border-slate-100/80 shadow-2xs">
      {/* ── SUBTLE ABSTRACT ACCENTS (MATCHING REFERENCE IMAGE) ── */}
      {/* Top-Right Soft Blue Orb */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
      {/* Bottom-Left Soft Blue Orb */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Top-Left Dotted Pattern */}
      <div className="pointer-events-none absolute top-6 left-6 grid grid-cols-4 gap-1.5 opacity-20 hidden sm:grid">
        {[...Array(16)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#0056D2]" />
        ))}
      </div>

      {/* Bottom-Right Dotted Pattern */}
      <div className="pointer-events-none absolute bottom-6 right-6 grid grid-cols-4 gap-1.5 opacity-20 hidden sm:grid">
        {[...Array(16)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#0056D2]" />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* ── SECTION HEADER (MATCHING REFERENCE EXACTLY) ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {/* Small label with horizontal decorative lines */}
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0056D2]/40 rounded-full" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#0056D2] uppercase">
              OUR SERVICES
            </span>
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#0056D2]/40 rounded-full" />
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Technology Solutions{' '}
            <span className="text-[#0056D2]">for a Smarter Tomorrow</span>
          </h2>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
            We provide reliable, secure and innovative IT solutions to help individuals, businesses and organizations grow in the digital world.
          </p>
        </div>

        {/* ── 5 SERVICE CARDS HORIZONTAL GRID (RESPONSIVE) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {services.map((item) => {
            const IconComponent = item.icon;

            return (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-300/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden text-center relative"
              >
                <div>
                  {/* Top Image Container */}
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Overlapping Circular Icon Badge */}
                  <div className="relative -mt-6 z-10 flex justify-center">
                    <div
                      className={`w-12 h-12 rounded-full ${item.badgeBg} text-white flex items-center justify-center border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-4 sm:px-5 pt-3 pb-2 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Circular Arrow Button */}
                <div className="pt-2 pb-5 flex justify-center">
                  <div
                    className={`w-8 h-8 rounded-full ${item.arrowBg} ${item.arrowHoverBg} flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-xs`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── CENTERED PROMINENT BUTTON (VIEW ALL SERVICES →) ── */}
        <div className="pt-4 text-center space-y-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0A192F] hover:bg-[#0056D2] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Reference Image Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="w-2.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-4 h-1.5 rounded-full bg-[#0056D2]" />
            <span className="w-2.5 h-1.5 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
