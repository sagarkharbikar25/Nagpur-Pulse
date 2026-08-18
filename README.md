# 🍊 Nagpur Pulse — Civic Intelligence & Municipal Operations Platform

> **Transforming citizen reports into geo-clustered hotspot diagnostics and rapid civil engineering dispatch for the Orange City.**

---

## 📌 Executive Summary

**Nagpur Pulse** is an AI-powered municipal civic intelligence platform engineered specifically for **Nagpur Municipal Corporation (NMC)**. It bridges the gap between citizens, zonal ward officers, and city administrative leadership by automating incident reporting, spatial clustering, and work order dispatch.

Citizens report civic emergencies (potholes, water leaks, storm drainage overflows, streetlight failures, sanitation issues) via live GIS pin mapping, photo evidence upload, or native Marathi/Hindi/English voice-to-text. The **NVIDIA Nemotron AI** engine classifies and prioritizes reports in real-time, triggering automated contractor work orders and spatial hotspot threshold alerts.

---

## 🌟 Core Modules & Architecture

### 1. 👤 Public Citizen Portal (Open Access)
- **Interactive GIS Radar Map (`/home`):** Full-screen dark basalt & satellite map with real-time incident pins, custom civic infrastructure SVG markers, and active hotspot cluster bubbles.
- **AI-Powered Incident Reporting (`/submit`):** Report civic problems in seconds with:
  - High-resolution damage photo capture with live thumbnail preview and base64 fallback.
  - Native Web Speech **Voice-to-Text** in Marathi, Hindi, and English.
  - Automatic geolocation GPS capture across all 8 Nagpur administrative wards.
- **Live Ticket Detail & Audit Timeline (`/issues/:id`):** Real-time status tracking (*Open Incident → Crew Dispatched → Resolved*) with AI confidence breakdown and printable official work slips.

### 2. 🛡️ Ward Authority Console (Area-Wise Jurisdiction)
- **Ward Command Dashboard (`/authority/dashboard`):** Zonal oversight for assigned ward officers (*Dharampeth, Sitabuldi, Sadar, Laxmi Nagar, Gandhibagh, Dhantoli, Nehru Nagar, Manewada, Hingna*).
- **Incident Triaging & Action Queue (`/authority/ward-status`):** Real-time **"Dispatch Crew →"** and **"Mark Resolved ✓"** mutations that dynamically recalculate ward SLA compliance and closed incident counts.
- **Contractor & Infrastructure Ledger (`/authority/infrastructure`):** Issue and track municipal work orders, assigned contractors, crew lead engineers, and expenditure budgets (₹ in Lakh).
- **Official Ward Activity Feed (`/authority/feed`):** Real-time event stream with photo evidence thumbnails and lightbox zoom modal.
- **Civic AI Hazard Hub (`/authority/ai-hub`):** NVIDIA Nemotron 3 predictive spatial anomaly detection (*Monsoon Runoff Culvert Overflows, Pavement Degradation, Transformer Surge Analysis*).

### 3. 🏢 City Municipal Admin Command
- **Citywide Overview (`/admin/dashboard`):** Executive telemetry covering citywide resolution rate, active hotspot alerts, and open incident backlog.
- **Ward SLA Ranking Matrix (`/admin/ward-performance`):** Real-time comparative benchmarking across all 8 Nagpur Municipal Corporation administrative zones with live compliance status.
- **Master Infrastructure Ledger (`/admin/infrastructure`):** Monitor major city capital assets (*Wardha Road Corridor, Ambazari Water Treatment Plant, Sitabuldi Smart Grid*).
- **AI Policy & Model Orchestration Console (`/admin/ai-hub`):** Calibrate global AI confidence minimums, spatial clustering radii, and test live NLP classification in the interactive sandbox.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, React Router 6, TanStack Query v5, Leaflet / React-Leaflet |
| **Design System** | Custom Vidarbha Basalt Charcoal (`#0F141C`), Nagpur Mandarin Saffron (`#E85D04`), Nag River Teal (`#0E7490`), Glassmorphism HUD Panels, Space Grotesk & JetBrains Mono typography, Custom SVG Civic Icon Library |
| **Backend** | Node.js, Express, TypeScript, REST APIs |
| **Database & Auth** | Supabase (PostgreSQL, Row-Level Security, Storage Buckets, Auth) |
| **AI Inference** | NVIDIA Nemotron 3 120B / NIM API, DBSCAN Spatial Clustering Engine |

---

## 🔐 Role-Based Access & Credentials

| Role | Access Level | Demo Credentials |
| :--- | :--- | :--- |
| **Public Citizen** | Open access (no login needed) / Optional profile saving | *Instant 1-Click Guest Pass* or `citizen.demo@nagpurpulse.com` |
| **Ward Authority Officer** | Zone-specific incident triaging & crew dispatch | `authority@nagpurpulse.com` / `authority123` |
| **Municipal Admin** | Citywide executive command & AI policy calibration | `admin@nagpurpulse.com` / `admin123` |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Git

### 2. Clone Repository
```bash
git clone https://github.com/sagarkharbikar25/Nagpur-Pulse.git
cd Nagpur-Pulse
```

### 3. Backend Setup
```bash
cd server
npm install
npm run build
npm run dev
```
*Backend runs on `http://localhost:3001`.*

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run build
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌐 Environment Variables

### Server (`server/.env`):
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret
NVIDIA_API_KEY=your-nvidia-api-key
```

### Client (`client/.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🚀 Cloud Deployment

### 1. Backend (Render / Railway)
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### 2. Frontend (Vercel)
- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 🏛️ Nagpur Municipal Wards Covered
1. **Dharampeth** (Zone 1 - West Nagpur)
2. **Sitabuldi** (Zone 2 - Central Nagpur)
3. **Sadar** (Zone 3 - North Nagpur)
4. **Laxmi Nagar** (Zone 4 - South-West Nagpur)
5. **Gandhibagh** (Zone 5 - Central-East Nagpur)
6. **Dhantoli** (Zone 6 - South-Central Nagpur)
7. **Nehru Nagar** (Zone 7 - East Nagpur)
8. **Manewada** (Zone 8 - South Nagpur)
9. **Hingna** (Zone 9 - Industrial / Rural Corridor)

---

## 📄 License
MIT License. Built with pride for **Vikasit Nagpur 2026**.
