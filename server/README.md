# Nagpur Pulse — Backend API

Express + TypeScript REST API backed by **Supabase** (PostgreSQL + Auth + Storage).

---

## 📁 Project Structure

```
server/
├── src/
│   ├── app.ts                        ← Express app setup (middleware, routes)
│   ├── server.ts                     ← Entry point (starts HTTP server)
│   ├── config/
│   │   ├── supabase.ts               ← Supabase anon + service-role clients
│   │   └── env.ts                    ← Type-safe env var validation
│   ├── routes/
│   │   └── issues.routes.ts          ← All /api/issues endpoints
│   ├── services/
│   │   ├── issues.service.ts         ← Core CRUD DB queries
│   │   └── storage.service.ts        ← Photo upload to Supabase Storage
│   ├── middleware/
│   │   ├── auth.middleware.ts        ← JWT verify + role attach
│   │   ├── rateLimit.middleware.ts   ← express-rate-limit configs
│   │   ├── validate.middleware.ts    ← Zod request validation
│   │   └── errorHandler.ts          ← Global error handler
│   ├── validators/
│   │   ├── issue.validator.ts        ← Zod schema for issue creation
│   │   └── status.validator.ts      ← Zod schema for status update
│   └── types/
│       ├── issue.types.ts            ← Issue + filter TypeScript types
│       └── ward.types.ts             ← Ward TypeScript types
├── .env.example                      ← Copy this → .env (ask Member 5 for values)
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18.x |
| npm | >= 9.x |

---

## 🚀 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/sagarkharbikar25/Nagpur-Pulse.git
cd Nagpur-Pulse/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
> ⚠️ **Ask Member 5 for the actual `.env` file** — they will share it with you directly.  
> Do NOT commit `.env` to git.

```bash
# Copy the example file
cp .env.example .env
# Then fill in values from Member 5
```

### 4. Run the dev server
```bash
npm run dev
```

Server starts at: **http://localhost:3001**

---

## ✅ Verify It's Working

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "nagpur-pulse-api",
    "timestamp": "...",
    "uptime": 1.23
  },
  "error": null
}
```

---

## 📡 API Endpoints

All responses follow the shape:
```json
{ "success": true/false, "data": <payload>, "error": null/"message" }
```

### Issues

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/issues` | Public | List issues (supports filters) |
| `GET` | `/api/issues/:id` | Public | Get single issue + status history |
| `POST` | `/api/issues` | 🔒 citizen / admin | Submit a new issue |
| `POST` | `/api/issues/upload-photo` | 🔒 any auth user | Upload photo, returns URL |
| `PATCH` | `/api/issues/:id/status` | 🔒 authority / admin | Update issue status |

### Query Filters for `GET /api/issues`

| Param | Type | Example |
|-------|------|---------|
| `ward_id` | UUID | `?ward_id=abc-123` |
| `category` | string | `?category=pothole` |
| `status` | string | `?status=open` |
| `citizen_id` | UUID | `?citizen_id=xyz-456` |
| `page` | number | `?page=2` |
| `limit` | number | `?limit=10` |

### Auth Header (for protected routes)
```
Authorization: Bearer <supabase_jwt_token>
```

---

## 📦 Available npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Runs with ts-node, hot-reloads |
| Build | `npm run build` | Compiles TypeScript → `dist/` |
| Start (prod) | `npm start` | Runs compiled `dist/server.js` |
| Type check | `npx tsc --noEmit` | Checks types without building |

---

## 🗄️ Database

Supabase (PostgreSQL) with these tables:

| Table | Description |
|-------|-------------|
| `wards` | 8 Nagpur wards with lat/long |
| `profiles` | Extends Supabase auth (citizen / authority / admin) |
| `issues` | Core issues table |
| `hotspots` | Clustering: issue count per ward+category |
| `status_history` | Audit trail of every status change |

> SQL migrations are in `supabase/migrations/` — already applied to the shared Supabase project by Member 5.

---

## 🔒 Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /api/issues` | 10 req / min (global) |
| `POST /api/issues/upload-photo` | 10 req / hour (per user) |
| All other routes | 100 req / 15 min |

---

## 🤝 Coordination Notes

- **Member 4 (AI/Routes/Clustering)**: Call functions from `IssuesService` directly. Key methods: `createIssue()`, `getIssues()`, `getIssueById()`, `updateIssueStatus()`, `updateHotspotCount()`
- **Member 3 (Frontend/Auth)**: Use `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` — ask Member 5 for values. The `profiles.role` field returns `citizen | authority | admin`.
- **Member 1 & 2 (Frontend)**: Base API URL is `VITE_API_URL` (set to Render URL in production, `http://localhost:3001` in dev)

---

## 🚀 Production (Render.com)

The backend is deployed on Render. The live health check URL will be shared by Member 5 once deployed.

To avoid cold-start delays on the free tier, ping `/health` before your demo.
