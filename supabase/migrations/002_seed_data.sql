-- ============================================================================
-- NAGPUR PULSE — Seed Data
-- 8 Nagpur wards + 30+ demo issues + demo accounts
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- WARD SEED DATA
-- ──────────────────────────────────────────────────────────────────────────
INSERT INTO wards (name, zone, latitude, longitude) VALUES
  ('Dharampeth',   'West',    21.1458, 79.0882),
  ('Sitabuldi',    'Central', 21.1498, 79.0806),
  ('Gandhibagh',   'Central', 21.1551, 79.0878),
  ('Laxmi Nagar',  'East',    21.1420, 79.1190),
  ('Sadar',        'Central', 21.1522, 79.0916),
  ('Manewada',     'East',    21.1100, 79.1250),
  ('Nagpur Rural', 'Outer',   21.0800, 79.0600),
  ('Hingna',       'West',    21.1200, 78.9800)
ON CONFLICT (name) DO NOTHING;

-- Get ward UUIDs for seed issues
WITH ward_uuids AS (
  SELECT id, name FROM wards
)

-- ──────────────────────────────────────────────────────────────────────────
-- SEED ISSUES (30+ realistic Nagpur civic issues)
-- Mix of categories, statuses, and clustered hotspots for demo
-- ──────────────────────────────────────────────────────────────────────────
INSERT INTO issues (citizen_id, ward_id, description, category_hint, category, ai_summary, severity_hint, status, created_at) VALUES
  -- ===== DHARAMPETH (creates hotspot: 4 potholes, 3 streetlights) =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Large pothole near Dharampeth post office, 2 feet wide, causing vehicle damage',
    'pothole', 'pothole', 'Deep pothole near post office, vehicle damage risk', 'high', 'open', NOW() - INTERVAL '2 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Another pothole on the main road near Ganesh Temple Chowk, water pooling after rain',
    'pothole', 'pothole', 'Pothole with water pooling, main road', 'high', 'open', NOW() - INTERVAL '5 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Broken streetlight at Dharampeth circle, very dark at night, safety issue for pedestrians',
    'streetlight', 'streetlight', 'Broken streetlight at circle, nighttime safety risk', 'medium', 'open', NOW() - INTERVAL '8 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Third pothole report near the railway crossing, dangerous for bikes and small vehicles',
    'pothole', 'pothole', 'Dangerous pothole near railway crossing', 'high', 'open', NOW() - INTERVAL '1 day'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Streetlight near station road is flickering, needs immediate repair',
    'streetlight', 'streetlight', 'Flickering streetlight, needs repair', 'medium', 'in_progress', NOW() - INTERVAL '3 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Dharampeth'),
    'Pothole at the entrance to Dharampeth market area, many vehicles damaged',
    'pothole', 'pothole', 'Market entrance pothole, vehicle damage', 'high', 'resolved', NOW() - INTERVAL '2 days'
  ),

  -- ===== SITABULDI (creates hotspot: 3 garbage, 2 drainage) =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sitabuldi'),
    'Garbage pile not cleared near Sitabuldi main entrance, attracting flies',
    'garbage', 'garbage', 'Uncleared garbage pile attracting flies', 'medium', 'open', NOW() - INTERVAL '4 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sitabuldi'),
    'Another garbage pile near the school gate at Sitabuldi, kids affected',
    'garbage', 'garbage', 'School gate garbage pile, affecting children', 'high', 'open', NOW() - INTERVAL '6 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sitabuldi'),
    'Blocked drainage near Sitabuldi market, water logging during rains',
    'drainage', 'drainage', 'Blocked drainage causing water logging', 'high', 'open', NOW() - INTERVAL '12 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sitabuldi'),
    'Third garbage accumulation spot near the bus stand, very unpleasant',
    'garbage', 'garbage', 'Bus stand garbage accumulation', 'medium', 'open', NOW() - INTERVAL '1 day'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sitabuldi'),
    'Streetlight at Govt Hospital road is completely out, emergency vehicle issue',
    'streetlight', 'streetlight', 'Out streetlight, emergency vehicle safety', 'high', 'open', NOW() - INTERVAL '2 hours'
  ),

  -- ===== GANDHIBAGH =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Gandhibagh'),
    'Pothole on Gandhibagh main road near HDFC bank, very deep',
    'pothole', 'pothole', 'Deep pothole near HDFC bank', 'high', 'open', NOW() - INTERVAL '3 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Gandhibagh'),
    'Broken divider line at Gandhibagh circle causing accidents',
    'encroachment', 'encroachment', 'Broken divider line, accident risk', 'medium', 'open', NOW() - INTERVAL '5 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Gandhibagh'),
    'Water logging spot near the petrol pump, persistent issue',
    'water', 'water', 'Water logging near petrol pump', 'medium', 'in_progress', NOW() - INTERVAL '8 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Gandhibagh'),
    'Streetlight at Chawni Chowk not working for 3 days',
    'streetlight', 'streetlight', 'Non-working streetlight for 3 days', 'medium', 'resolved', NOW() - INTERVAL '4 days'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Gandhibagh'),
    'Garbage pile near apartment society gate, need daily clearing',
    'garbage', 'garbage', 'Apartment gate garbage pile', 'low', 'open', NOW() - INTERVAL '6 hours'
  ),

  -- ===== LAXMI NAGAR =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Laxmi Nagar'),
    'Massive pothole on Laxmi Nagar main road, vehicle damage reported',
    'pothole', 'pothole', 'Massive main road pothole, vehicle damage', 'high', 'open', NOW() - INTERVAL '2 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Laxmi Nagar'),
    'Drainage blockage near St. Francis School, water overflow during rain',
    'drainage', 'drainage', 'School area drainage blockage', 'high', 'open', NOW() - INTERVAL '1 day'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Laxmi Nagar'),
    'Encroachment by vendor cart at major crossing, blocking pedestrian path',
    'encroachment', 'encroachment', 'Vendor cart blocking pedestrian path', 'medium', 'in_progress', NOW() - INTERVAL '4 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Laxmi Nagar'),
    'Streetlight pole broken at Laxmi Nagar Chowk, dangerous after sunset',
    'streetlight', 'streetlight', 'Broken streetlight pole at Chowk', 'medium', 'open', NOW() - INTERVAL '6 hours'
  ),

  -- ===== SADAR =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sadar'),
    'Old road patch at Sadar Bazar entrance has come off, tripping hazard',
    'pothole', 'pothole', 'Come-off road patch, tripping hazard', 'medium', 'open', NOW() - INTERVAL '3 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sadar'),
    'Garbage compaction vehicle not appearing for last week, piles growing',
    'garbage', 'garbage', 'No garbage collection service', 'high', 'open', NOW() - INTERVAL '12 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sadar'),
    'Water connection leak at Sadar main road, constant wet patch',
    'water', 'water', 'Water connection leak, persistent wet patch', 'medium', 'in_progress', NOW() - INTERVAL '5 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sadar'),
    'Streetlight at Collector office gate dark since yesterday evening',
    'streetlight', 'streetlight', 'Collector office gate streetlight dark', 'low', 'resolved', NOW() - INTERVAL '2 days'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Sadar'),
    'Broken bench at Sadar park area, rusted and unsafe'
  ),

  -- ===== MANEWADA =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Manewada'),
    'Huge pothole on the link road to Manewada, 3 feet wide',
    'pothole', 'pothole', '3-foot wide pothole on link road', 'high', 'open', NOW() - INTERVAL '4 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Manewada'),
    'No streetlight on the main road towards Nagpur Airport',
    'streetlight', 'streetlight', 'No streetlight towards airport road', 'medium', 'open', NOW() - INTERVAL '8 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Manewada'),
    'Garbage pile near Manewada gate area, needs cleaning',
    'garbage', 'garbage', 'Manewada gate garbage pile', 'medium', 'open', NOW() - INTERVAL '1 day'
  ),

  -- ===== NAKHPUR RURAL =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Nagpur Rural'),
    'Broken road surface near Rural Hospital, needs urgent repair',
    'pothole', 'pothole', 'Hospital road surface broken, urgent', 'high', 'open', NOW() - INTERVAL '6 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Nagpur Rural'),
    'Drainage clogged near the water treatment plant outlet',
    'drainage', 'drainage', 'Water plant outlet drainage clogged', 'high', 'in_progress', NOW() - INTERVAL '3 hours'
  ),

  -- ===== HINGNA =====
  (
    NULL, (SELECT id FROM wards WHERE name = 'Hingna'),
    'Pothole on Hingna bypass road, vehicle accident risk',
    'pothole', 'pothole', 'Bypass road pothole, accident risk', 'high', 'open', NOW() - INTERVAL '5 hours'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Hingna'),
    'Streetlight sequence broken between Hingna and Khurvada road'
  ),
  (
    NULL, (SELECT id FROM wards WHERE name = 'Hingna'),
    'Water supply intermittent, 4 hours with no water',
    'water', 'water', 'Intermittent water supply, 4 hrs dry', 'high', 'open', NOW() - INTERVAL '2 hours'
  )
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────
-- DEMO ACCOUNTS (create via Supabase Auth dashboard)
-- After creating these users, update their profiles below:
-- Admin: admin@nagpurpulse.in / password: Admin@123
-- Authority: authority@dharampeth.nagpur / password: Auth@123
-- ──────────────────────────────────────────────────────────────────────────

-- Get user IDs (requires users to exist in auth.users first)
-- After creating users in Supabase Auth dashboard, run:
-- INSERT INTO profiles (id, name, role, ward_id) VALUES (...)

-- ──────────────────────────────────────────────────────────────────────────
-- HOTSPOT PRE-UPDATES (will be auto-created by clustering on issue insert)
-- ──────────────────────────────────────────────────────────────────────────
-- Hotspot upsert queries (Member 4 will implement this in code):
-- INSERT INTO hotspots (ward_id, category, issue_count) VALUES (...)
-- ON CONFLICT (ward_id, category) DO UPDATE SET issue_count = EXCLUDED.issue_count;