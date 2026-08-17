# 👤 MEMBER 4 — Backend: Routes, Controllers, AI + Clustering

## Your Ownership
The "moving parts" of the backend: HTTP layer (routes/controllers), the AI integration (Gemini), and the clustering/hotspot detection logic. Member 5 owns the database schema, auth/middleware, and the other half of services — you plug into the DB layer they define rather than designing it yourself.

---

## Files You Own

```
server/src/
├── config/
│   └── gemini.ts               ← Gemini API client
├── controllers/
│   ├── issues.controller.ts
│   ├── wards.controller.ts
│   ├── dashboard.controller.ts
│   └── hotspots.controller.ts
├── routes/
│   ├── issues.routes.ts
│   ├── wards.routes.ts
│   ├── dashboard.routes.ts
│   └── hotspots.routes.ts
├── services/
│   ├── ai.service.ts           ← Gemini categorization logic
│   └── clustering.service.ts   ← Hotspot detection
├── types/
│   └── ai.types.ts
```

> `config/supabase.ts`, `services/issues.service.ts`, `services/storage.service.ts`, `middleware/`, and `validators/` are Member 5's — you call into their service functions, they don't call into your controllers.

---

## What to Build

### 1. `config/gemini.ts`
- Initialize the Gemini client with `GEMINI_API_KEY` (server-only env var)
- Export a single configured client for `ai.service.ts` to use

### 2. `services/ai.service.ts` — Issue Categorization

**Prompt (exact):**
```
You are a civic issue classifier for Nagpur Municipal Corporation.

Given this citizen report, return ONLY a JSON object with these exact fields:
{
  "category": one of [pothole, streetlight, water, garbage, drainage, encroachment, other],
  "summary": a clear 1-sentence summary under 100 chars,
  "severity_hint": one of [low, medium, high]
}

Severity guide:
- high: immediate safety risk, blocking road, no water supply
- medium: causes inconvenience, recurring issue
- low: minor, aesthetic

Citizen report: "[DESCRIPTION]"

Return ONLY the JSON. No explanation. No markdown.
```

**Failure handling (critical — build this first):**
```
If Gemini fails →
  category: "other"
  summary: description.slice(0, 100)
  severity_hint: "medium"
System must keep working. AI failure ≠ crash.
```

### 3. `services/ai.service.ts` — Photo Vision (SHOULD HAVE, build after MUST HAVEs work)
```
Prompt: "Describe what civic issue is visible in this image in one sentence.
Be specific: mention what you see (road, drain, light, etc.) and the problem.
Return ONLY the description sentence. No JSON. No extra text.
Maximum 120 characters."
```
Failure handling: `photo_description: null`, issue still saves with photo URL.

### 4. `services/clustering.service.ts` — Hotspot Detection

Runs after every issue insert:
```sql
SELECT COUNT(*) FROM issues
WHERE ward_id = $1 AND category = $2
AND status != 'resolved'
AND created_at > NOW() - INTERVAL '30 days'
```
If count >= 3 → upsert into `hotspots` table (`ON CONFLICT (ward_id, category) DO UPDATE`, increment `issue_count`).

### 5. Controllers + Routes

| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/issues` | POST | citizen | Validate → photo upload (calls Member 5's storage service) → Gemini categorize → save (calls Member 5's issues service) → run clustering → respond |
| `/api/issues` | GET | none | Filters: `ward_id`, `category`, `status`, `page`, `limit` (max 50) |
| `/api/issues/:id` | GET | none | Full issue + status history |
| `/api/issues/:id/status` | PATCH | authority/admin | Delegates ward-scope check to Member 5's auth middleware |
| `/api/issues/upload-photo` | POST | citizen | multipart, calls storage service + vision AI |
| `/api/wards` | GET | none | All wards + coordinates |
| `/api/wards/:id/stats` | GET | none | Aggregated stats (open/in_progress/resolved counts, category breakdown) |
| `/api/hotspots` | GET | none | All active hotspots |
| `/api/hotspots/:ward_id` | GET | authority | Ward-scoped hotspots + clustered issue list |
| `/api/dashboard` | GET | none | Citywide stats aggregation |

**Response envelope (use for everything):**
```json
{ "success": true, "data": {}, "error": null }
```

**Rate limiting (coordinate with Member 5, who owns the middleware file, but these are your numbers):**
```
POST /api/issues            → 10/min globally (Gemini free tier = 15 RPM)
POST /api/issues/upload-photo → 10/hour per user
```

---

## API Contract Examples

**POST /api/issues response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "pothole",
    "ai_summary": "Deep pothole (~2ft) near Dharampeth post office posing vehicle damage risk",
    "severity_hint": "high",
    "status": "open",
    "hotspot_triggered": true
  }
}
```

**GET /api/dashboard response:**
```json
{
  "total_issues": 187,
  "resolved_today": 12,
  "active_hotspots": 5,
  "city_resolution_rate": 58.3,
  "top_categories": ["pothole", "garbage", "streetlight"],
  "ward_rankings": [{ "ward": "Dharampeth", "open": 12, "resolution_rate": 30 }]
}
```

---

## Dependencies / Coordination
- **Blocked by:** Member 5's `config/supabase.ts` client and `services/issues.service.ts` (basic CRUD) — agree on function signatures on Hour 1 so you can stub against them
- **You block:** Members 1, 2, 3 on the frontend need your endpoints live — get `GET /api/wards` and `GET /api/issues` working first (even with placeholder data) so frontend isn't stalled
- **Sync point with Member 5:** clustering writes to `hotspots` table — confirm the upsert query works against their schema before Hour 6

---

## Your Checklist
- [ ] `config/gemini.ts` client initialized
- [ ] `ai.service.ts` categorization with fallback (Hour 3–5, this is a MUST HAVE)
- [ ] `clustering.service.ts` hotspot detection logic + upsert
- [ ] All controllers + routes wired for issues/wards/hotspots/dashboard
- [ ] `POST /api/issues` full pipeline: validate → photo (if any) → AI categorize → save → cluster check → respond
- [ ] `GET /api/issues` with all filters + pagination
- [ ] `PATCH /api/issues/:id/status` (ward-scope enforced via Member 5's middleware)
- [ ] Photo vision AI (after MUST HAVEs are solid)
- [ ] `GET /api/dashboard` aggregation query
- [ ] Test: Gemini failure doesn't crash issue submission
- [ ] Test: hotspot triggers correctly at 3+ same ward/category

---

## Definition of Done
Submitting an issue through the API returns an AI-assigned category and summary within 1–2 seconds (or gracefully falls back), and a hotspot is automatically created when the 3rd matching issue in a ward lands.
