-- ============================================================================
-- NAGPUR PULSE — Supabase Database Schema
-- Member 5: Database (Full) + Backend Core (Half)
-- ============================================================================
-- Order matters: create tables in dependency order (FKs)
-- Run this entire file in the Supabase SQL editor.
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- 1. WARDS
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  zone        TEXT,                       -- e.g. 'West', 'Central', 'East'
  latitude    DECIMAL(9,6),               -- Center point for map
  longitude   DECIMAL(9,6),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────
-- 2. PROFILES (extends auth.users)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'citizen'
              CHECK (role IN ('citizen', 'authority', 'admin')),
  ward_id     UUID REFERENCES wards(id),  -- NULL for citizen/admin
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────
-- 3. HOTSPOTS
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hotspots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id     UUID NOT NULL REFERENCES wards(id),
  category    TEXT NOT NULL,
  issue_count INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'resolved')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ward_id, category)               -- One hotspot per ward+category
);

-- ──────────────────────────────────────────────────────────────────────────
-- 4. ISSUES (core table)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS issues (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id      UUID NOT NULL REFERENCES profiles(id),
  ward_id         UUID NOT NULL REFERENCES wards(id),

  -- Citizen input
  description     TEXT NOT NULL CHECK (char_length(description) BETWEEN 20 AND 500),
  category_hint   TEXT,                    -- Optional citizen hint

  -- AI-generated
  category        TEXT CHECK (category IN (
                    'pothole', 'streetlight', 'water', 'garbage',
                    'drainage', 'encroachment', 'other'
                  )),
  ai_summary      TEXT,                    -- AI-generated clean summary
  severity_hint   TEXT CHECK (severity_hint IN ('low', 'medium', 'high')),

  -- Photo
  photo_url       TEXT,                    -- Supabase Storage URL
  photo_description TEXT,                   -- AI vision description of photo

  -- Status
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'in_progress', 'resolved', 'flagged')),
  resolution_note TEXT,
  resolved_by     UUID REFERENCES profiles(id),
  resolved_at     TIMESTAMPTZ,

  -- Clustering
  hotspot_id      UUID REFERENCES hotspots(id),

  -- Meta
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for clustering + dashboard queries
CREATE INDEX IF NOT EXISTS idx_issues_ward_category ON issues(ward_id, category);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_citizen ON issues(citizen_id);
CREATE INDEX IF NOT EXISTS idx_issues_hotspot ON issues(hotspot_id);

-- ──────────────────────────────────────────────────────────────────────────
-- 5. STATUS_HISTORY (audit trail)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  changed_by  UUID NOT NULL REFERENCES profiles(id),
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  note        TEXT,
  changed_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_issue ON status_history(issue_id);

-- ──────────────────────────────────────────────────────────────────────────
-- 6. UPDATED_AT TRIGGERS
-- ──────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_hotspots_updated_at
  BEFORE UPDATE ON hotspots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ──────────────────────────────────────────────────────────────────────────

-- PROFILES: users read own, admins read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin reads all profiles" ON profiles;
CREATE POLICY "Admin reads all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ISSUES: public read, authenticated insert, authority/admin update
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read issues" ON issues;
CREATE POLICY "Public can read issues"
  ON issues FOR SELECT
  USING (status != 'flagged');

DROP POLICY IF EXISTS "Authenticated citizens can insert" ON issues;
CREATE POLICY "Authenticated citizens can insert"
  ON issues FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Citizens can update own open issues" ON issues;
CREATE POLICY "Citizens can update own open issues"
  ON issues FOR UPDATE
  USING (
    auth.uid() = citizen_id
    AND status = 'open'
  );

DROP POLICY IF EXISTS "Authority updates issues in their ward" ON issues;
CREATE POLICY "Authority updates issues in their ward"
  ON issues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('authority', 'admin')
        AND (ward_id = issues.ward_id OR role = 'admin')
    )
  );

-- HOTSPOTS: public read, backend inserts via service role only
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hotspots" ON hotspots;
CREATE POLICY "Public can read hotspots"
  ON hotspots FOR SELECT
  USING (true);

-- STATUS_HISTORY: public read, authority/admin insert
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read status history" ON status_history;
CREATE POLICY "Public can read status history"
  ON status_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authority can insert status history" ON status_history;
CREATE POLICY "Authority can insert status history"
  ON status_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('authority', 'admin')
    )
  );