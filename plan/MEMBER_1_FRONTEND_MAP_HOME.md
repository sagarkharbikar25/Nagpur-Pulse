# 👤 MEMBER 1 — Frontend: Map + Home Page

## Your Ownership
The public landing experience — the first thing anyone (citizen or judge) sees. This is the "wow" screen: a live Nagpur map with issue pins and hotspot circles.

---

## Files You Own

```
client/src/
├── components/
│   ├── map/
│   │   ├── NagpurMap.tsx        ← Leaflet map component
│   │   ├── IssuePin.tsx         ← Colored map pin by category
│   │   └── HotspotCircle.tsx    ← Hotspot overlay circle
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx   (shared — coordinate with Members 2 & 3)
├── pages/
│   └── HomePage.tsx             ← Map + submit button + stat bar
├── utils/
│   └── categoryColors.ts        ← Map pin colors by category
```

> Note: `ui/` base components (Button, Badge, Toast, LoadingSpinner) are shared across all 3 frontend members. Build them first, on Day 1, and push early so Members 2 & 3 aren't blocked.

---

## Tech Stack (your slice)
- React + Vite + TypeScript
- Tailwind CSS
- **Leaflet.js + OpenStreetMap** (no API key needed)
- React Query (for fetching issues/wards — hooks come from Member 3's `useIssues.ts` / `useWards.ts`, but you consume them)

---

## What to Build

### 1. `NagpurMap.tsx`
- Leaflet map centered on Nagpur (21.1458, 79.0882), zoom ~12
- Renders one `IssuePin` per issue (fetched via `useIssues()` hook)
- Renders `HotspotCircle` overlays for active hotspots (fetched via `useHotspots()`)
- Click a pin → mini popup card (category, AI summary, status badge)

### 2. `IssuePin.tsx`
- Colored marker based on category — use `categoryColors.ts`:
```ts
pothole:      #EF4444  (red)
streetlight:  #F59E0B  (amber)
water:        #3B82F6  (blue)
garbage:      #84CC16  (lime)
drainage:     #8B5CF6  (purple)
encroachment: #F97316  (orange)
other:        #6B7280  (gray)
```

### 3. `HotspotCircle.tsx`
- Red pulsing/highlighted circle overlay around clustered issue coordinates
- Only rendered for hotspots with `status: "active"`

### 4. `HomePage.tsx` — Layout target:
```
┌──────────────────────────────────────────────────┐
│  🚦 NAGPUR PULSE          [Report Issue] [Login] │
│─────────────────────────────────────────────────│
│  "Every ward. Every issue. Visible."             │
│  [187 issues tracked] [58% resolved] [5 hotspots]│
│  ┌────────────────────────────────────────────┐  │
│  │        NAGPUR MAP (Leaflet)                │  │
│  │   • colored pins by category              │  │
│  │   🔴 hotspot circles                      │  │
│  │   Click pin → mini issue card             │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│  Category filter: [All] [Pothole] [Water] [...]  │
└──────────────────────────────────────────────────┘
```

### 5. Base UI kit (`ui/`)
Build these first — everyone needs them:
- `Button.tsx` — primary/secondary/danger variants
- `Badge.tsx` — for status/category tags
- `Toast.tsx` — success/error notifications
- `LoadingSpinner.tsx`

---

## Design Tokens (use exactly)

```
Primary:     #E8500A  (Nagpur orange)
Background:  #0F1117
Surface:     #1A1D27
Border:      #2A2D3A
Text High:   #F2F2F2
Text Muted:  #8B8FA8
Success:     #22C55E  (resolved)
Warning:     #F59E0B  (in_progress)
Danger:      #EF4444  (hotspot / open critical)
```

Fonts: **Inter** (headers 700/600, body 400/500), **JetBrains Mono** for counts/IDs.

---

## API Endpoints You Consume (read-only, no auth needed)
| Endpoint | Purpose |
|---|---|
| `GET /api/issues` | All issues for pins (paginate/filter by category, status) |
| `GET /api/hotspots` | Active hotspots for circles |
| `GET /api/wards` | Ward center coordinates |
| `GET /api/dashboard` | Stat bar numbers (total, resolved%, hotspots) |

You don't build these — Member 4 (backend) and Member 5 (DB/backend) own them. Just consume via the hooks Member 3 wires up in `services/` and `hooks/`.

---

## Dependencies / Coordination
- **Blocked by:** nothing critical — Leaflet works with mock/dummy data on Day 1 while backend is built in parallel
- **Blocks:** Member 3 needs your `ui/` kit early; everyone needs `categoryColors.ts`
- **Talk to Member 4/5** once seed data (30+ issues, 8 wards) is in the DB, so pins render real data

---

## Your Checklist
- [ ] Base `ui/` components built and pushed (Hour 1–2, shared priority)
- [ ] `categoryColors.ts` utility with all 7 category colors
- [ ] `NagpurMap.tsx` renders with dummy hardcoded pins (Day 1, before backend ready)
- [ ] `IssuePin.tsx` + popup on click
- [ ] `HotspotCircle.tsx` overlay logic
- [ ] `HomePage.tsx` full layout with stat bar
- [ ] Swap dummy data for real `useIssues()`/`useHotspots()` hooks once available
- [ ] Category filter buttons work (filters pins client-side or via query param)
- [ ] Mobile responsive — map resizes correctly on small screens
- [ ] Empty state: map still shows seed data, never blank

---

## Definition of Done
Loading the home page shows a live Nagpur map with real colored pins from the database, hotspot circles where 3+ same-ward/category issues exist, and clicking a pin shows the AI summary.
