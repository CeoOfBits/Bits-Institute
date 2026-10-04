# BITS Institute — Phase 0 Plan

## Discovery
- Workspace `e:\Bits Institute`: empty, so this is a greenfield build.
- Installed: Git 2.56, winget, and Node 24.19 LTS (installed this session).
- Not installed: PostgreSQL and Docker.
- npm runs through `npm.cmd` because PowerShell blocks `npm.ps1`.
- Package manager: pnpm, enabled through corepack, with a monorepo workspace.

## Branding (from the logo)
| Token | Value | Use |
|---|---|---|
| Primary | `#1DA6E8` (bright cyan-blue) | CTAs, links, "BITS" wordmark |
| Light | `#6FCFF6` | Highlights, tints |
| Deep | `#2B2E8F` (indigo) | Headings, dark surfaces |
| Mid | `#0A78C8` | Hover, charts |
| Neutral | `#EEF1F4` / `#0B1020` | Surfaces / dark mode |

- Typography: a bold geometric sans for display (Plus Jakarta Sans) and Inter for body.
- Shape: rounded 12–16px cards, soft shadows, and chevron `»` motifs used sparingly.
- Logo: the supplied wordmark logo is used in the header and footer. The circular mark ([bits-logo-mark.svg](file:///e:/Bits%20Institute/brand/bits-logo-mark.svg)) is used for the favicon, app icon, and portals.

## Monorepo layout
```
apps/web      Next.js 15 (App Router), TS, Tailwind, shadcn/ui
apps/api      NestJS, TS, REST + Swagger
packages/db   Prisma schema, migrations, seed
packages/ui   Shared design tokens (later)
brand/        Logo assets
```

## Core data model (Prisma)
- Identity: User, Role, Permission, Session, LoginActivity, AuditLog
- Catalog: Category, Course, Module, Lesson, CourseFaq
- Delivery: Batch (capacity, mode, schedule, status), BatchInstructor (LEAD/ASSISTANT/GUEST)
- History:
  - CourseEnrollment keeps the student's course history.
  - BatchEnrollment records each batch period, with from and to dates.
  - BatchTransfer records from, to, reason, performer, and date.
  - Nothing is overwritten, and history is append-only.
- Learning: LiveClass, Attendance, Assignment, Submission, Quiz, Question, Attempt, Answer
- Credentials: Certificate (unique ID `BITS-CCNA-2026-00482`, QR, status)
- Engagement: XpEvent, Badge, UserBadge, Streak, Notification
- Business: Payment (provider-agnostic), Invoice, Coupon
- CMS: BlogPost, BlogCategory, Tag, Page, Testimonial, Event, SiteSetting, AdSlot, MediaAsset

Conventions: UUID keys, `createdAt`/`updatedAt`, soft delete on academic entities, and indexes on foreign keys and slugs.

## Provider abstractions
Storage (R2/S3), Video (Stream/Mux/YouTube), LiveClass (Zoom/LiveKit), Payment, and Notification (in-app/email/SMS/WhatsApp/push). Each has an interface and a mock/local driver.

## Roadmap
1. Foundation: monorepo, design system, layout, Prisma schema, auth (JWT access + refresh), RBAC
2. Public site and SEO: home, courses, blog, verify, sitemap, JSON-LD
3. LMS: courses, batches, enrollments, transfers, attendance, quizzes, assignments
4. Admin panel
5. Gamification, certificates, live classes, analytics, payments
6. QA, security, performance, accessibility

## Blockers
- PostgreSQL is not installed. Installing it needs an admin prompt and a password you choose. Alternative: a free managed Postgres (Neon or Supabase) connection string.
- The original logo file isn't on disk, so I need the PNG saved into `brand/` for exact use.
