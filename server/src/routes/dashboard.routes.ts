import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// ─────────────────────────────────────────────────
// GET /api/dashboard
// Public — citywide aggregated stats
// ─────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all issues (status + category + ward)
    const { data: issues, error: issuesError } = await supabaseAdmin
      .from('issues')
      .select('status, category, ward_id, created_at');

    if (issuesError) throw new Error(issuesError.message);

    // Fetch active hotspots count
    const { count: hotspotCount, error: hotspotError } = await supabaseAdmin
      .from('hotspots')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    if (hotspotError) throw new Error(hotspotError.message);

    // Fetch all wards
    const { data: wards, error: wardsError } = await supabaseAdmin
      .from('wards')
      .select('id, name, zone');

    if (wardsError) throw new Error(wardsError.message);

    // Compute city-level stats
    const total_issues = issues?.length ?? 0;
    const resolved = issues?.filter((i: any) => i.status === 'resolved').length ?? 0;
    const in_progress = issues?.filter((i: any) => i.status === 'in_progress').length ?? 0;
    const open = issues?.filter((i: any) => i.status === 'open').length ?? 0;
    const active_hotspots = hotspotCount ?? 0;
    const city_resolution_rate =
      total_issues > 0 ? Math.round((resolved / total_issues) * 1000) / 10 : 0;

    // Top 3 categories by volume
    const categoryCount: Record<string, number> = {};
    issues?.forEach((i: any) => {
      if (i.category) {
        categoryCount[i.category] = (categoryCount[i.category] ?? 0) + 1;
      }
    });
    const top_categories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    // Per-ward breakdown
    const ward_rankings = (wards ?? []).map((ward: any) => {
      const wi = issues?.filter((i: any) => i.ward_id === ward.id) ?? [];
      const wResolved = wi.filter((i: any) => i.status === 'resolved').length;
      const wTotal = wi.length;
      return {
        ward_id: ward.id,
        ward: ward.name,
        zone: ward.zone,
        open: wi.filter((i: any) => i.status === 'open').length,
        in_progress: wi.filter((i: any) => i.status === 'in_progress').length,
        resolved: wResolved,
        total: wTotal,
        resolution_rate:
          wTotal > 0 ? Math.round((wResolved / wTotal) * 1000) / 10 : 0,
      };
    }).sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      data: {
        total_issues,
        open,
        in_progress,
        resolved,
        active_hotspots,
        city_resolution_rate,
        top_categories,
        ward_rankings,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
