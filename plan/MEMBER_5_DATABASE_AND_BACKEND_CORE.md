# 👤 MEMBER 5 — Database (Full) + Backend Core (Half)

## Your Ownership
Everything the app stands on: the database schema, RLS security policies, Supabase config, seed data, auth middleware, core CRUD services, and validation. Member 4 builds AI/clustering/routes *on top of* what you provide — your priority is having a working, queryable database and a basic issues service ready as early as possible so nobody downstream is blocked.

You also own deployment setup since it's tightly coupled to your env/config work.

---

## Files You Own

```
server/src/
├── config/
│   └── supabase.ts             ← Supabase client (service role)
├── services/
│   ├── issues.service.ts       ← Core DB queries for issues
│   └── storage.service.ts      ← Supabase Storage uploads
├── middleware/
│   ├── auth.middleware.ts      ← Supabase JWT verification
│   ├── rateLimit.middleware.ts ← express-rate-limit
│   ├── validate.middleware.ts
│   └── errorHandler.ts
├── validators/
│   ├── issue.validator.ts
│   └── status.validator.ts
├── types/
│   ├── issue.types.ts
│   └── ward.types.ts
├── app.ts                      ← Express app setup
└── server.ts                   ← Entry point

+ All Supabase SQL: table creation, RLS policies, seed data
+ Deployment: Render.com (backend) + coordinate Vercel env vars with frontend team
```

---

## Part 1 — Database (build this first, Hour 1–3)

### Tables — create in this order (FK dependencies)

**1. `wards`**
```sql
CREATE TABLE wards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  zone        TEXT,
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**2. `profiles`** (extends `auth.users`)
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'citizen'
              CHECK (role IN ('citizen', 'authority', 'admin')),
  ward_id     UUID REFERENCES wards(id),  -- NULL for citizen/admin
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**3. `hotspots`**
```sql
CREATE TABLE hotspots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id     UUID NOT NULL REFERENCES wards(id),
  category    TEXT NOT NULL,
  issue_count INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ward_id, category)
);
```

**4. `issues`** (core table)
```sql
CREATE TABLE issues (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id      UUID NOT NULL REFERENCES profiles(id),
  ward_id         UUID NOT NULL REFERENCES wards(id),
  description     TEXT NOT NULL CHECK (char_length(description) BETWEEN 20 AND 500),
  category_hint   TEXT,
  category        TEXT CHECK (category IN ('pothole','streetlight','water','garbage','drainage','encroachment','other')),
  ai_summary      TEXT,
  severity_hint   TEXT CHECK (severity_hint IN ('low','medium','high')),
  photo_url       TEXT,
  photo_description TEXT,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','flagged')),
  resolution_note TEXT,
  resolved_by     UUID REFERENCES profiles(id),
  resolved_at     TIMESTAMPTZ,
  hotspot_id      UUID REFERENCES hotspots(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_issues_ward_category ON issues(ward_id, category);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_citizen ON issues(citizen_id);
```

**5. `status_history`** (audit trail)
```sql
CREATE TABLE status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  changed_by  UUID NOT NULL REFERENCES profiles(id),
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  note        TEXT,
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies (apply after tables exist)

```sql
-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin reads all profiles" ON profiles FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ISSUES
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read issues" ON issues FOR SELECT USING (status != 'flagged');
CREATE POLICY "Authenticated citizens can insert" ON issues FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Citizens can update own open issues" ON issues FOR UPDATE
USING (auth.uid() = citizen_id AND status = 'open');
CREATE POLICY "Authority updates issues in their ward" ON issues FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('authority','admin')
       AND (ward_id = issues.ward_id OR role = 'admin')));

-- HOTSPOTS
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read hotspots" ON hotspots FOR SELECT USING (true);

-- STATUS_HISTORY
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read status history" ON status_history FOR SELECT USING (true);
CREATE POLICY "Authority can insert status history" ON status_history FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('authority','admin')));
```

### Seed Data (do this Hour 2–4, unblocks everyone visually)

```sql
INSERT INTO wards (name, zone, latitude, longitude) VALUES
  ('Dharampeth',   'West',    21.1458, 79.0882),
  ('Sitabuldi',    'Central', 21.1498, 79.0806),
  ('Gandhibagh',   'Central', 21.1551, 79.0878),
  ('Laxmi Nagar',  'East',    21.1420, 79.1190),
  ('Sadar',        'Central', 21.1522, 79.0916),
  ('Manewada',     'East',    21.1100, 79.1250),
  ('Nagpur Rural', 'Outer',   21.0800, 79.0600),
  ('Hingna',       'West',    21.1200, 78.9800);
```
Then: **30+ realistic issues across 6 wards** (mix of categories/statuses, some deliberately clustered 3+ same ward+category to demo hotspots), 1 demo authority account, 1 demo admin account.

---

## Part 2 — Backend Core (half of backend — the other half is Member 4's AI/routes/clustering)

### `config/supabase.ts`
Two clients: one with **anon key** (respects RLS, for public reads) and one with **service role key** (bypasses RLS, server-only — never sent to frontend).

### `services/issues.service.ts`
Core CRUD Member 4's controllers call into:
- `createIssue(data)` — insert into `issues`
- `getIssues(filters)` — paginated select with filters
- `getIssueById(id)` — with joined `status_history`
- `updateIssueStatus(id, status, note, actorId)` — updates issue + inserts `status_history` row

### `services/storage.service.ts`
- Upload photo to Supabase Storage bucket `issue-photos` (public read)
- MIME check (JPEG/PNG/WebP), 5MB max
- Return public URL

### `middleware/auth.middleware.ts`
- Verify Supabase JWT on protected routes
- Attach `req.user` with `id` + `role` (pulled from `profiles`, never trust frontend claims)

### `middleware/rateLimit.middleware.ts`
```
POST /api/issues            → 10/min globally
POST /api/issues/upload-photo → 10/hour per user
```
(express-rate-limit — no Redis needed at this scale)

### `validators/` (Zod schemas)
- `issue.validator.ts`: description 20–500 chars stripped of HTML, valid ward UUID
- `status.validator.ts`: status enum check

### `app.ts` / `server.ts`
- Express setup: Helmet.js, CORS (restrict to frontend domain), JSON body parsing, mount Member 4's routers, global `errorHandler.ts`
- `GET /health` → `{ status: "ok", service: "nagpur-pulse-api", timestamp }`

---

## Part 3 — Environment Variables (you own the .env files)

**`server/.env`**
```env
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # SECRET
GEMINI_API_KEY=AIza...             # SECRET, hand to Member 4
PORT=3001
CLIENT_URL=https://nagpurpulse.vercel.app
NODE_ENV=production
```
Send `client/.env` values (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`) to Member 3 once Supabase project exists.

---

## Part 4 — Deployment (yours, Hour ~20–22 in the timeline)
- [ ] Render.com: new Web Service, build `npm install && npm run build`, start `node dist/server.js`
- [ ] All backend env vars set in Render dashboard
- [ ] `/health` returns 200 on Render URL
- [ ] CORS set to Vercel frontend URL
- [ ] Supabase Auth redirect URL updated to production Vercel URL
- [ ] Ping `/health` before demo to avoid Render cold start (free tier sleeps after 15 min)

---

## Dependencies / Coordination
- **You unblock everyone.** Tables + seed data + `config/supabase.ts` + basic `issues.service.ts` are the critical path — prioritize Hour 1–4 hard.
- **Sync with Member 4** on exact function signatures for `issues.service.ts` before they start controllers (Hour 1, quick call)
- **Sync with Member 3** on `profiles.role` / `ward_id` shape for the frontend `useAuth()` hook
- **Sync with Member 4** on the `hotspots` upsert query before Hour 6

---

## Your Checklist
- [ ] Supabase project created
- [ ] All 5 tables created with correct schema + indexes
- [ ] RLS policies applied and tested (try querying as citizen vs authority vs admin)
- [ ] Storage bucket `issue-photos` created (public read)
- [ ] Seed data: 8 wards, 30+ issues, demo authority + admin accounts
- [ ] `config/supabase.ts` (anon + service role clients)
- [ ] `issues.service.ts` core CRUD functions
- [ ] `storage.service.ts` photo upload
- [ ] `auth.middleware.ts` JWT verify + role attach
- [ ] `rateLimit.middleware.ts`
- [ ] `validators/` Zod schemas
- [ ] `app.ts`/`server.ts` with Helmet, CORS, `/health`
- [ ] Backend deployed to Render, `/health` returns 200 in production
- [ ] Env vars handed off to Members 3 & 4

---

## Definition of Done
Database is fully seeded and queryable, RLS correctly restricts citizens/authorities/admins, `POST /api/issues` can insert a row end-to-end (even before AI is wired in), and the backend is live on Render with `/health` returning 200.
