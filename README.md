# LeadFlow — Modern Full-Stack Lead Management CRM

> **Meru Technosoft Pvt. Ltd. — Full Stack Developer Screening Assignment**  
> Built by **Om Sawant**

A production-grade, highly-responsive, full-stack **Lead Manager CRM** designed for modern sales teams to capture, organize, search, filter, and track leads through their sales pipeline with real-time analytics.

---

## 📑 Table of Contents
1. [Assignment Requirements Checklist](#-assignment-requirements-checklist)
2. [Tech Stack & Architecture Decisions](#-tech-stack--architecture-decisions)
3. [Architecture Overview](#-architecture-overview)
4. [Quick Start (Run Locally)](#-quick-start-run-locally)
5. [Evaluator Demo Account](#-evaluator-demo-account)
6. [API Documentation](#-api-documentation)
7. [Automated Testing (22/22 Passing)](#-automated-testing-2222-passing)
8. [Assumptions Made](#-assumptions-made)
9. [What I Would Improve With More Time](#-what-i-would-improve-with-more-time)
10. [Submission Notes (Proud Of / Tricky Parts)](#-submission-notes-for-evaluation)

---

## ✨ Assignment Requirements Checklist

### 1. Core Features (Required by PDF) — 100% Implemented
- [x] **Add a Lead**:
  - Full details: `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New` / `Contacted` / `Qualified` / `Lost`) + optional `notes`.
- [x] **List Leads in Table**:
  - Clear, colorful status badges with pulsing indicators (`New`, `Contacted`, `Qualified`, `Lost`).
  - Contact initials avatar with dynamic color gradients.
  - Formatted dates, clickable phone/email links, and company tag.
- [x] **Edit a Lead & Update Status**:
  - Full edit modal with pre-populated form fields and real-time validation.
  - Inline quick-status dropdown inside the table for instant 1-click status change.
  - Stage advance buttons inside the Kanban board and Dossier drawer.
- [x] **Delete a Lead (with confirmation step)**:
  - Accessible two-step confirmation modal detailing lead name and company before permanent removal.
- [x] **Search / Filter Leads**:
  - Debounced real-time search across `name`, `email`, `company`, and `phone` (with MongoDB regex search).
  - Filter by **Status** (`All`, `New`, `Contacted`, `Qualified`, `Lost`).
  - Filter by **Source** (`All`, `Website`, `Referral`, `Cold Outreach`, `LinkedIn`, `Advertisement`, `Event`, `Other`).
  - 1-click status isolation directly from KPI sparkline cards.
- [x] **Input Validation (Frontend & Backend)**:
  - **Frontend**: Live error states for required name (min 2 chars), email format regex (`user@example.com`), and phone limits.
  - **Backend**: Strict schema enforcement with **Zod**, returning structured `400 Bad Request` validation error payloads.

---

### 2. Bonus Features (All Implemented)
- [x] **Simple Authentication (Signup / Login / Me)**:
  - Stateless JWT token auth with `bcryptjs` password hashing (salt rounds: 10).
  - **Multi-Tenant Scoped Ownership**: Users only see, edit, and delete their own leads.
  - **1-Click Demo Login**: Pre-seeded `demo@example.com` / `password123` with a single click.
- [x] **Pagination & Sorting on Leads Table**:
  - Server-side pagination with configurable limits (5, 10, 25, 50 per page).
  - Sortable columns (`name`, `company`, `status`, `createdAt`) with ascending/descending toggle.
- [x] **Small Dashboard Count (Leads per Status + Conversion Analytics)**:
  - `/api/leads/stats` endpoint aggregating counts for `total`, `New`, `Contacted`, `Qualified`, and `Lost`.
  - 4 interactive Bento sparkline KPI cards with percentage shares and glow effects.
  - Visual chevron pipeline velocity funnel + SVG stage distribution donut chart.
- [x] **Dual-View Experience (Table + Kanban Pipeline Board)**:
  - 1-click switch between **Table View** and **Kanban Pipeline Board** with 4 stage columns and 1-click stage advancement.
- [x] **Slide-Over Lead Dossier Drawer**:
  - Smooth 500ms cubic-bezier slide-in drawer displaying complete contact dossiers, copy-to-clipboard buttons, stage progression stepper, and audit history.
- [x] **Export to CSV**:
  - 1-click client-side CSV export of filtered leads for spreadsheet reporting.
- [x] **Theme Customization (Dark & Light Modes)**:
  - Full theme switcher with persistence in `localStorage` and tailored color palettes.
- [x] **Automated API Integration Tests**:
  - **22/22 automated tests passing** (`npm test`) using Jest and Supertest covering Auth, Leads CRUD, validation rules, search, pagination, and multi-tenant security isolation.

---

## 🛠 Tech Stack & Architecture Decisions

| Layer | Technology | Decision Rational |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | High developer velocity, type-safe props, component-driven UI. |
| **Styling** | Tailwind CSS + Lucide Icons | Clean modern design system with floating island bento cards, zero CSS runtime overhead. |
| **Typography** | Plus Jakarta Sans | High-end geometric sans with optical letter-spacing, subpixel antialiasing, and tabular numerals. |
| **Backend** | Node.js + Express + TypeScript | Lightweight, clean REST API architecture conforming to Meru Technosoft's stack. |
| **Database** | MongoDB Atlas + Prisma ORM | Cloud-hosted NoSQL cluster, schema migrations, and fully type-safe queries. |
| **Validation** | Zod | Composable runtime schema validation preventing malformed requests. |
| **Auth** | JWT + bcryptjs | Stateless, industry-standard Bearer token security. |
| **Testing** | Jest + Supertest | Comprehensive end-to-end HTTP integration testing for API endpoints. |

---

## 🏛 Architecture Overview

```
Interview/
├── client/                     # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.tsx            # Floating rounded island navigation with Atlas status
│   │   │   ├── Header.tsx             # Command search (⌘K), date pill, theme toggle, + Capture Lead
│   │   │   ├── GreetingHero.tsx       # User greeting, pipeline summary, time range filters
│   │   │   ├── KPISparklineCards.tsx  # 4 Bento metric cards with glowing SVG sparklines
│   │   │   ├── PipelineHealthAndDonut.tsx # Chevron velocity funnel & SVG donut chart
│   │   │   ├── FilterBar.tsx          # Real-time search, status dropdown, source dropdown
│   │   │   ├── LeadTable.tsx          # Sub-tabs, row checkboxes, gradient avatars, custom pills
│   │   │   ├── KanbanBoard.tsx        # 4-stage pipeline board with stage advancement
│   │   │   ├── LeadDrawer.tsx         # 620px slide-over dossier with cubic-bezier animation
│   │   │   ├── Pagination.tsx         # Page controls and page size selector
│   │   │   ├── LeadModal.tsx          # Create & edit lead modal with validation
│   │   │   ├── DeleteConfirmModal.tsx # Safe two-step deletion confirmation
│   │   │   ├── AuthView.tsx           # Login / Register with 1-click Demo button
│   │   │   └── Toast.tsx              # Feedback toast notifications
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Auth state, token storage, demo login
│   │   │   └── ThemeContext.tsx       # Dark & Light mode toggle
│   │   ├── services/
│   │   │   └── api.ts                 # Axios client with JWT interceptors
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript models and interfaces
│   │   ├── App.tsx                    # Main layout orchestration
│   │   └── main.tsx                   # React root entry point
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Node.js + Express + Prisma Backend
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema (User & Lead models)
│   │   └── seed.ts                    # Demo user and 8 realistic leads
│   ├── src/
│   │   ├── controllers/               # Business logic (auth & leads)
│   │   ├── middleware/                # JWT auth guard & centralized error handler
│   │   ├── routes/                    # Express REST route definitions
│   │   ├── validators/                # Zod schemas for request validation
│   │   ├── tests/                     # Jest + Supertest integration tests
│   │   ├── prisma.ts                  # PrismaClient singleton
│   │   ├── app.ts                     # Express app setup & middleware
│   │   └── server.ts                  # HTTP server entry point (Port 5050)
│   ├── jest.config.js
│   └── package.json
├── package.json                # Root package with monorepo npm scripts
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v18 or later (Tested on Node v20 / v22)
- **npm**: v9 or later

### 1. Clone & Setup
```bash
git clone <YOUR_GIT_REPO_URL>
cd Interview
npm run setup
```
> `npm run setup` automatically installs dependencies for both frontend and backend, sets up Prisma client, and seeds sample data into the database!

### 2. Start Development Servers
```bash
npm run dev
```
This starts both servers concurrently:
- **Backend API**: `http://localhost:5050`
- **Frontend App**: `http://localhost:5173`

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 👤 Evaluator Demo Account

To test immediately without manual typing:
- **Email**: `demo@example.com`
- **Password**: `password123`

Or simply click the **"Explore Demo Account"** button on the login screen to sign in with one click.

---

## 📡 API Documentation

Base URL: `http://localhost:5050/api`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (`Bearer <token>`) |

### Leads Endpoints (All require `Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | List leads (query params: `search`, `status`, `source`, `page`, `limit`, `sortBy`, `sortOrder`) |
| `GET` | `/api/leads/stats` | Aggregated lead counts and breakdown by status |
| `GET` | `/api/leads/:id` | Fetch full lead record (owner verified) |
| `POST` | `/api/leads` | Create a new lead (validated with Zod) |
| `PUT` | `/api/leads/:id` | Update lead fields or status (owner verified) |
| `DELETE` | `/api/leads/:id` | Permanently remove a lead (owner verified) |

---

## 🧪 Automated Testing (22/22 Passing)

Run the automated integration test suite:

```bash
npm test
```

### Test Coverage Summary:
- **Authentication**: User registration, duplicate email rejection (409), invalid credentials (401), schema validation (400), protected route guards.
- **Leads CRUD**: Creation with default status/source, missing field rejection, list pagination, status filtering, case-insensitive regex search.
- **Multi-Tenant Isolation**: Rigorous security tests ensuring User A cannot read, update, or delete User B's leads.
- **Stats Aggregation**: Total and per-status counts.

---

## 💡 Assumptions Made

1. **Lead Scoping**: Leads belong strictly to the authenticated user who created them (multi-tenant model). This prevents data leakage and ensures clean boundaries.
2. **Contact Email Re-use Across Organizations**: A user may manage different stakeholders with identical names or work contacts across companies; emails are validated for RFC compliance but not globally locked across unrelated client entities.
3. **macOS Port Allocation**: macOS AirPlay Receiver occupies port 5000 by default; the backend was intentionally configured to port `5050` with Vite reverse proxying to guarantee zero port-binding collisions out-of-the-box.

---

## 🔮 What I Would Improve With More Time

1. **Activity Timeline & Audit Trail**: Granular history tracking for each status transition (e.g. `New` → `Contacted` on Nov 21 by Aarav Sharma).
2. **Bulk CSV Import with Field Mapping**: Allow sales reps to upload CSV files and map columns (`Name`, `Email`, `Company`) directly into the pipeline.
3. **Automated Follow-up Reminders**: Webhook or background job to flag leads that remain in `New` status for more than 48 hours without contact.
4. **Role-Based Access Control (RBAC)**: Team workspace collaboration with Admin, Manager, and Sales Rep permission tiers.

---

## 📝 Submission Notes for Evaluation

- **What I am particularly proud of**:
  - **Executive-Grade UI/UX**: Designed a floating island bento interface with Plus Jakarta Sans typography, dark/light theme toggle, custom SVG sparklines, stage velocity funnel, and an ultra-smooth cubic-bezier dossier drawer.
  - **Full Bonus Implementation**: Built full JWT multi-tenant auth, dual-view Kanban board, CSV export, live MongoDB Atlas cluster connection, and 22 automated integration tests.
  - **Zero-Friction Evaluator DX**: A single `npm run setup && npm run dev` command handles everything, plus a 1-click demo login so evaluators can review all features in seconds.

- **What I found tricky**:
  - **macOS Port 5000 EADDRINUSE Conflict**: AirPlay Receiver listening on port 5000 required cleanly configuring port 5050 across Express, client proxy, and Jest configs.
  - **Remote Database Test Latency**: Running Jest integration tests against a live remote MongoDB Atlas cluster required increasing the batch hook timeout to 25s to avoid intermittent network timeout hiccups.
