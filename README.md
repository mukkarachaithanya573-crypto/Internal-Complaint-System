# CampusFix: Centralized Facility Maintenance & Grievance Redressal System

A production-grade, cross-platform Computer-Aided Facility Management (CAFM) and grievance redressal platform engineered for university campuses. Accessible across desktop browsers, tablets, and mobile devices (with offline-first caching for Wi-Fi dead zones).

---

## 🚀 Live Application Access

The full-stack application server is running locally:
- **Web App & Admin Console:** [http://localhost:5000](http://localhost:5000)
- **REST API Base URL:** [http://localhost:5000/api](http://localhost:5000/api)

To restart the application manually:
```bash
# Production server (API + built frontend)
node server.js

# Or development server with hot-reload
npm run dev
```

---

## 👥 Three User Roles & Workflows

Switch between the three personas anytime using the top-bar role selector:

### 1. Reporter (Student / Faculty / Staff)
- **Submit Complaints:**
  - Cascading location selector: `Building` $\to$ `Floor` $\to$ `Room / Space`.
  - **"Scan Room QR"** button to simulate physical door/desk QR sticker scans that auto-fill location data.
  - 6 Facility categories with visual badges: `Electrical`, `Plumbing`, `IT & AV Systems`, `Housekeeping`, `Civil & Furniture`, `Safety & HVAC`.
  - Urgency level selector with response targets (`Low <72h`, `Medium <24h`, `High <6h`, `Emergency <2h`).
  - Title, description, and optional photo attachment with live thumbnail preview.
- **"My Complaints" Tracker:**
  - Live card list with status indicators and search/filter.
  - Full lifecycle step timeline: `SUBMITTED` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `RESOLVED` $\to$ `CLOSED` / `REOPENED`.
  - Direct technician contact link and SLA target display.
- **Post-Resolution Feedback & Reopen Flow:**
  - When an issue reaches `RESOLVED`, the reporter can:
    - **Path A ("Yes, it's fixed!"):** 1–5 star rating, feedback tag chips, and thank-you comments (closes ticket and awards CSAT points).
    - **Path B ("No, still broken"):** Mandatory reopen reason dropdown, explanation, and photo attachment (reopens ticket, bumps priority to `HIGH`, escalates to supervisor, and logs an FTFR penalty).
- **Offline Mode Simulation:**
  - Tap the **Online / Offline** toggle in the top bar to simulate entering a basement or dead zone.
  - Complaints submitted while offline are saved to the local outbox. When the network is restored, the system auto-flushes the queue and notifies the user.

---

### 2. Maintenance Staff (Technicians)
- Dedicated technician profile view (e.g., *Rajesh Kumar - Electrical*, *Suresh Verma - Plumbing*).
- Live performance scorecard: **CSAT Rating (★ 4.8 / 5.0)**, **First-Time Fix Rate (94%)**, and active work orders.
- Work Order Queue:
  - Tap **"Start Work On-Site"** $\to$ transitions state to `IN_PROGRESS`.
  - Tap **"Mark as Resolved"** $\to$ opens a modal to enter resolution notes, attach after-repair proof, and submit for reporter verification.
  - Handle **"Re-Inspect & Rework"** if a ticket was reopened by the reporter.

---

### 3. Admin & Facility Manager (Analytics Dashboard)
- **KPI Metrics:** Total complaints, Mean Time to Repair (MTTR), SLA compliance rate, and critical emergency backlogs.
- **Category $\times$ Location Heatmap:** Cross-tabulated matrix showing incident concentration across buildings with color-coded intensity.
- **MTTR by Department:** Average resolution duration vs. SLA benchmarks with warning alerts for lagging trades.
- **Recurring Problem Hotspots & Root-Cause Analysis:** Flagged equipment with failure frequency (e.g., *"AC-304 failed 6 times in 60 days"*), engineering diagnosis, and warranty replacement recommendations.
- **Staff Workload & Capacity Roster:** Live staffing matrix displaying active work orders, monthly resolutions, duty status, and CSAT scores.
- **SLA Breach Simulator:** A dedicated button to simulate an overdue 48-hour SLA breach on any active ticket, demonstrating automated priority escalation to `EMERGENCY` and simulated SMS/Push alerts to the Campus Estate Registrar.

---

## 🗄️ Database Architecture & DDL

The complete relational PostgreSQL schema is provided in [`schema.sql`](file:///home/m-chaithanya-yadav/Pictures/Hostel%20Management%20system/schema.sql):
- **Core Entities:** `departments`, `users`, `locations`, `complaints`, `complaint_media`, `complaint_timeline`, `feedbacks`, `staff_performance_metrics`.
- **Enums:** `user_role`, `user_type`, `complaint_status`, `complaint_priority`, `media_type`.
- **Optimized Indexes:** Composite indexes on `(status, priority)`, `location_id`, and `qr_code_hash`.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations` | Fetch hierarchical building/floor/room campus tree |
| `GET` | `/api/locations/qr/:hash` | Resolve physical QR code sticker to location details |
| `GET` | `/api/complaints` | Fetch complaints with optional `?status=&category=` filters |
| `POST` | `/api/complaints` | Create a new complaint with auto-routing to least-loaded staff |
| `PATCH` | `/api/complaints/:id/status` | Advance lifecycle state (`IN_PROGRESS`, `RESOLVED`, `CLOSED`) |
| `POST` | `/api/complaints/:id/feedback` | Submit 1–5 star rating and tag chips (updates staff CSAT) |
| `POST` | `/api/complaints/:id/reopen` | Reopen ticket with reason (escalates priority to `HIGH` & penalizes FTFR) |
| `GET` | `/api/staff` | Retrieve technician roster with active loads and metrics |
| `GET` | `/api/analytics` | Retrieve KPI metrics, incident heatmap, and notification logs |
| `POST` | `/api/simulate-sla-breach` | Trigger simulated 48h SLA breach and multi-tier escalation |
