import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useIssues } from '../../hooks/useIssues';
import { useWards } from '../../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';
import { CategoryCivicIcon } from '../../components/icons/CivicIcons';

export default function AdminLiveFeedPage() {
  const { data: wards } = useWards();
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const { data: issueData, isLoading } = useIssues({
    ward_id: selectedWard || undefined,
    limit: '100',
  });

  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w.name]));
  const issues = issueData?.issues ?? [];

  return (
    <AppLayout
      title="Citywide Municipal Telemetry Feed"
      subtitle="Complete transparent event stream of all citizen submissions, AI summaries, and contractor milestones."
      role="admin"
    >
      {/* Photo Lightbox Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="hud-panel-elevated max-w-xl w-full p-4 space-y-3 cursor-default" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#263345] pb-2">
              <span className="font-display font-bold text-sm text-white">Citizen Photo Evidence</span>
              <button onClick={() => setPreviewPhoto(null)} className="text-[#8B9BB4] hover:text-white font-mono text-sm">✕</button>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-lg bg-[#0F141C] flex items-center justify-center">
              <img src={previewPhoto} alt="Evidence Full Preview" className="max-h-[70vh] w-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="hud-panel p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E85D04] animate-ping" />
          <span className="text-xs font-mono text-white font-bold">NAGPUR MASTER FEED</span>
          <span className="text-xs font-mono text-[#8B9BB4]">({issues.length} Events)</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-[#8B9BB4]">Filter Jurisdiction:</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-[#0F141C] border border-[#263345] text-xs font-mono text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E85D04]"
          >
            <option value="">All 8 Municipal Wards</option>
            {(wards ?? []).map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="hud-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#263345] text-xs font-mono text-[#8B9BB4] bg-[#0F141C]/80">
                  <th className="py-3 px-4">INCIDENT ID</th>
                  <th className="py-3 px-4">CATEGORY & AI SUMMARY</th>
                  <th className="py-3 px-4">EVIDENCE PHOTO</th>
                  <th className="py-3 px-4">WARD</th>
                  <th className="py-3 px-4">TIME</th>
                  <th className="py-3 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#263345]">
                {issues.map((issue: any) => {
                  const color = categoryColors[issue.category] ?? '#E85D04';
                  const wardName = wardMap[issue.ward_id] ?? 'Dharampeth';

                  return (
                    <tr key={issue.id} className="hover:bg-[#182230]/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#E85D04]">
                        #{issue.id?.slice(0, 8)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CategoryCivicIcon category={issue.category} size={15} color={color} />
                          <span className="font-display font-bold text-white">
                            {categoryLabels[issue.category] ?? issue.category}
                          </span>
                        </div>
                        <p className="text-[#8B9BB4] text-[11px] line-clamp-1">
                          {issue.ai_summary || issue.description}
                        </p>
                      </td>

                      {/* Photo Evidence Column */}
                      <td className="py-3 px-4">
                        {issue.photo_url ? (
                          <div 
                            onClick={() => setPreviewPhoto(issue.photo_url)}
                            className="w-12 h-12 rounded-lg overflow-hidden border border-[#263345] bg-[#0F141C] cursor-pointer hover:border-[#E85D04] transition-all hover:scale-105 group relative"
                            title="Click to zoom photo"
                          >
                            <img src={issue.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-mono">
                              🔍
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#8B9BB4]/60">No Photo</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-white">{wardName}</td>
                      <td className="py-3 px-4 font-mono text-[#8B9BB4] whitespace-nowrap">
                        {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            issue.status === 'resolved'
                              ? 'bg-[#4EBA6F]/20 text-[#4EBA6F] border border-[#4EBA6F]/40'
                              : issue.status === 'in_progress'
                              ? 'bg-[#E09F3E]/20 text-[#E09F3E] border border-[#E09F3E]/40'
                              : 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                          }`}
                        >
                          {statusLabels[issue.status] ?? issue.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
