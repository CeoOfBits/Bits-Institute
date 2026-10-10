import React from 'react';
import Link from 'next/link';
import {
  Server,
  ShieldAlert,
  Cloud,
  Code2,
  GraduationCap,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Zap,
  Building,
  Check,
  Headphones,
} from 'lucide-react';
import { ServicesShowcase, ITService } from '@/components/ServicesShowcase';

async function getServices(): Promise<ITService[]> {
  try {
    const res = await fetch('http://localhost:4000/api/public/services', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  // Fallback default list
  return [
    {
      id: 'srv-digital-marketing',
      slug: 'digital-marketing',
      title: 'Digital Marketing & Performance Growth',
      category: 'Digital Marketing',
      shortDescription: 'Data-driven SEO, Google Ads (PPC), Meta Ads, social media marketing, and high-converting lead generation campaigns.',
      description: 'Accelerate business revenue and customer acquisition with high-impact performance marketing. We engineer end-to-end digital marketing funnels, from technical search engine optimization (SEO) and hyper-targeted Google search ads to Meta (Facebook & Instagram) campaigns and conversion rate optimization (CRO) that turn clicks into loyal paying clients.',
      iconName: 'TrendingUp',
      features: [
        'Technical SEO, Keyword Architecture & Google First-Page Ranking',
        'High-ROI Google Search & Display PPC Advertising Campaigns',
        'Meta (Facebook & Instagram) & LinkedIn B2B Ad Management',
        'Content Marketing, Copywriting & Email Retargeting Funnels',
        'Real-Time Conversion Tracking, GTM, Pixel & GA4 Analytics',
      ],
      deliverables: [
        'Comprehensive Multi-Channel Growth Strategy & Competitor Audit',
        'Weekly Campaign Performance, ROAS & Ad Spend Analytics Reports',
        'Conversion Tracking Infrastructure (Google Tag Manager & Meta Pixel)',
        'High-Converting Ad Copy, Creative Variations & Landing Page Recommendations',
      ],
      pricingStartingAt: 'PKR 45,000 / Mo',
      turnaroundTime: 'Monthly Retainer / Ongoing',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-graphic-designing',
      slug: 'graphic-designing',
      title: 'Creative Graphic Designing & Brand Identity',
      category: 'Graphic Design',
      shortDescription: 'Modern corporate branding, logo design, social media creative kits, marketing collateral, UI/UX mockups, and print packaging.',
      description: 'Establish an unforgettable visual identity. Our senior creative designers craft bespoke corporate brand systems, modern vector logos, stationery, high-engagement social media campaigns, packaging, and digital UI assets in Figma and Adobe Creative Suite that elevate your brand prestige above competitors.',
      iconName: 'Palette',
      features: [
        'Custom Vector Logo Design with Complete Brand Style Guidelines',
        'Social Media Creative Bundles, Posters, Banners & Promotional Graphics',
        'Corporate Stationery (Business Cards, Letterheads, Envelopes & ID Badges)',
        'Print Collateral, Product Packaging, Billboards & Exhibition Standees',
        'Figma UI/UX Prototypes & High-Fidelity Website Wireframes',
      ],
      deliverables: [
        'Complete Master Vector Source Files (AI, EPS, SVG, PSD & Print PDF)',
        'Official Brand Guidelines Manual (Color Palette, Typography, Logo Usage Rules)',
        'Ready-to-Publish High-Resolution Web & Print Export Assets',
        '100% Commercial Copyright Ownership Transfer',
      ],
      pricingStartingAt: 'PKR 35,000',
      turnaroundTime: '3 – 7 Business Days',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-website-development',
      slug: 'website-development',
      title: 'Custom Website & Web Application Development',
      category: 'Website Development',
      shortDescription: 'High-speed responsive business websites, eCommerce platforms, custom CMS portals, and modern full-stack web applications.',
      description: 'Build a blazing-fast, secure, and mobile-responsive digital presence for your brand. We engineer modern websites using Next.js, React, Tailwind CSS, Node.js, and WordPress with sub-second page loads, intuitive administration dashboards, robust security, and seamless SEO structure.',
      iconName: 'Code2',
      features: [
        'Mobile-First Responsive Design Engineered for High Conversions',
        'Modern Next.js, React, TypeScript & High-Performance Architecture',
        'Custom Content Management (CMS) & Client Portal Integration',
        'Core Web Vitals Optimization (90+ Google PageSpeed Score)',
        'Secure Payment Gateway Integration, SSL & Contact Lead Forms',
      ],
      deliverables: [
        'Complete Clean Source Code Repository & Live Production Deployment',
        'Custom Domain, Cloud Hosting, SSL & Corporate Email Configuration',
        'Admin Training Walkthrough for Effortless Content Updates',
        '60-Day Technical Maintenance & Post-Launch Bug Warranty',
      ],
      pricingStartingAt: 'PKR 65,000',
      turnaroundTime: '1 – 3 Weeks',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-it-networking',
      slug: 'it-networking',
      title: 'Enterprise IT Networking & Infrastructure',
      category: 'IT Networking',
      shortDescription: 'Turnkey office LAN/WAN setup, Cisco routing & switching, VLAN segmentation, enterprise Wi-Fi 6, and secure inter-branch VPNs.',
      description: 'Ensure rock-solid uptime and zero packet loss across your offices. Our certified Cisco & MikroTik engineers design, deploy, and maintain structured network cabling, managed server racks, multi-SSID wireless mesh networks, firewall perimeter security, and encrypted site-to-site VPN tunnels.',
      iconName: 'Server',
      features: [
        'Structured CAT6 / Fiber Optic Cabling & Server Rack Cable Dressing',
        'Cisco, MikroTik & Ubiquiti Managed Switches & Router Provisioning',
        'VLAN Segmentation for Voice, Data, Guest & Surveillance Isolation',
        'Enterprise Seamless Wi-Fi 6 Mesh Deployment & Heatmap Optimization',
        'Site-to-Site & Remote Access IPsec/WireGuard Encrypted VPNs',
      ],
      deliverables: [
        'Complete Network Topology Diagram & Structured Cable Labeling Scheme',
        'Switch, Router & Firewall Configuration Archive Backups',
        'Bandwidth Stress-Testing & Latency Benchmark Certification Report',
        '30-Day On-Site / Remote Cutover Support SLA',
      ],
      pricingStartingAt: 'PKR 60,000',
      turnaroundTime: '3 – 7 Days',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-cameras-ip',
      slug: 'cameras-ip',
      title: 'Smart IP Cameras, CCTV & Surveillance Systems',
      category: 'IP Cameras',
      shortDescription: 'HD/4K IP camera installation, NVR setup, color night vision, mobile phone live remote viewing, and AI motion detection.',
      description: 'Protect your premises, assets, and personnel 24/7 with commercial-grade video surveillance. We supply, configure, and install Dahua, Hikvision, and Uniview IP security cameras with crystal-clear 4K resolution, color night vision, PoE structured infrastructure, RAID storage, and seamless smartphone remote monitoring.',
      iconName: 'Camera',
      features: [
        'High-Definition 2MP, 4MP & 4K UHD Night Vision IP Cameras',
        'Network Video Recorder (NVR) with Redundant Hard Drive Storage',
        'PoE (Power over Ethernet) Clean Concealed Wiring Installation',
        'Live Remote Mobile App Viewing (iOS & Android) & Multi-Monitor Control',
        'Smart AI Motion Alerts, Human/Vehicle Detection & Perimeter Tripwires',
      ],
      deliverables: [
        'Professional On-Site Camera Mounting, Cabling & NVR Setup',
        'Multi-Device Remote Viewing Configuration on Phones, Tablets & PCs',
        'Surveillance Storage Optimization (15 to 60 Days Continuous Recording)',
        '1-Year Hardware Warranty & Dedicated After-Sales Technical Support',
      ],
      pricingStartingAt: 'PKR 55,000',
      turnaroundTime: '2 – 5 Days',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-cybersecurity',
      slug: 'cybersecurity',
      title: 'Enterprise Cybersecurity & VAPT Defense',
      category: 'Cybersecurity',
      shortDescription: 'Vulnerability assessment & penetration testing (VAPT), firewall hardening, malware defense, and ISO 27001 compliance readiness.',
      description: 'Uncover mission-critical security loopholes before malicious hackers exploit them. Our OSCP and CEH certified ethical hackers conduct rigorous real-world penetration testing across your web applications, APIs, on-premises networks, and cloud infrastructure to safeguard your critical data and corporate reputation.',
      iconName: 'ShieldAlert',
      features: [
        'OWASP Top 10 Web Application & API Vulnerability Assessment',
        'Black-Box & Gray-Box External Network Perimeter Penetration Testing',
        'Active Directory, Internal Network & Credential Stuffing Audits',
        'Firewall Hardening, Malware Defense & Incident Response Strategy',
        'Employee Phishing Simulation & Corporate Security Awareness Briefings',
      ],
      deliverables: [
        'Executive Risk Summary for Management & Technical Remediation Report',
        'Prioritized Vulnerability Roadmap with Code-Level Patch Instructions',
        'Complimentary Re-Testing Verification after Security Patches are Deployed',
        'Official BITS Institute Cybersecurity Audit Certificate',
      ],
      pricingStartingAt: 'PKR 85,000',
      turnaroundTime: '5 – 10 Business Days',
      featured: true,
      status: 'ACTIVE',
    },
    {
      id: 'srv-ai-agents',
      slug: 'ai-agents',
      title: 'Autonomous AI Agents & Intelligent Workflow Automation',
      category: 'AI Agents',
      shortDescription: 'Custom AI chatbots, RAG document search agents, WhatsApp/CRM automation bots, and intelligent business workflows.',
      description: 'Transform repetitive manual tasks with autonomous AI agents. We build custom conversational AI assistants, WhatsApp/Telegram automation bots, private document retrieval agents (chat with your company PDFs, policies, and ERP records), and automated API workflows that save hundreds of human labor hours each month.',
      iconName: 'Bot',
      features: [
        'Custom WhatsApp, Website & Telegram AI Customer Support Chatbots',
        'Private Document RAG Agents (Instant Answers from Policies, Catalogs & PDFs)',
        'Lead Qualification, Meeting Booking & Automated CRM Data Entry',
        'Zapier, Make, n8n Enterprise Workflow Integrations & Database Sync',
        'Secure LLM Architecture with Enterprise Privacy & Safety Guardrails',
      ],
      deliverables: [
        'Fully Deployed AI Agent Integrated into Website, WhatsApp, or Slack',
        'Custom Vector Database & Company Knowledge Ingestion Pipeline',
        'Live Analytics Dashboard for Conversation Logs, Leads & Transcripts',
        'Staff Training Workshop & Administrator Management Guide',
      ],
      pricingStartingAt: 'PKR 75,000',
      turnaroundTime: '1 – 2 Weeks',
      featured: true,
      status: 'ACTIVE',
    },
  ];
}

export const metadata = {
  title: 'Enterprise IT, Digital & Creative Services — BITS Institute',
  description:
    'Full-service IT solutions: Digital Marketing, Graphic Designing, Website Development, IT Networking, IP Cameras & Surveillance, Cybersecurity, and Autonomous AI Agents.',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-white min-h-screen space-y-16 pb-16">
      {/* ── HERO BANNER (MATCHING HOME PAGE MODERN DARK HIGH-TECH STYLE) ── */}
      <section className="relative overflow-hidden bg-[#040714] text-white pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-20 border-b border-cyan-950/40">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-cyan-500/12 rounded-full blur-[150px] pointer-events-none -z-0" />
        <div className="absolute -top-20 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-0" />

        {/* Cyber Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none -z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(14,165,233,0.2),rgba(4,7,20,0.96))] pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span>Commercial IT & Engineering Services • BITS Enterprise Solutions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Enterprise IT Solutions &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                Cyber Defense Services
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Backed by physical Cisco lab hardware and certified practitioners (CCIE, OSCP, AWS Certified),
              we engineer bulletproof technology infrastructure, secure network perimeters, and modern software architectures.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/contact?type=rfp"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4 text-cyan-200" />
                <span>Talk to Solutions Architect</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 hover:border-cyan-400/50 backdrop-blur-md transition-all shadow-sm"
              >
                <span>Submit RFP Document</span>
              </Link>
            </div>
          </div>

          {/* ── 4-PILLAR SERVICE EXCELLENCE BARS (SAME DESIGN AS HOME PAGE) ── */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Zero-Downtime Migration</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Isolated staging verification followed by seamless live cutover.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">VAPT Hardened Security</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Real penetration testing audit included with every production delivery.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Strict 24/7 SLA Handover</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Clear escalation protocols, SOP documentation, and support coverage.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3.5 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs sm:text-sm font-bold text-white">Full IP & Code Transfer</h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    100% commercial ownership with zero vendor lock-in or licensing traps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── 4-STEP DELIVERY LIFECYCLE ── */}
        <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0056D2] block mb-1">
              Structured Project Delivery
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Our 4-Stage Enterprise Execution Methodology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-xs flex items-center justify-center border border-blue-100">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Discovery & Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Comprehensive assessment of your existing network topology, code vulnerabilities, or workflow bottlenecks.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-xs flex items-center justify-center border border-blue-100">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Solution Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Engineering formal RFC documentation, threat models, circuit design, and precise milestone timelines.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-xs flex items-center justify-center border border-blue-100">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Zero-Downtime Deployment</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Execution by certified leads in isolated staging environments followed by clean cutovers and penetration tests.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-100">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">SLA Support & Handover</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Comprehensive knowledge transfer, standard operating procedures, and 24/7 incident response SLA coverage.
              </p>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE SERVICES CATALOG ── */}
        <ServicesShowcase services={services} />

        {/* ── ENTERPRISE INQUIRY FORM ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0056D2] via-[#0284C7] to-[#1E3A8A] p-8 sm:p-12 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Commercial Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Request an Enterprise RFP or Architecture Audit
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-normal">
              Schedule a technical discovery session with our Lead Solutions Architect. We provide NDA-protected discussions and detailed technical proposals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact?type=rfp"
              className="px-6 py-3 rounded-xl bg-white text-[#0056D2] hover:bg-blue-50 font-semibold text-xs sm:text-sm text-center shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to Solutions Architect</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#0041a8] hover:bg-[#003588] text-white font-semibold text-xs sm:text-sm text-center border border-white/30 transition-all"
            >
              Submit RFP Document
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
