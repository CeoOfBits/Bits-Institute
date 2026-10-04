# BITS Institute — Production Platform Status

## 1. System Overview
- **Institute:** BITS Institute (Bright Information Technology Solutions)
- **Architecture:** API-First Monorepo with NestJS REST API, Next.js 16 Web & LMS, PostgreSQL 18 with Prisma ORM.
- **Brand Palette:**
  - Primary Cyan: `#1DA6E8`
  - Deep Tech Indigo: `#2B2E8F`
  - Light Accent: `#6FCFF6`
  - Cyber Dark: `#070B18`

---

## 2. Ports & Endpoints
| Service | URL | Status | Description |
|---|---|---|---|
| **Web Application** | `http://localhost:3000` | Ready | Public site, student portal, admin dashboard |
| **Backend REST API** | `http://localhost:4000/api` | **RUNNING** | Core modular REST API |
| **API Documentation**| `http://localhost:4000/api/docs` | **RUNNING** | Swagger / OpenAPI Explorer |
| **PostgreSQL Database**| `localhost:5432/bits_institute`| **LIVE** | 22 Relational Tables, synced |

---

## 3. Administrative Credentials
- **Super Administrator:** `admin@bits.local`
- **Initial Password:** `KfCl2UvgFolj`
- **Faculty Account:** `ahmed.khan@bits.edu.pk` (`Instructor12345!`)
- **Cyber Defense Faculty:** `dr.farhan@bits.edu.pk` (`Instructor12345!`)

---

## 4. Key LMS Features Implemented

### A. Course vs Batch Architecture (Section 6 & 8)
- Permanent educational courses (e.g., CCNA 200-301) can have unlimited batches.
- Every batch tracks:
  - Mode (Online / Offline / Hybrid)
  - Shift (Morning / Evening / Weekend)
  - Start date & schedule
  - Capacity & live seat computation (`FULL`, `1 seat remaining`, etc.)
  - Independent instructors (Lead / Assistant / Guest)
- **Action:** `Create Next Batch` allows duplicating course curricula & schedules without copying students automatically.

### B. Non-Destructive Student Transfer System (Section 9)
- Moving a student from Batch 001 to Batch 002 terminates their active enrollment period (`TRANSFERRED`) and opens a new active enrollment record.
- Complete audit record (`BatchTransfer`) preserves:
  - From Batch
  - To Batch
  - Transfer Reason
  - Admin performer ID
  - Precise timestamp

### C. Live Certificate Verification Engine (Section 19)
- Public verification endpoint at `/api/public/certificates/verify/:code` and `/verify`.
- Verified Sample Credential:
  - Code: `BITS-CCNA-2026-00482`
  - Status: `VERIFIED • DISTINCTION (A+)`
  - Student: Test Student
  - Program: CCNA 200-301 Enterprise Networking

### D. Gamified Learning System (Section 13)
- Real-time XP tracking and level calculation.
- 14-day learning streak tracking.
- Badges: Quiz Master, Fast Learner, Cyber Explorer, Streak Pioneer.
- Automatic XP rewards upon passing quizzes.

### E. Public Institute Web Experience
- `/`: Hero, popular courses, cybersecurity pillars, live verification preview.
- `/courses`: Filterable catalog with category pills.
- `/courses/[slug]`: Course overview, available cohorts, live seats counter, and syllabus.
- `/verify`: Instant certificate validator.
- `/portal`: Gamified student dashboard.
- `/admin`: Management dashboard for courses, batches, capacity, and student transfers.
- `/blog`: Faculty publications and technical insights.
- `/about` & `/contact`: Campus location, lab hours, and admissions inquiries.
