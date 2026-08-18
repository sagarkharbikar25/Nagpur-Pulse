export interface Issue {
  id: string;
  citizen_id: string;
  ward_id: string;
  description: string;
  category_hint: string | null;
  category: string | null;
  ai_summary: string | null;
  severity_hint: string | null;
  photo_url: string | null;
  photo_description: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'flagged';
  resolution_note: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  hotspot_id: string | null;
  created_at: string;
  updated_at: string;
  status_history?: Array<{
    id: string;
    old_status: string;
    new_status: string;
    note: string;
    changed_at: string;
  }>;
}

export interface IssueInsert {
  citizen_id: string;
  ward_id: string;
  description: string;
  category_hint?: string | null;
  category?: string | null;
  ai_summary?: string | null;
  severity_hint?: string | null;
  photo_url?: string | null;
  photo_description?: string | null;
  status?: 'open' | 'in_progress' | 'resolved' | 'flagged';
  resolution_note?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  hotspot_id?: string | null;
}

export interface IssueUpdate {
  description?: string;
  category_hint?: string | null;
  category?: string | null;
  ai_summary?: string | null;
  severity_hint?: string | null;
  photo_url?: string | null;
  photo_description?: string | null;
  status?: 'open' | 'in_progress' | 'resolved' | 'flagged';
  resolution_note?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  hotspot_id?: string | null;
}

export interface IssueFilters {
  ward_id?: string;
  category?: string;
  status?: string;
  citizen_id?: string;
  hotspot_id?: string;
  page?: number;
  limit?: number;
}