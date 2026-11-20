# LeadFlow — Full-Stack Lead Management Application

> **Meru Technosoft Pvt. Ltd. — Full Stack Developer Screening Assignment**  
> Built by **Om Sawant**

A modern, responsive, full-stack **Lead Manager** web application designed for sales representatives to capture, organize, search, filter, and track leads through their sales pipeline.

---

## 📑 Table of Contents
1. [Features Checklist](#-features-checklist)
2. [Tech Stack & Decisions](#-tech-stack--decisions)
3. [Architecture Overview](#-architecture-overview)
4. [Quick Start (Run Locally)](#-quick-start-run-locally)
5. [Demo Account](#-demo-account-for-evaluators)
6. [API Documentation](#-api-documentation)
7. [Automated Testing](#-automated-testing)
8. [Assumptions Made](#-assumptions-made)
9. [Future Improvements](#-what-i-would-improve-with-more-time)
10. [Submission Note (Proud Of / Tricky Parts)](#-screening-submission-notes)

---

## ✨ Features Checklist

### Core Features (Required) — 100% Implemented
- [x] **Add a Lead**: Capture `name`, `email`, `phone`, `company`, `source` (dropdown), `status` (New / Contacted / Qualified / Lost), and optional `notes`.
- [x] **List Leads in Table**: Clear status badges with semantic colors (Blue for New, Amber for Contacted, Emerald for Qualified, Rose for Lost).
- [x] **Edit a Lead**: Full edit modal to modify lead details + inline quick status dropdown directly from the table.
- [x] **Delete a Lead**: Safe two-step deletion with a confirmation modal showing the lead's name and details.
- [x] **Search & Filter**:
  - Full-text search across `name`, `email`, `company`, and `phone` with input debouncing.
  - Dropdown filter by **Status** (`All`, `New`, `Contacted`, `Qualified`, `Lost`).
  - Dropdown filter by **Source** (`Website`, `Referral`, `Cold Outreach`, `LinkedIn`, `Advertisement`, `Event`, `Other`).
- [x] **Input Validation (Frontend & Backend)**:
  - **Frontend**: Real-time validation checks for required fields, valid email format regex, phone length/pattern.
  - **Backend**: Strict schema validation powered by **Zod**, returning structured 400 error arrays.

### Bonus Features (Optional) — 100% Implemented
- [x] **Authentication (JWT + Scoped Ownership)**:
  - Full signup & login flow with secure password hashing (`bcryptjs`) and signed JWT tokens.
  - **Tenant Isolation**: Each user can only view, create, edit, or delete their own leads.
  - **1-Click Demo Login**: Pre-seeded account (`demo@example.com` / `password123`) so evaluators can test immediately without typing.
- [x] **Interactive Dashboard KPI Counts**:
  - Live summary cards: **Total Leads**, **New**, **Contacted**, **Qualified**, and **Lost** with count and percentage share.
  - **Interactive Cards**: Clicking any status KPI card automatically filters the leads table by that status.
- [x] **Sorting & Pagination**:
  - Sortable table columns (`Name`, `Company`, `Status`, `Added Date`) with ascending/descending toggle indicators.
  - Pagination controls with configurable page sizes (5, 10, 25, 50 rows per page).
- [x] **Automated API Testing**:
  - 22 automated integration tests using **Jest** and **Supertest** covering Auth, Leads CRUD, validation rules, and tenant security.
- [x] **Toast Notification Feedback**:
  - Real-time success and error toasts for all user actions (create, edit, delete, status change).

---

## 🛠 Tech Stack & Decisions

| Layer | Technology | Why This Choice? |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | Blazing fast HMR, type safety, component-driven UI. |
| **Styling** | Tailwind CSS + Lucide Icons | Clean, utility-first modern design system with zero bloated CSS runtime. |
| **Backend** | Node.js + Express + TypeScript | Lightweight, scalable REST API architecture matching Meru Technosoft's primary stack. |
| **Database** | SQLite + Prisma ORM | Zero-friction local setup (no external PostgreSQL or Docker installation required to run), migrations, and fully type-safe queries. Easily switchable to PostgreSQL by updating `DATABASE_URL`. |
| **Validation** | Zod | Robust, composable runtime validation on both API requests and data boundaries. |
| **Auth** | JWT + bcryptjs | Stateless, industry-standard Bearer token authentication. |
| **Testing** | Jest + Supertest | Comprehensive end-to-end HTTP integration testing for API endpoints. |

---

## 🏛 Architecture Overview

```
meru-lead-manager/
├── client/                     # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx             # Brand header, profile info, quick actions
│   │   │   ├── StatsDashboard.tsx     # KPI summary cards (clickable filters)
│   │   │   ├── FilterBar.tsx          # Search input & status/source filters
│   │   │   ├── LeadTable.tsx          # Responsive table with status badges & sorting
│   │   │   ├── Pagination.tsx         # Page navigation and limit selector
│   │   │   ├── LeadModal.tsx          # Add & Edit lead modal with validation
│   │   │   ├── DeleteConfirmModal.tsx # Confirmation modal before deleting
│   │   │   ├── AuthView.tsx           # Login / Register with 1-click Demo button
│   │   │   └── Toast.tsx              # Dynamic feedback notifications
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Authentication provider & token management
│   │   ├── services/
│   │   │   └── api.ts                 # Axios client with JWT interceptors
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript interfaces
│   │   ├── App.tsx                    # Main dashboard orchestration
│   │   └── main.tsx                   # React root entry point
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
│   │   └── server.ts                  # HTTP server entry point
├── package.json                # Root package with monorepo npm scripts
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v18 or later (Tested on Node v20 / v26)
- **npm**: v9 or later

### 1. Clone & Install
```bash
git clone <YOUR_GIT_REPO_URL>
cd Interview
npm run setup
```
> `npm run setup` automatically installs all client and server dependencies, pushes the database schema, and seeds sample demo data!

### 2. Start Development Servers
```bash
npm run dev
```
This runs both the backend API (`http://localhost:5050`) and the Vite frontend (`http://localhost:5173`) concurrently.

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 👤 Demo Account for Evaluators

For convenience, a demo account is pre-configured and pre-seeded with 8 sample leads across all status pipelines:

- **Email**: `demo@example.com`
- **Password**: `password123`

You can also simply click the **"Explore Demo Account"** button on the login screen to jump directly into the app with a single click.

---

## 📡 API Documentation

Base URL: `http://localhost:5050/api`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes (`Bearer <token>`) |

### Leads Endpoints (All require `Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | List leads (supports query params: `search`, `status`, `source`, `page`, `limit`, `sortBy`, `sortOrder`) |
| `GET` | `/api/leads/stats` | Returns total leads and counts by status |
| `GET` | `/api/leads/:id` | Get details for a single lead |
| `POST` | `/api/leads` | Create a new lead |
| `PUT` | `/api/leads/:id` | Update lead details or status |
| `DELETE` | `/api/leads/:id` | Delete a lead |

#### Sample Request: `POST /api/leads`
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@cyberdyne.io",
  "phone": "+1 (555) 234-5678",
  "company": "Cyberdyne Systems",
  "source": "Website",
  "status": "Qualified",
  "notes": "Enterprise security requirements discussion."
}
```

#### Sample Response: `201 Created`
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "cmwolfn4n000e13j4z31ly3gz",
    "userId": "cmwolfn4g000013j4mocwoauk",
    "name": "Sarah Connor",
    "email": "sarah.connor@cyberdyne.io",
    "phone": "+1 (555) 234-5678",
    "company": "Cyberdyne Systems",
    "source": "Website",
    "status": "Qualified",
    "notes": "Enterprise security requirements discussion.",
    "createdAt": "2026-11-20T06:23:54.840Z",
    "updatedAt": "2026-11-20T06:23:54.840Z"
  }
}
```

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite with **22 passing tests**:

```bash
npm test
```

### Test Coverage Highlights:
- **Auth**: User registration, duplicate email rejection (409), bad password rejection (401), invalid schema formats (400), token validation.
- **Leads CRUD**: Creating leads with defaults, field validation, reading leads with pagination and search.
- **Tenant Isolation**: Verifying that User A cannot read, update, or delete User B's leads.
- **Stats**: Aggregating status metrics correctly.

---

## 💡 Assumptions Made

1. **Lead Uniqueness**: A single user might manage contacts with similar names across different organizations, so emails are not constrained to be globally unique across different users, but are unique within a company context.
2. **Lead Ownership**: Leads belong strictly to the user who created them (multi-tenant model). An organization/team-sharing role (e.g. Sales Manager vs. Sales Rep) can easily be layered on top via role-based access control (RBAC).
3. **Database Choice**: SQLite was chosen for local development to guarantee **zero setup friction** (evaluators do not need to install or configure PostgreSQL or Docker). Because Prisma is used, migrating to PostgreSQL or MySQL requires only changing the `provider = "postgresql"` line in `schema.prisma`.

---

## 🔮 What I Would Improve With More Time

1. **Activity Timeline / Notes History**: Add an audit trail showing when a lead changed status (e.g., from `New` to `Contacted`) and logged interaction timestamps.
2. **CSV Export / Import**: Allow sales reps to export filtered lead lists to CSV or import bulk leads from external spreadsheets.
3. **Email Integration / Notifications**: Send follow-up reminder emails or trigger automated alerts when a lead remains in `New` status for more than 48 hours.
4. **Kanban Board View**: Add a drag-and-drop Kanban view alongside the table view for visualizing the sales funnel intuitively.
5. **Role-Based Access Control (RBAC)**: Support team workspaces with Admin, Manager, and Member permissions.

---

## 📝 Screening Submission Notes

- **What I am particularly proud of**:
  - The balance between robust architecture and developer experience. The entire project runs with a single `npm run setup && npm run dev` command without needing Docker or manual DB configuration.
  - The UX touches: interactive KPI dashboard cards that filter the table on click, debounced search, optimistic status updates, and a 1-click evaluator demo login.
  - Complete test coverage (22/22 tests passing) validating both business logic and security boundaries.

- **What I found tricky**:
  - Handling port conflicts on macOS (where AirPlay Receiver occupies port 5000 by default), which required cleanly configuring port 5050 across client proxy and server configurations.
  - Ensuring tenant isolation so that query filters, stats aggregations, and search operations never leak leads between different users.
