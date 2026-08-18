import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useIssues } from '../../hooks/useIssues';
import { useWards } from '../../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';
import { CategoryCivicIcon } from '../../components/icons/CivicIcons';

export default function AuthorityLiveFeedPage() {
  const { user } = useAuth();
  const { data: wards } = useWards();
  const [wardFilter, setWardFilter] = useState<string>(user?.ward_id || '');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const { data: issueData, isLoading } = useIssues({
    ward_id: wardFilter || undefined,
    limit: '50',
  });

  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w.name]));
  const issues = issueData?.issues ?? [];

  return (
    <AppLayout
      title="Municipal Authority Live Activity Feed"
      subtitle="Real-time incident ingestion stream, status audit changes, and officer dispatches."
      role="authority"
    >
      {/* Lightbox Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="hud-panel-elevated max-w-xl w-full p-4 space-y-3 cursor-default" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#263345] pb-2">
              <span className="font-display font-bold text-sm text-white">Citizen Incident Photo</span>
              <button onClick={() => setPreviewPhoto(null)} className="text-[#8B9BB4] hover:text-white font-mono text-sm">✕</button>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-lg bg-[#0F141C] flex items-center justify-center">
              <img src={previewPhoto} alt="Evidence Preview" className="max-h-[70vh] w-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      <div className="hud-panel p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4EBA6F] animate-ping" />
          <span className="text-xs font-mono text-white font-bold">OFFICIAL WARD FEED STREAM</span>
          <span className="text-xs font-mono text-[#8B9BB4]">({issues.length} Items)</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-mono text-[#8B9BB4]">Ward Scope:</label>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-[#0F141C] border border-[#263345] text-xs font-mono text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E85D04]"
          >
            <option value="">All Wards (Citywide)</option>
            {(wards ?? []).map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue: any) => {
            const color = categoryColors[issue.category] ?? '#E85D04';
            const wardName = wardMap[issue.ward_id] ?? 'Dharampeth';

            return (
              <div
                key={issue.id}
                className="hud-panel p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#E85D04] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Photo Thumbnail if present */}
                  {issue.photo_url && (
                    <div 
                      onClick={() => setPreviewPhoto(issue.photo_url)}
                      className="w-16 h-16 rounded-lg overflow-hidden border border-[#263345] bg-[#0F141C] shrink-0 cursor-pointer hover:border-[#E85D04] transition-all hover:scale-105"
                      title="Click to view photo"
                    >
                      <img src={issue.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CategoryCivicIcon category={issue.category} size={15} color={color} />
                      <span className="text-xs font-display font-bold text-white">
                        {categoryLabels[issue.category] ?? issue.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#8B9BB4]">
                        in <strong className="text-white">{wardName}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
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
                    <p className="text-xs text-[#8B9BB4] line-clamp-1">{issue.ai_summary || issue.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-[#8B9BB4] whitespace-nowrap self-end md:self-center">
                  <span>{new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[#E85D04] bg-[#0F141C] px-2.5 py-1 rounded border border-[#263345]">
                    #{issue.id?.slice(0, 8)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
