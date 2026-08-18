import { supabaseAdmin } from '../config/supabase';

export class ClusteringService {
  private static readonly HOTSPOT_THRESHOLD = 3;
  private static readonly LOOKBACK_DAYS = 30;

  /**
   * After every issue insert: count same ward+category issues in last 30 days.
   * If >= 3 → upsert into hotspots table.
   * Never throws — clustering failure must not block issue creation.
   */
  static async checkAndUpdateHotspot(wardId: string, category: string): Promise<boolean> {
    try {
      const lookbackDate = new Date(
        Date.now() - this.LOOKBACK_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const { count, error: countError } = await supabaseAdmin
        .from('issues')
        .select('id', { count: 'exact', head: true })
        .eq('ward_id', wardId)
        .eq('category', category)
        .neq('status', 'resolved')
        .neq('status', 'flagged')
        .gte('created_at', lookbackDate);

      if (countError) throw countError;

      const issueCount = count ?? 0;

      if (issueCount >= this.HOTSPOT_THRESHOLD) {
        const { error: upsertError } = await supabaseAdmin
          .from('hotspots')
          .upsert(
            {
              ward_id: wardId,
              category,
              issue_count: issueCount,
              status: 'active',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'ward_id,category' }
          );

        if (upsertError) throw upsertError;

        console.log(`[Clustering] Hotspot triggered: ward=${wardId} category=${category} count=${issueCount}`);
        return true;
      }

      return false;
    } catch (err) {
      console.warn('[ClusteringService] checkAndUpdateHotspot failed (non-critical):', err);
      return false;
    }
  }

  /**
   * Mark a hotspot as resolved when all its issues are resolved
   */
  static async resolveHotspotIfDone(wardId: string, category: string): Promise<void> {
    try {
      const lookbackDate = new Date(
        Date.now() - this.LOOKBACK_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const { count } = await supabaseAdmin
        .from('issues')
        .select('id', { count: 'exact', head: true })
        .eq('ward_id', wardId)
        .eq('category', category)
        .eq('status', 'open')
        .gte('created_at', lookbackDate);

      if ((count ?? 0) === 0) {
        await supabaseAdmin
          .from('hotspots')
          .update({ status: 'resolved', updated_at: new Date().toISOString() })
          .eq('ward_id', wardId)
          .eq('category', category);
      }
    } catch (err) {
      console.warn('[ClusteringService] resolveHotspotIfDone failed (non-critical):', err);
    }
  }
}
