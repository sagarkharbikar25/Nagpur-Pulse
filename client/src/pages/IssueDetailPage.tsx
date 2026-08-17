import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { categoryColors, categoryLabels, statusLabels } from '../utils/categoryColors';

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/issues/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const issue = data?.issue ?? data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text-muted">
        Issue not found.{' '}
        <button onClick={() => navigate('/home')} className="text-primary ml-2 hover:underline">
          ← Back to map
        </button>
      </div>
    );
  }

  const color = categoryColors[issue.category] ?? '#6B7280';
  const statusHistory = data?.status_history ?? [];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-text-muted text-sm hover:text-text-high mb-6 flex items-center gap-1">
          ← Back
        </button>

        <div className="card mb-4">
          {/* Category + Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-semibold text-text-high">
                {categoryLabels[issue.category] ?? issue.category}
              </span>
            </div>
            <span className={`badge ${
              issue.status === 'resolved' ? 'badge-resolved' :
              issue.status === 'in_progress' ? 'badge-in-progress' : 'badge-open'
            }`}>
              {statusLabels[issue.status] ?? issue.status}
            </span>
          </div>

          {/* AI Summary */}
          {issue.ai_summary && (
            <div className="bg-surface-high border border-border rounded-lg px-4 py-3 mb-4">
              <p className="text-text-muted text-xs uppercase tracking-wide mb-1">🤖 AI Summary</p>
              <p className="text-text-high text-sm leading-relaxed">{issue.ai_summary}</p>
            </div>
          )}

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed mb-4">{issue.description}</p>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 text-sm border-t border-border pt-4">
            <MetaRow label="Severity" value={issue.severity_hint?.toUpperCase() ?? '—'} />
            <MetaRow label="Submitted" value={new Date(issue.created_at).toLocaleDateString()} />
            {issue.resolution_note && (
              <div className="col-span-2">
                <MetaRow label="Resolution Note" value={issue.resolution_note} />
              </div>
            )}
          </div>

          {/* Photo */}
          {issue.photo_url && (
            <div className="mt-4">
              <img src={issue.photo_url} alt="Issue photo" className="rounded-lg w-full object-cover max-h-64" />
              {issue.photo_description && (
                <p className="text-text-muted text-xs mt-2 italic">📷 {issue.photo_description}</p>
              )}
            </div>
          )}
        </div>

        {/* Status Timeline */}
        {statusHistory.length > 0 && (
          <div className="card">
            <h3 className="text-text-high font-semibold mb-4">Status Timeline</h3>
            <div className="space-y-3">
              {statusHistory.map((h: any) => (
                <div key={h.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-text-high text-sm">
                      <span className="font-semibold">{statusLabels[h.old_status] ?? h.old_status}</span>
                      {' → '}
                      <span className="font-semibold text-primary">{statusLabels[h.new_status] ?? h.new_status}</span>
                    </p>
                    {h.note && <p className="text-text-muted text-xs mt-0.5">{h.note}</p>}
                    <p className="text-text-muted text-xs mt-0.5">
                      {new Date(h.changed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-text-muted text-xs uppercase tracking-wide">{label}</p>
      <p className="text-text-high font-medium">{value}</p>
    </div>
  );
}
