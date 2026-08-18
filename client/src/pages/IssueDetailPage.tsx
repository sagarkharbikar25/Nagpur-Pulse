import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { categoryColors, categoryLabels, statusLabels } from '../utils/categoryColors';
import { AIEngineIcon, CategoryCivicIcon } from '../components/icons/CivicIcons';

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
      <div className="min-h-screen bg-[#0F141C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-[#0F141C] text-[#8B9BB4] flex flex-col items-center justify-center gap-3">
        <p className="font-mono text-sm">Issue not found in municipal registry.</p>
        <button 
          onClick={() => navigate('/home')} 
          className="btn-primary text-xs font-mono font-bold px-4 py-2"
        >
          ← Return to Live Map
        </button>
      </div>
    );
  }

  const color = categoryColors[issue.category] ?? '#E85D04';
  const statusHistory = data?.status_history ?? [];

  return (
    <div className="min-h-screen bg-[#0F141C] text-[#E6EDF3] px-4 py-8 selection:bg-[#E85D04] selection:text-white font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/home')}
            className="text-xs font-mono text-[#8B9BB4] hover:text-[#E85D04] flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Live Map</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('✓ Issue link copied to clipboard!');
              }}
              className="hud-panel hover:border-[#E85D04] text-xs font-mono text-[#E6EDF3] px-3 py-1.5 transition-all flex items-center gap-1.5"
            >
              <span>🔗 Share</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary text-xs font-mono font-bold px-3 py-1.5 flex items-center gap-1.5 shadow-md"
            >
              <span>🧾 Print Ticket</span>
            </button>
          </div>
        </div>

        {/* Main Incident Card */}
        <div className="hud-panel-elevated p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#263345] pb-4">
            <div className="flex items-center gap-3">
              <CategoryCivicIcon category={issue.category} size={20} color={color} />
              <div>
                <span className="font-display font-bold text-base text-white">
                  {categoryLabels[issue.category] ?? issue.category}
                </span>
                <span className="text-xs font-mono text-[#8B9BB4] block">#{issue.id?.slice(0, 8)}</span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                issue.status === 'resolved'
                  ? 'bg-[#4EBA6F]/20 text-[#4EBA6F] border border-[#4EBA6F]/40'
                  : issue.status === 'in_progress'
                  ? 'bg-[#E09F3E]/20 text-[#E09F3E] border border-[#E09F3E]/40'
                  : 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
              }`}
            >
              {statusLabels[issue.status] ?? issue.status}
            </span>
          </div>

          {/* AI Summary Banner */}
          {issue.ai_summary && (
            <div className="bg-[#0F141C] border border-[#E85D04]/40 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <AIEngineIcon size={16} color="#E85D04" />
                <span className="font-display font-bold text-xs text-[#E85D04] uppercase">
                  NVIDIA Nemotron AI Classification
                </span>
              </div>
              <p className="text-xs font-mono text-[#E6EDF3] leading-relaxed">
                {issue.ai_summary}
              </p>
            </div>
          )}

          {/* Citizen Description */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8B9BB4] uppercase font-bold block">
              Citizen Description
            </span>
            <div className="p-4 bg-[#0F141C] border border-[#263345] rounded-xl text-xs text-[#E6EDF3] leading-relaxed">
              {issue.description}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#263345] text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#8B9BB4] uppercase block">Severity Rating</span>
              <span className="font-bold text-[#E09F3E] capitalize">
                {issue.severity || 'Medium'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8B9BB4] uppercase block">Submitted Date</span>
              <span className="font-bold text-white">
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8B9BB4] uppercase block">Official SLA</span>
              <span className="font-bold text-[#4EBA6F]">48 Hours Target</span>
            </div>
          </div>

          {/* Attached Incident Photo */}
          {issue.photo_url && (
            <div className="space-y-2 pt-2 border-t border-[#263345]">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase font-bold block">
                Attached Incident Photo
              </span>
              <div className="rounded-xl overflow-hidden border border-[#263345] bg-[#0F141C] max-h-96 flex items-center justify-center">
                <img
                  src={issue.photo_url}
                  alt="Incident Evidence"
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Status Timeline */}
          {statusHistory.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#263345]">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase font-bold block">
                Audit Timeline & Status Transitions
              </span>
              <div className="space-y-2">
                {statusHistory.map((entry: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono bg-[#0F141C] p-2.5 rounded-lg border border-[#263345]">
                    <span className="text-white capitalize">{entry.status}</span>
                    <span className="text-[#8B9BB4]">{new Date(entry.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
