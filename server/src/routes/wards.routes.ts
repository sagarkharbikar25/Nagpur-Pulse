import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// ─────────────────────────────────────────────────
// GET /api/wards
// Public — all wards with coordinates
// ─────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('wards')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);

    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────
// GET /api/wards/:id/stats
// Public — aggregated stats for a single ward
// ─────────────────────────────────────────────────
router.get('/:id/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data: ward, error: wardError } = await supabaseAdmin
      .from('wards')
      .select('*')
      .eq('id', id)
      .single();

    if (wardError || !ward) {
      return res.status(404).json({ success: false, data: null, error: 'Ward not found' });
    }

    const { data: issues, error: issuesError } = await supabaseAdmin
      .from('issues')
      .select('status, category')
      .eq('ward_id', id);

    if (issuesError) throw new Error(issuesError.message);

    const total = issues?.length ?? 0;
    const open = issues?.filter((i: any) => i.status === 'open').length ?? 0;
    const in_progress = issues?.filter((i: any) => i.status === 'in_progress').length ?? 0;
    const resolved = issues?.filter((i: any) => i.status === 'resolved').length ?? 0;
    const resolution_rate = total > 0
      ? Math.round((resolved / total) * 1000) / 10
      : 0;

    const category_breakdown: Record<string, number> = {};
    issues?.forEach((i: any) => {
      if (i.category) {
        category_breakdown[i.category] = (category_breakdown[i.category] ?? 0) + 1;
      }
    });

    res.json({
      success: true,
      data: {
        ward_id: id,
        ward_name: ward.name,
        zone: ward.zone,
        latitude: ward.latitude,
        longitude: ward.longitude,
        total_issues: total,
        open,
        in_progress,
        resolved,
        resolution_rate,
        category_breakdown,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
