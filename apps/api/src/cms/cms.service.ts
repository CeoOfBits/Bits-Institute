import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module.js';
import { AuditService } from '../audit/audit.module.js';
import { pageMeta, slugify } from '../common/utils.js';

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: any;
  featuredImage?: string;
  categoryId: string;
  authorId?: string;
  featured?: boolean;
  status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'UNPUBLISHED';
  publishedAt?: Date;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  tags?: string[];
}

@Injectable()
export class CmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ───────────────────────── Public Blog Endpoints ─────────────────────────

  async listPublicPosts(q: { category?: string; tag?: string; search?: string; page: number; pageSize: number }) {
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
      publishedAt: { lte: new Date() },
    };
    if (q.category) where.category = { slug: q.category };
    if (q.tag) where.tags = { some: { tag: { slug: q.tag } } };
    if (q.search) {
      where.OR = [
        { title: { contains: q.search, mode: 'insensitive' } },
        { excerpt: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          featured: true,
          publishedAt: true,
          category: { select: { name: true, slug: true } },
          author: {
            select: {
              user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
          tags: { select: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    ]);

    return {
      items,
      meta: pageMeta(total, q.page, q.pageSize),
    };
  }

  async getPublicPost(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        category: { select: { name: true, slug: true } },
        author: {
          select: {
            headline: true,
            bio: true,
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    });

    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async listCategories() {
    return this.prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
      orderBy: { name: 'asc' },
    });
  }

  // ───────────────────────── Admin Blog Management ─────────────────────────

  async createPost(input: BlogPostInput, userId: string, ip?: string) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title);
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Post with this slug already exists');

    const post = await this.prisma.blogPost.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage,
        categoryId: input.categoryId,
        authorId: input.authorId,
        featured: input.featured ?? false,
        status: input.status ?? 'DRAFT',
        publishedAt: input.status === 'PUBLISHED' ? (input.publishedAt ?? new Date()) : null,
        seoTitle: input.seoTitle ?? input.title,
        metaDescription: input.metaDescription ?? input.excerpt,
        canonicalUrl: input.canonicalUrl,
        ogImage: input.ogImage ?? input.featuredImage,
      },
    });

    await this.audit.record({
      userId,
      action: 'blog.create',
      entityType: 'BlogPost',
      entityId: post.id,
      metadata: { title: post.title, slug: post.slug },
      ip,
    });

    return post;
  }

  async updatePost(id: string, input: Partial<BlogPostInput>, userId: string, ip?: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    const data: any = { ...input };
    if (input.slug) {
      data.slug = slugify(input.slug);
      const hit = await this.prisma.blogPost.findUnique({ where: { slug: data.slug } });
      if (hit && hit.id !== id) throw new ConflictException('Slug is already in use');
    }

    if (input.status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    delete data.tags;

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data,
    });

    await this.audit.record({
      userId,
      action: 'blog.update',
      entityType: 'BlogPost',
      entityId: id,
      metadata: { title: updated.title },
      ip,
    });

    return updated;
  }

  async deletePost(id: string, userId: string, ip?: string) {
    await this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'UNPUBLISHED' },
    });
    await this.audit.record({
      userId,
      action: 'blog.delete',
      entityType: 'BlogPost',
      entityId: id,
      ip,
    });
    return { success: true };
  }

  // ───────────────────────── IT Services Management ─────────────────────────

  private async getStoredServices(): Promise<any[]> {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: 'it_services' },
    });
    if (setting && Array.isArray(setting.value) && setting.value.length > 0) {
      const hasNewSeed = setting.value.some((s: any) => s.id === 'srv-digital-marketing');
      if (hasNewSeed) {
        return setting.value as any[];
      }
    }
    // Initialize or migrate to the 7 core services in database
    await this.prisma.siteSetting.upsert({
      where: { key: 'it_services' },
      create: { key: 'it_services', value: DEFAULT_IT_SERVICES as any },
      update: { value: DEFAULT_IT_SERVICES as any },
    });
    return DEFAULT_IT_SERVICES;
  }

  async resetDefaultServices() {
    await this.prisma.siteSetting.upsert({
      where: { key: 'it_services' },
      create: { key: 'it_services', value: DEFAULT_IT_SERVICES as any },
      update: { value: DEFAULT_IT_SERVICES as any },
    });
    return DEFAULT_IT_SERVICES;
  }

  async getPublicServices(category?: string) {
    const list = await this.getStoredServices();
    return list.filter((s) => {
      if (s.status === 'INACTIVE') return false;
      if (category && category !== 'ALL') {
        return s.category.toLowerCase().includes(category.toLowerCase());
      }
      return true;
    });
  }

  async getPublicService(slug: string) {
    const list = await this.getStoredServices();
    const item = list.find((s) => s.slug === slug && s.status !== 'INACTIVE');
    if (!item) throw new NotFoundException('Service not found');
    return item;
  }

  async adminListServices() {
    return this.getStoredServices();
  }

  async adminCreateService(input: any, userId: string, ip?: string) {
    const list = await this.getStoredServices();
    const slug = slugify(input.slug || input.title);
    if (list.some((s) => s.slug === slug)) {
      throw new ConflictException('A service with this slug or title already exists');
    }

    const newService = {
      id: `srv-${Date.now().toString(36)}`,
      slug,
      title: input.title,
      category: input.category || 'IT Solutions',
      shortDescription: input.shortDescription || '',
      description: input.description || '',
      iconName: input.iconName || 'Server',
      features: Array.isArray(input.features) ? input.features : [],
      deliverables: Array.isArray(input.deliverables) ? input.deliverables : [],
      pricingStartingAt: input.pricingStartingAt || 'Contact for Quote',
      turnaroundTime: input.turnaroundTime || 'Custom Timeline',
      featured: Boolean(input.featured),
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newService, ...list];
    await this.prisma.siteSetting.upsert({
      where: { key: 'it_services' },
      create: { key: 'it_services', value: updatedList as any },
      update: { value: updatedList as any },
    });

    await this.audit.record({
      userId,
      action: 'service.create',
      entityType: 'ITService',
      entityId: newService.id,
      metadata: { title: newService.title },
      ip,
    });

    return newService;
  }

  async adminUpdateService(id: string, input: any, userId: string, ip?: string) {
    const list = await this.getStoredServices();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException('Service not found');

    const current = list[idx];
    const slug = input.slug ? slugify(input.slug) : current.slug;
    if (slug !== current.slug && list.some((s) => s.slug === slug && s.id !== id)) {
      throw new ConflictException('Slug is already used by another service');
    }

    const updated = {
      ...current,
      ...input,
      slug,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;

    await this.prisma.siteSetting.upsert({
      where: { key: 'it_services' },
      create: { key: 'it_services', value: list as any },
      update: { value: list as any },
    });

    await this.audit.record({
      userId,
      action: 'service.update',
      entityType: 'ITService',
      entityId: id,
      metadata: { title: updated.title },
      ip,
    });

    return updated;
  }

  async adminDeleteService(id: string, userId: string, ip?: string) {
    const list = await this.getStoredServices();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length === list.length) {
      throw new NotFoundException('Service not found');
    }

    await this.prisma.siteSetting.upsert({
      where: { key: 'it_services' },
      create: { key: 'it_services', value: filtered as any },
      update: { value: filtered as any },
    });

    await this.audit.record({
      userId,
      action: 'service.delete',
      entityType: 'ITService',
      entityId: id,
      ip,
    });

    return { success: true };
  }

  // ───────────────────────── Leads & Inquiries Management ─────────────────────────

  private async getStoredInquiries(): Promise<any[]> {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: 'inquiries' },
    });
    if (setting && Array.isArray(setting.value)) {
      return setting.value as any[];
    }
    return [];
  }

  async createPublicInquiry(input: any, ip?: string) {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        name: input.fullName || input.name || 'Anonymous',
        email: input.email || '',
        phone: input.phone || null,
        type: input.type === 'SERVICE' ? 'SERVICE' : 'ADMISSION',
        subject: input.programOrService || input.subject || null,
        courseSlug: input.courseSlug || null,
        message: input.message || 'No details provided',
        status: 'NEW',
        notes: input.organization ? `Organization: ${input.organization}` : null,
        ip,
      },
    });

    return inquiry;
  }

  async adminListInquiries(type?: string) {
    const where: any = {};
    if (type && type !== 'ALL') {
      where.type = type.toUpperCase();
    }
    return this.prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminUpdateInquiry(id: string, input: any) {
    const exists = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Inquiry not found');

    return this.prisma.inquiry.update({
      where: { id },
      data: {
        status: input.status ?? exists.status,
        notes: input.adminNotes ?? input.notes ?? exists.notes,
      },
    });
  }

  async adminDeleteInquiry(id: string) {
    const exists = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Inquiry not found');

    await this.prisma.inquiry.delete({ where: { id } });
    return { success: true };
  }
}

const DEFAULT_IT_SERVICES = [
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
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
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];
