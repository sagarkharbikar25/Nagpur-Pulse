import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// ─────────────────────────────────────────────────
// GET /api/hotspots
// Public — all active hotspots with ward info
// ─────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('hotspots')
      .select(`
        *,
        wards (
          id,
          name,
          zone,
          latitude,
          longitude
        )
      `)
      .eq('status', 'active')
      .order('issue_count', { ascending: false });

    if (error) throw new Error(error.message);

    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────
// GET /api/hotspots/:ward_id
// Authority only — ward-scoped hotspots + clustered issues
// ─────────────────────────────────────────────────
router.get(
  '/:ward_id',
  authenticate,
  authorizeRole(['authority', 'admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ward_id } = req.params;

      const { data: hotspots, error: hotspotError } = await supabaseAdmin
        .from('hotspots')
        .select('*')
        .eq('ward_id', ward_id)
        .eq('status', 'active')
        .order('issue_count', { ascending: false });

      if (hotspotError) throw new Error(hotspotError.message);

      const { data: issues, error: issueError } = await supabaseAdmin
        .from('issues')
        .select('*')
        .eq('ward_id', ward_id)
        .neq('status', 'resolved')
        .neq('status', 'flagged')
        .order('created_at', { ascending: false });

      if (issueError) throw new Error(issueError.message);

      res.json({
        success: true,
        data: { hotspots, issues },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
