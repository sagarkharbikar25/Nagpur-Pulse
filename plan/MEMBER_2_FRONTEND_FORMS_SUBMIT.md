# 👤 MEMBER 2 — Frontend: Forms + Submit Flow

## Your Ownership
The citizen-facing input side: issue submission, photo upload, magic-link auth entry, and the issue detail/tracking view. This is the flow judges will actually click through live in the demo — it needs to be fast and bulletproof.

---

## Files You Own

```
client/src/
├── components/
│   └── issues/
│       ├── IssueCard.tsx
│       ├── IssueForm.tsx        ← Submit form (core demo component)
│       ├── IssueStatusBadge.tsx
│       └── IssueDetail.tsx
├── components/ui/
│   ├── Input.tsx
│   └── Select.tsx
├── pages/
│   ├── SubmitIssuePage.tsx      ← Issue submission flow
│   ├── IssueDetailPage.tsx      ← Single issue view
│   └── AuthPage.tsx             ← Login/magic link
```

---

## What to Build

### 1. `SubmitIssuePage.tsx` — Layout target:
```
┌──────────────────────────────┐
│  ← Back   Report an Issue   │
│──────────────────────────────│
│  Describe the problem *      │
│  ┌──────────────────────┐   │
│  │ Type what you see... │   │
│  └──────────────────────┘   │
│  (AI will auto-categorize)  │
│                              │
│  Select Ward *               │
│  [Dharampeth          ▼]    │
│                              │
│  Add Photo (optional)        │
│  [📷 Upload Photo]           │
│                              │
│  [Submit Issue →]            │
│                              │
│  ✓ Category assigned by AI  │
│  ✓ Appears on map instantly │
└──────────────────────────────┘
```

**Form field rules:**
- Description: text, **20–500 chars**, required, live char counter
- Ward: dropdown, required, populated from `GET /api/wards`
- Category hint: optional (AI auto-assigns anyway — don't over-build this)
- Photo: optional, max 5MB, JPEG/PNG/WebP only

**Submit flow:**
```
POST /api/issues
Body: { description, ward_id, category_hint?, photo_url? }
```
On success (201): show toast "Issue #[ID] submitted. Track it here." → redirect to `IssueDetailPage` or back to map with new pin visible.

### 2. `IssueForm.tsx`
- Controlled form component (plain `useState`, no need for form libraries — scope is simple)
- Client-side validation before hitting the API (char length, ward required)
- Loading state while submitting (disable button, show spinner)
- Error state if API fails (show inline error, don't lose user's typed text)

### 3. Photo Upload
- Separate call: `POST /api/issues/upload-photo` (multipart/form-data)
- On success, get back `{ url, ai_description }` — attach `url` to the issue form before final submit
- **Fallback if this fails:** issue must still submit without photo. Never block the main submit on photo upload failure.

### 4. `IssueDetailPage.tsx` / `IssueDetail.tsx`
- Fetch `GET /api/issues/:id`
- Show: AI summary, category badge, severity, photo (if any), ward, status timeline (from `status_history`), resolution note if resolved
- `IssueStatusBadge.tsx` — colored badge: open (red/warning), in_progress (amber), resolved (green)

### 5. `AuthPage.tsx`
- Citizen flow: enter name + email → Supabase sends magic link → click link → authenticated
- Use Supabase client SDK directly (`lib/supabase.ts`, owned by Member 3, you just import it)
- Keep this screen minimal — one form, one button, clear "check your email" state after submit

### 6. `IssueCard.tsx`
- Compact card used in lists (citizen's own issues, ward issue lists elsewhere)
- Shows: description snippet, category badge, status badge, date

---

## Design Tokens
Same as rest of app — see shared design system:
```
Primary:     #E8500A  Background: #0F1117  Surface: #1A1D27
Success:     #22C55E  Warning:    #F59E0B  Danger:  #EF4444
```
Use `Input.tsx` / `Select.tsx` with dark theme styling — border `#2A2D3A`, text `#F2F2F2`, muted placeholder `#8B8FA8`.

---

## API Endpoints You Consume
| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /api/issues` | citizen | Submit new issue |
| `POST /api/issues/upload-photo` | citizen | Upload photo, get AI vision description |
| `GET /api/issues/:id` | none | Issue detail + status history |
| `GET /api/wards` | none | Populate ward dropdown |

---

## Dependencies / Coordination
- **Blocked by:** Member 1's `ui/Button.tsx`, `Badge.tsx`, `Toast.tsx` (build these first, Day 1)
- **Blocked by:** Member 5 needs to expose `POST /api/issues` early — coordinate a mock/stub response on Day 1 so you can build the form without waiting
- **Blocks:** nothing downstream, but this is the critical demo path — prioritize it after the shared `ui/` kit is ready

---

## Your Checklist
- [ ] `Input.tsx` / `Select.tsx` base components (dark theme, shared)
- [ ] `IssueForm.tsx` with validation (char length, required ward)
- [ ] `SubmitIssuePage.tsx` full layout, connected to `POST /api/issues`
- [ ] Photo upload wired with graceful failure (submit still works without it)
- [ ] Success toast + redirect after submit
- [ ] `AuthPage.tsx` magic link flow (citizen)
- [ ] `IssueDetailPage.tsx` + `IssueDetail.tsx` showing AI fields + status timeline
- [ ] `IssueStatusBadge.tsx` color-coded
- [ ] `IssueCard.tsx` reusable card
- [ ] Mobile responsive — this form is the primary mobile use case
- [ ] Test full flow end-to-end with real backend before Hour 18 cutoff

---

## Definition of Done
A citizen can type a description, pick a ward, optionally attach a photo, hit submit, and within 1–2 seconds see a success toast with an AI-assigned category — with zero crashes if AI or photo upload fails.
