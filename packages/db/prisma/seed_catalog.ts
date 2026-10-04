import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich catalog & instructor profiles...');

  // 1. Create Instructors
  const instructorsData = [
    {
      email: 'ahmed.khan@bits.edu.pk',
      firstName: 'Engr. Ahmed',
      lastName: 'Khan',
      headline: 'Senior Network & Infrastructure Architect (CCIE #58291)',
      bio: 'Over 14 years of enterprise network consulting, routing & switching, firewall architectures, and carrier-grade Cisco engineering.',
      expertise: ['CCNA', 'CCNP', 'Enterprise Networking', 'BGP', 'OSPF', 'Network Security'],
      experience: 14,
    },
    {
      email: 'dr.farhan@bits.edu.pk',
      firstName: 'Dr. Farhan',
      lastName: 'Tariq',
      headline: 'Principal Cybersecurity Specialist & OSCP Trainer',
      bio: 'Cyber defense analyst, active bug bounty hunter, and former government infrastructure security auditor with OSCP, CEH, and CISSP credentials.',
      expertise: ['Ethical Hacking', 'Penetration Testing', 'SIEM', 'SOC Operations', 'Digital Forensics'],
      experience: 11,
    },
    {
      email: 'sara.malik@bits.edu.pk',
      firstName: 'Sara',
      lastName: 'Malik',
      headline: 'Staff Full-Stack Engineer & Cloud Solutions Architect',
      bio: 'Specialist in modern TypeScript platforms, scalable distributed systems, Next.js, microservices and enterprise DevOps pipelines.',
      expertise: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
      experience: 9,
    },
  ];

  const instructorIds: Record<string, string> = {};
  const instructorRole = await prisma.role.findUniqueOrThrow({ where: { key: 'INSTRUCTOR' } });

  for (const ins of instructorsData) {
    let user = await prisma.user.findUnique({ where: { email: ins.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: ins.email,
          passwordHash: await bcrypt.hash('Instructor12345!', 12),
          firstName: ins.firstName,
          lastName: ins.lastName,
          status: 'ACTIVE',
          emailVerifiedAt: new Date(),
          roles: { create: { roleId: instructorRole.id } },
        },
      });
    }

    let instProfile = await prisma.instructor.findUnique({ where: { userId: user.id } });
    if (!instProfile) {
      instProfile = await prisma.instructor.create({
        data: {
          userId: user.id,
          headline: ins.headline,
          bio: ins.bio,
          expertise: ins.expertise,
          experience: ins.experience,
        },
      });
    }
    instructorIds[ins.email] = instProfile.id;
  }

  // Categories lookup
  const networking = await prisma.category.findUniqueOrThrow({ where: { slug: 'networking' } });
  const cyber = await prisma.category.findUniqueOrThrow({ where: { slug: 'cyber-security' } });
  const web = await prisma.category.findUniqueOrThrow({ where: { slug: 'web-development' } });
  const ai = await prisma.category.findUniqueOrThrow({ where: { slug: 'artificial-intelligence' } });

  // 2. Create Courses with Modules & Batches
  const courses = [
    {
      title: 'CCNA 200-301 Enterprise Networking',
      slug: 'ccna-enterprise-networking',
      shortDescription: 'Master modern IP networks, Cisco router & switch configurations, dynamic routing protocols, network automation, and security essentials.',
      description: 'The Cisco Certified Network Associate (CCNA 200-301) program is designed to provide comprehensive, hands-on training for designing, configuring, securing, and troubleshooting modern enterprise networks. You will work on real Cisco hardware and Packet Tracer/GNS3 topologies, covering IPv4/IPv6 subnetting, VLANs, EtherChannel, OSPFv2/v3, ACLs, NAT, Wireless LANs, and Network Automation with Python.',
      categoryId: networking.id,
      durationLabel: '3 Months (Weekend & Weekday)',
      durationHours: 96,
      level: 'BEGINNER' as const,
      priceMinor: 3500000, // PKR 35,000
      currency: 'PKR',
      certificateCode: 'CCNA',
      defaultInstructorId: instructorIds['ahmed.khan@bits.edu.pk'],
      status: 'PUBLISHED' as const,
      seoTitle: 'CCNA 200-301 Training in Lahore & Online — BITS Institute',
      seoDescription: 'Enroll in official CCNA 200-301 course at BITS Institute. Hands-on Cisco labs, exam vouchers, live instructor classes.',
      requirements: ['Basic computer literacy', 'Passion for computer systems and networks', 'Laptop with 8GB RAM minimum'],
      outcomes: [
        'Design and deploy scalable LAN and WAN topologies',
        'Configure Cisco Catalyst switches and Integrated Service Routers',
        'Troubleshoot multi-area OSPF, ACL security and NAT translation',
        'Clear Cisco CCNA 200-301 certification exam on first attempt',
      ],
      modules: [
        {
          title: 'Module 1: Network Fundamentals & IPv4/IPv6 Architecture',
          lessons: [
            { title: 'OSI 7-Layer vs TCP/IP Protocol Suite in Enterprise', durationMins: 45, isPreview: true },
            { title: 'IPv4 Variable Length Subnet Masking (VLSM) Mastery', durationMins: 60, isPreview: true },
            { title: 'IPv6 Global Unicast & Link-Local Address Configurations', durationMins: 50 },
          ],
        },
        {
          title: 'Module 2: Cisco Switching, VLANs & Trunking (802.1Q)',
          lessons: [
            { title: 'Layer 2 Switching Concepts & Frame Forwarding', durationMins: 40 },
            { title: 'VLAN Segmentation, Access & 802.1Q Trunk Ports', durationMins: 55 },
            { title: 'Spanning Tree Protocol (STP) & Rapid STP (802.1w)', durationMins: 65 },
          ],
        },
        {
          title: 'Module 3: IP Routing Technologies & OSPF Protocol',
          lessons: [
            { title: 'Static Routing, Floating Routes & Administrative Distance', durationMins: 50 },
            { title: 'Single-Area and Multi-Area OSPF Configuration & Verification', durationMins: 75 },
          ],
        },
      ],
      faqs: [
        { question: 'Will I get access to real lab hardware?', answer: 'Yes! BITS provides direct access to real Cisco 2960 switches and 2911 series routers, supplemented with Eve-NG and Packet Tracer.' },
        { question: 'Does BITS provide certificate upon completion?', answer: 'Yes, every graduate receives an internationally verifiable BITS Institute Certificate with unique verification QR and registration code.' },
      ],
      batches: [
        {
          code: '001',
          name: 'CCNA — Batch 001 (Evening)',
          capacity: 25,
          mode: 'HYBRID' as const,
          shift: 'Evening',
          scheduleNote: 'Mon & Wed: 6:30 PM – 9:00 PM',
          startDate: new Date(Date.now() + 7 * 86400000), // in 7 days
          instructorId: instructorIds['ahmed.khan@bits.edu.pk'],
        },
        {
          code: '002',
          name: 'CCNA — Batch 002 (Weekend)',
          capacity: 30,
          mode: 'ONLINE' as const,
          shift: 'Weekend',
          scheduleNote: 'Sat & Sun: 3:00 PM – 6:00 PM',
          startDate: new Date(Date.now() + 14 * 86400000), // in 14 days
          instructorId: instructorIds['ahmed.khan@bits.edu.pk'],
        },
      ],
    },
    {
      title: 'Certified Ethical Hacker & Offensive Security',
      slug: 'ethical-hacking-offensive-security',
      shortDescription: 'Comprehensive hands-on cyber defense, penetration testing, Kali Linux tools, network exploitation, and vulnerability assessment.',
      description: 'Step into the realm of professional cybersecurity and ethical hacking. This intensive curriculum takes you through footprinting, active network reconnaissance, buffer overflow concepts, web application penetration testing (OWASP Top 10), Metasploit exploitation, privilege escalation in Windows/Linux environments, and wireless security defense.',
      categoryId: cyber.id,
      durationLabel: '4 Months (Hands-on Labs)',
      durationHours: 120,
      level: 'INTERMEDIATE' as const,
      priceMinor: 4800000, // PKR 48,000
      currency: 'PKR',
      certificateCode: 'CEH',
      defaultInstructorId: instructorIds['dr.farhan@bits.edu.pk'],
      status: 'PUBLISHED' as const,
      seoTitle: 'Ethical Hacking & Cyber Security Course — BITS Institute',
      seoDescription: 'Learn Ethical Hacking, Penetration Testing & Defensive Security from industry OSCP & CEH certified specialists at BITS Institute.',
      requirements: ['Basic understanding of networking (TCP/IP, ports)', 'Familiarity with basic command line operations'],
      outcomes: [
        'Conduct legal penetration tests and security assessments',
        'Master Kali Linux tools: Nmap, Wireshark, Burp Suite, Metasploit',
        'Identify and exploit OWASP Top 10 web vulnerabilities',
        'Produce comprehensive professional security assessment reports',
      ],
      modules: [
        {
          title: 'Module 1: Information Gathering & Reconnaissance',
          lessons: [
            { title: 'Passive OSINT & Intelligence Gathering Techniques', durationMins: 50, isPreview: true },
            { title: 'Active Port Scanning & Banner Grabbing with Nmap', durationMins: 60, isPreview: true },
          ],
        },
        {
          title: 'Module 2: Web Application Security & OWASP Top 10',
          lessons: [
            { title: 'SQL Injection: Union, Error-Based & Blind Injection Labs', durationMins: 80 },
            { title: 'Cross-Site Scripting (XSS) & CSRF Vulnerability Testing', durationMins: 70 },
          ],
        },
      ],
      faqs: [
        { question: 'Is ethical hacking legal to practice?', answer: 'Yes! All laboratory sessions take place in isolated virtual target ranges, HackTheBox/TryHackMe environments, and student sandbox labs.' },
      ],
      batches: [
        {
          code: '001',
          name: 'CyberSec — Batch 001 (Evening)',
          capacity: 20,
          mode: 'ONLINE' as const,
          shift: 'Evening',
          scheduleNote: 'Tue & Thu: 7:00 PM – 9:30 PM',
          startDate: new Date(Date.now() + 5 * 86400000),
          instructorId: instructorIds['dr.farhan@bits.edu.pk'],
        },
      ],
    },
    {
      title: 'Full-Stack Web Development with React, Next.js & Node.js',
      slug: 'full-stack-web-development',
      shortDescription: 'Build modern, high-performance web applications using TypeScript, React 19, Next.js App Router, Tailwind CSS, PostgreSQL, and Prisma.',
      description: 'A career-transforming web engineering bootcamp designed to take you from fundamentals to deploying production-ready full-stack SaaS applications. Learn clean architectural patterns, REST & GraphQL APIs, authentication & authorization, relational database design with Prisma and PostgreSQL, cloud deployment on Vercel and AWS, and Docker containerization.',
      categoryId: web.id,
      durationLabel: '4 Months (Project-Based)',
      durationHours: 120,
      level: 'BEGINNER' as const,
      priceMinor: 4200000, // PKR 42,000
      currency: 'PKR',
      certificateCode: 'FSWD',
      defaultInstructorId: instructorIds['sara.malik@bits.edu.pk'],
      status: 'PUBLISHED' as const,
      seoTitle: 'Full-Stack Web Development Course in Pakistan — BITS Institute',
      seoDescription: 'Become a full-stack software engineer with modern Next.js, TypeScript, PostgreSQL, and Node.js at BITS Institute.',
      requirements: ['Basic computer knowledge', 'No prior programming experience required'],
      outcomes: [
        'Build and deploy commercial full-stack web applications',
        'Master React, Next.js App Router, Server Actions, and Tailwind CSS',
        'Design robust relational databases using PostgreSQL & Prisma ORM',
        'Implement production JWT auth, Stripe payments, and RESTful APIs',
      ],
      modules: [
        {
          title: 'Module 1: Modern JavaScript & TypeScript Foundations',
          lessons: [
            { title: 'ESNext Features: Destructuring, Promises, Async/Await', durationMins: 55, isPreview: true },
            { title: 'TypeScript Fundamentals: Types, Interfaces, Generics', durationMins: 65, isPreview: true },
          ],
        },
        {
          title: 'Module 2: Next.js 15 & Server Components Architecture',
          lessons: [
            { title: 'App Router, Layouts, Server Components vs Client Components', durationMins: 75 },
            { title: 'Data Fetching, Caching, Revalidation & Server Actions', durationMins: 80 },
          ],
        },
      ],
      faqs: [
        { question: 'Will I build real portfolio projects?', answer: 'Yes, you will construct 4 complete production web projects, including an E-Commerce store and an LMS platform.' },
      ],
      batches: [
        {
          code: '001',
          name: 'WebDev — Batch 001 (Weekend)',
          capacity: 25,
          mode: 'HYBRID' as const,
          shift: 'Weekend',
          scheduleNote: 'Sat & Sun: 11:00 AM – 2:00 PM',
          startDate: new Date(Date.now() + 10 * 86400000),
          instructorId: instructorIds['sara.malik@bits.edu.pk'],
        },
      ],
    },
    {
      title: 'Artificial Intelligence & Machine Learning with Python',
      slug: 'ai-machine-learning-python',
      shortDescription: 'Master applied Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and generative AI with PyTorch & HuggingFace.',
      description: 'Prepare for the future of technological transformation. This course equips students with practical tools and mathematical foundations needed to build intelligent applications. Covers NumPy, Pandas, Scikit-Learn, neural networks with PyTorch, Transformer models, LLM fine-tuning, Retrieval-Augmented Generation (RAG), and deploying AI models to production APIs.',
      categoryId: ai.id,
      durationLabel: '4 Months (Intensive)',
      durationHours: 110,
      level: 'INTERMEDIATE' as const,
      priceMinor: 4500000,
      currency: 'PKR',
      certificateCode: 'AIML',
      defaultInstructorId: instructorIds['dr.farhan@bits.edu.pk'],
      status: 'PUBLISHED' as const,
      seoTitle: 'AI & Machine Learning Course — BITS Institute',
      seoDescription: 'Master Python, PyTorch, Deep Learning, and Generative AI at BITS Institute with industry experts.',
      requirements: ['Basic Python programming or prior coding background', 'Fundamental high school mathematics'],
      outcomes: [
        'Build supervised and unsupervised machine learning models',
        'Train Deep Neural Networks and Convolutional Networks in PyTorch',
        'Build custom LLM agents and RAG search systems using LangChain',
        'Deploy production inference endpoints using FastAPI & Docker',
      ],
      modules: [
        {
          title: 'Module 1: Data Analysis & Scientific Computing',
          lessons: [
            { title: 'Vectorized computing with NumPy & matrix algebra', durationMins: 50, isPreview: true },
            { title: 'Data Cleaning, Exploration & Feature Engineering with Pandas', durationMins: 70 },
          ],
        },
      ],
      faqs: [
        { question: 'Do I need a powerful GPU to take this course?', answer: 'No! We provide setup guidance for Google Colab Pro and cloud instances so your personal machine hardware will not be a barrier.' },
      ],
      batches: [
        {
          code: '001',
          name: 'AIML — Batch 001 (Evening)',
          capacity: 25,
          mode: 'ONLINE' as const,
          shift: 'Evening',
          scheduleNote: 'Mon & Thu: 7:00 PM – 9:30 PM',
          startDate: new Date(Date.now() + 12 * 86400000),
          instructorId: instructorIds['dr.farhan@bits.edu.pk'],
        },
      ],
    },
  ];

  for (const c of courses) {
    const { modules, faqs, batches, ...courseData } = c;
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      const course = await prisma.course.create({
        data: {
          ...courseData,
          modules: {
            create: modules.map((m, mIdx) => ({
              title: m.title,
              sortOrder: mIdx,
              lessons: {
                create: m.lessons.map((l, lIdx) => ({
                  title: l.title,
                  durationMins: l.durationMins,
                  isPreview: l.isPreview ?? false,
                  sortOrder: lIdx,
                })),
              },
            })),
          },
          faqs: {
            create: faqs.map((f, fIdx) => ({
              question: f.question,
              answer: f.answer,
              sortOrder: fIdx,
            })),
          },
        },
      });

      for (const b of batches) {
        await prisma.batch.create({
          data: {
            courseId: course.id,
            code: b.code,
            name: b.name,
            capacity: b.capacity,
            mode: b.mode,
            shift: b.shift,
            scheduleNote: b.scheduleNote,
            startDate: b.startDate,
            status: 'UPCOMING',
            instructors: {
              create: [{ instructorId: b.instructorId, role: 'LEAD' }],
            },
          },
        });
      }
      console.log(`Created course: ${course.title} with batches`);
    } else {
      console.log(`Course exists: ${c.title}`);
    }
  }

  // 3. Create Sample Blog Posts
  const blogCategory = await prisma.blogCategory.findFirst({ where: { slug: 'cyber-security' } });
  if (blogCategory) {
    const samplePost = await prisma.blogPost.findUnique({ where: { slug: 'top-5-cybersecurity-trends-2026' } });
    if (!samplePost) {
      await prisma.blogPost.create({
        data: {
          title: 'Top 5 Cybersecurity Threats & Defense Strategies in 2026',
          slug: 'top-5-cybersecurity-trends-2026',
          excerpt: 'An in-depth analysis of emerging AI-augmented cyber threats, ransomware evolution, zero-trust architectures, and what modern security teams must do.',
          content: {
            type: 'doc',
            paragraphs: [
              'As cloud infrastructure expands and autonomous cyber offense tools enter the threat landscape, modern technology institutes and enterprise teams must fundamentally shift from reactive patching to continuous zero-trust validation.',
              'In this article, our cybersecurity faculty breaks down the critical vulnerability trends observed in enterprise environments and the essential skills demanded by global SOC operations.',
            ],
          },
          categoryId: blogCategory.id,
          authorId: instructorIds['dr.farhan@bits.edu.pk'],
          featured: true,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          seoTitle: 'Top 5 Cybersecurity Threats & Defense Strategies in 2026 — BITS',
          metaDescription: 'Discover the top cybersecurity threat vectors and defensive architectures in 2026 from the security faculty at BITS Institute.',
        },
      });
      console.log('Created sample blog post');
    }
  }

  // 4. Create Sample Verifiable Certificate
  const studentUser = await prisma.user.findFirst({ where: { email: { contains: 'student' } } });
  const sampleCourse = await prisma.course.findFirst({ where: { slug: 'ccna-enterprise-networking' } });
  if (studentUser && sampleCourse) {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentUser.id } });
    if (studentProfile) {
      const existingCert = await prisma.certificate.findUnique({ where: { code: 'BITS-CCNA-2026-00482' } });
      if (!existingCert) {
        await prisma.certificate.create({
          data: {
            code: 'BITS-CCNA-2026-00482',
            studentId: studentProfile.id,
            courseId: sampleCourse.id,
            grade: 'A+ (Distinction)',
            status: 'VALID',
            issuedAt: new Date('2026-03-15'),
          },
        });
        console.log('Created sample verifiable certificate: BITS-CCNA-2026-00482');
      }
    }
  }

  console.log('Catalog and demo data seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
