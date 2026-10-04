import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info with original logo in a crisp container */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block p-2 bg-white rounded-xl shadow-xs">
              <Logo size="md" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pr-4">
              BITS Institute (Bright Information Technology Solutions) is a recognized technology and cybersecurity academy.
              Providing hands-on engineering, certified instructors, enterprise Cisco labs, and verifiable credentials.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Accredited Academic & Career Institute</span>
            </div>
          </div>

          {/* Core Programs */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Core Programs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses/ccna-enterprise-networking" className="hover:text-cyan-400 transition-colors">
                  Cisco CCNA 200-301
                </Link>
              </li>
              <li>
                <Link href="/courses/ethical-hacking-offensive-security" className="hover:text-cyan-400 transition-colors">
                  Ethical Hacking & Cyber Defense
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-web-development" className="hover:text-cyan-400 transition-colors">
                  Full-Stack Web Engineering
                </Link>
              </li>
              <li>
                <Link href="/courses/ai-machine-learning-python" className="hover:text-cyan-400 transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold pt-1">
                  <span>View All Courses</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Student & Verification */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Student Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/verify" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Student Learning Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Institute Administration
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-400 transition-colors">
                  Faculty Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Location */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Campus & Inquiries</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>BITS Campus, Main Boulevard, Commercial Zone, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+92 (42) 3588-BITS / 0300-1234567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>admissions@bits.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BITS Institute (Bright Information Technology Solutions). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Enrollment</Link>
            <Link href="/verify" className="hover:text-cyan-400 transition-colors">Credential Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
