import { supabaseAnon, supabaseAdmin } from '../config/supabase';
import type { Issue, IssueInsert, IssueFilters } from '../types/issue.types';

// Core CRUD operations for issues service
export class IssuesService {
  /**
   * Create a new issue
   */
  static async createIssue(data: IssueInsert): Promise<Issue> {
    const { data: issue, error } = await supabaseAdmin
      .from('issues')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }

    return issue;
  }

  /**
   * Get issues with optional filters and pagination
   */
  static async getIssues(filters: IssueFilters = {}): Promise<{ issues: Issue[]; count: number }> {
    let query = supabaseAnon.from('issues').select('*', { count: 'exact' });

    // Apply filters
    if (filters.ward_id) {
      query = query.eq('ward_id', filters.ward_id);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.citizen_id) {
      query = query.eq('citizen_id', filters.citizen_id);
    }
    if (filters.hotspot_id) {
      query = query.eq('hotspot_id', filters.hotspot_id);
    }

    // Apply pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch issues: ${error.message}`);
    }

    return { issues: data ?? [], count: count ?? 0 };
  }

  /**
   * Get a single issue by ID with status history
   */
  static async getIssueById(id: string): Promise<Issue & { status_history: any[] }> {
    const { data, error } = await supabaseAnon
      .from('issues')
      .select(`
        *,
        status_history:status_history(
          id,
          old_status,
          new_status,
          note,
          changed_at,
          profiles!status_history_changed_by_fkey(id, name, role)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch issue: ${error.message}`);
    }

    if (!data) {
      throw new Error('Issue not found');
    }

    return data;
  }

  /**
   * Update issue status and create status history record
   */
  static async updateIssueStatus(
    id: string,
    status: string,
    resolution_note: string | null,
    actorId: string
  ): Promise<Issue> {
    // First get current issue to verify it exists and get old status
    const currentIssue = await this.getIssueById(id);

    // Update the issue
    const { data: updatedIssue, error: updateError } = await supabaseAdmin
      .from('issues')
      .update({
        status,
        resolution_note,
        resolved_by: status === 'resolved' ? actorId : null,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update issue status: ${updateError.message}`);
    }

    // Create status history record
    const { error: historyError } = await supabaseAdmin
      .from('status_history')
      .insert({
        issue_id: id,
        changed_by: actorId,
        old_status: currentIssue.status,
        new_status: status,
        note: resolution_note || `Status changed to ${status}`
      });

    if (historyError) {
      // Log but don't fail the operation - status history is audit trail
      console.warn('Failed to create status history record:', historyError);
    }

    return updatedIssue;
  }

  /**
   * Get hotspot count for a ward and category (used by clustering service)
   */
  static async getHotspotCount(wardId: string, category: string): Promise<number> {
    const { data, error } = await supabaseAnon
      .from('issues')
      .select('id', { count: 'exact' })
      .eq('ward_id', wardId)
      .eq('category', category)
      .neq('status', 'resolved')
      .neq('status', 'flagged');

    if (error) {
      throw new Error(`Failed to get hotspot count: ${error.message}`);
    }

    return data?.length ?? 0;
  }

  /**
   * Update hotspot issue count (called by clustering logic)
   */
  static async updateHotspotCount(wardId: string, category: string, count: number): Promise<void> {
    const { error } = await supabaseAdmin
      .from('hotspots')
      .upsert(
        { ward_id: wardId, category, issue_count: count },
        { onConflict: 'ward_id,category' }
      );

    if (error) {
      throw new Error(`Failed to update hotspot count: ${error.message}`);
    }
  }
}