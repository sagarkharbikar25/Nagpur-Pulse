# 👤 MEMBER 3 — Frontend: Dashboards + Authority + App Infrastructure

## Your Ownership
The accountability layer (public ward dashboard) and the official's action center (authority dashboard) — plus the shared plumbing: API client, React Query hooks, Supabase client, routing, and TypeScript types. You're the frontend "glue" person as well as owning two full pages.

---

## Files You Own

```
client/src/
├── components/
│   └── dashboard/
│       ├── WardCard.tsx
│       ├── ResolutionMeter.tsx
│       ├── CategoryBreakdown.tsx
│       └── HotspotAlert.tsx
├── pages/
│   ├── DashboardPage.tsx        ← Public ward dashboard
│   └── authority/
│       ├── AuthorityLoginPage.tsx
│       └── AuthorityDashboard.tsx
├── hooks/
│   ├── useIssues.ts             ← React Query hooks — SHARED, build early
│   ├── useWards.ts
│   ├── useDashboard.ts
│   ├── useHotspots.ts
│   └── useAuth.ts               ← Supabase auth state
├── services/
│   ├── api.ts                   ← Axios instance + base config
│   ├── issues.api.ts
│   ├── wards.api.ts
│   └── dashboard.api.ts
├── lib/
│   └── supabase.ts              ← Supabase client (anon key only)
├── types/
│   ├── issue.ts
│   ├── ward.ts
│   └── user.ts
├── routes/
│   └── AppRoutes.tsx            ← React Router + protected routes
└── App.tsx
```

> **Priority order:** Build `services/`, `lib/supabase.ts`, `types/`, and the `hooks/` first (Hour 1–3) — Members 1 and 2 are blocked without these. Then move to your dashboard/authority pages.

---

## What to Build

### Phase A — Shared Infrastructure (build first, unblocks the team)

**`lib/supabase.ts`**
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**`services/api.ts`** — Axios instance pointed at `VITE_API_URL`, attaches Supabase JWT to `Authorization` header automatically for authenticated calls.

**`hooks/` (React Query)** — one hook per resource:
- `useIssues(filters?)` → `GET /api/issues`
- `useWards()` → `GET /api/wards`
- `useDashboard()` → `GET /api/dashboard`
- `useHotspots(wardId?)` → `GET /api/hotspots` or `/api/hotspots/:ward_id`
- `useAuth()` → wraps Supabase auth state (session, user, role) via Context

**`types/`** — shared interfaces matching the DB schema (coordinate with Member 5 on `issues`, `wards`, `hotspots`, `profiles` shapes).

**`routes/AppRoutes.tsx`**
```tsx
<Route path="/authority/*" element={
  <ProtectedRoute requiredRole="authority">
    <AuthorityDashboard />
  </ProtectedRoute>
} />
```
Also wires up all other pages from Members 1 & 2.

State management rules: **React Query for server state, Supabase+Context for auth, plain `useState` for forms. No Redux/Zustand.**

---

### Phase B — Your Pages

**`DashboardPage.tsx`** — Layout target:
```
┌─────────────────────────────────────────────┐
│  City Overview          Last 30 days        │
│  187 total │ 109 resolved │ 58% city rate   │
│─────────────────────────────────────────────│
│  🔴 ACTIVE HOTSPOTS                         │
│  Dharampeth · Pothole · 8 reports           │
│  Sitabuldi  · Garbage · 5 reports           │
│─────────────────────────────────────────────│
│  WARD BREAKDOWN                             │
│  Dharampeth    ████░░░░  30% resolved  12↑ │
│  Sitabuldi     ██████░░  60% resolved   8↑ │
│  [View Issues] per ward                     │
└─────────────────────────────────────────────┘
```
No login required. Uses `useDashboard()` + `useHotspots()`.

- `WardCard.tsx` — one ward's stats + progress bar
- `ResolutionMeter.tsx` — visual % bar (see block-bar style above)
- `CategoryBreakdown.tsx` — category counts per ward
- `HotspotAlert.tsx` — red alert card, reused in both dashboards

**`AuthorityLoginPage.tsx`** — email/password login (Supabase Auth), redirect to `/authority/dashboard` on success.

**`AuthorityDashboard.tsx`** — Layout target:
```
┌──────────────────────────────────────────────┐
│  Authority: Dharampeth Ward    [Logout]       │
│──────────────────────────────────────────────│
│  🚨 HOTSPOT ALERTS (2)                       │
│  🔴 Pothole · 8 reports · View all           │
│  🟡 Drainage · 4 reports · View all          │
│                                              │
│  OPEN ISSUES (12)    [Filter ▼] [Sort ▼]    │
│  #A1 Pothole · HIGH · 3 days ago             │
│  AI: Deep pothole near post office           │
│  [In Progress] [Resolved]                    │
└──────────────────────────────────────────────┘
```
- Sorted: hotspot members first → recency
- Status update buttons call `PATCH /api/issues/:id/status` with `{ status, resolution_note }`
- **Ward-scoped:** only shows issues where `ward_id` matches the logged-in authority's assigned ward (enforced server-side by Member 4/5, but UI should reflect it — don't fetch other wards)

---

## Design Tokens
```
Primary: #E8500A   Success: #22C55E (resolved)
Warning: #F59E0B (in_progress)   Danger: #EF4444 (hotspot/open)
```

---

## API Endpoints You Consume
| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/dashboard` | none | City stats for public dashboard |
| `GET /api/hotspots` | none | Public hotspot list |
| `GET /api/hotspots/:ward_id` | authority | Ward-scoped hotspots |
| `GET /api/wards/:id/stats` | none | Per-ward breakdown |
| `PATCH /api/issues/:id/status` | authority | Update status + note |

---

## Dependencies / Coordination
- **You unblock Members 1 & 2** — prioritize `services/`, `lib/supabase.ts`, `types/`, `hooks/` in the first 2–3 hours
- **Blocked by:** Member 5 (DB schema for `profiles.role`, `ward_id` assignment) to build `useAuth()` role logic correctly
- **Talk to Member 4** on the exact `PATCH /api/issues/:id/status` request/response shape before building the status buttons

---

## Your Checklist
- [ ] `lib/supabase.ts` client set up (Hour 1)
- [ ] `services/api.ts` Axios instance with JWT attach (Hour 1–2)
- [ ] `types/` interfaces matching DB schema (Hour 2)
- [ ] All 5 hooks in `hooks/` built and tested against real or mock API (Hour 2–3)
- [ ] `AppRoutes.tsx` with protected route wrapper
- [ ] `DashboardPage.tsx` full layout
- [ ] `WardCard.tsx`, `ResolutionMeter.tsx`, `CategoryBreakdown.tsx`, `HotspotAlert.tsx`
- [ ] `AuthorityLoginPage.tsx` working login
- [ ] `AuthorityDashboard.tsx` with hotspot alerts + issue list + status update buttons
- [ ] Ward-scoping verified (authority only sees their ward)
- [ ] Mobile check on public dashboard (authority dashboard can be desktop-first)

---

## Definition of Done
Anyone can view `/dashboard` with no login and see accurate ward stats and hotspots. An authority can log in, see only their ward's hotspot alerts and open issues sorted by priority, and update a status — with the public dashboard reflecting the change on next load.
