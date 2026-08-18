import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useHotspots } from '../hooks/useHotspots';
import { useWards } from '../hooks/useWards';
import { useIssues } from '../hooks/useIssues';
import { categoryColors, categoryLabels } from '../utils/categoryColors';

export default function HotspotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: hotspots, isLoading } = useHotspots();
  const { data: wards } = useWards();

  const hotspot = (hotspots ?? []).find((h: any) => h.id === id) || (hotspots ?? [])[0];
  const ward = (wards ?? []).find((w: any) => w.id === hotspot?.ward_id);

  // Fetch issues in this ward/category
  const { data: issueData } = useIssues({
    ward_id: hotspot?.ward_id,
    category: hotspot?.category,
    limit: '20',
  });
  const clusteredIssues = issueData?.issues ?? [];

  return (
    <AppLayout
      title="Hotspot Cluster Diagnostics"
      subtitle="AI-detected geographical density cluster requiring immediate civic escalation."
      role="citizen"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#fa5c1b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hotspot ? (
        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-8 text-center text-[#8B8FA8]">
          Hotspot not found or resolved.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-red-950/80 via-[#191b22] to-[#191b22] border border-red-800/80 rounded-xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Active Cluster Warning
                  </span>
                  <span className="text-xs font-mono text-[#8B8FA8]">Hotspot #{hotspot.id?.slice(0, 8)}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {ward?.name ?? 'Dharampeth'} — {categoryLabels[hotspot.category] ?? hotspot.category} Outbreak
                </h2>
                <p className="text-xs text-[#8B8FA8]">
                  Automated cluster triggered when 3+ concurrent reports occurred in this ward radius.
                </p>
              </div>

              <button
                onClick={() => navigate('/home')}
                className="bg-[#fa5c1b] hover:bg-[#d94a10] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">map</span>
                <span>View on Live Map</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
              <span className="text-xs font-mono text-[#8B8FA8] uppercase block mb-1">Report Density</span>
              <div className="text-3xl font-bold font-mono text-red-400">{hotspot.issue_count} Reports</div>
              <span className="text-[11px] font-mono text-[#8B8FA8] mt-1 block">Within 500m radius</span>
            </div>

            <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
              <span className="text-xs font-mono text-[#8B8FA8] uppercase block mb-1">Assigned Jurisdiction</span>
              <div className="text-2xl font-bold text-white truncate">{ward?.name ?? 'Dharampeth'}</div>
              <span className="text-[11px] font-mono text-[#fa5c1b] mt-1 block">{ward?.zone ?? 'Zone 1'}</span>
            </div>

            <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
              <span className="text-xs font-mono text-[#8B8FA8] uppercase block mb-1">Cluster Status</span>
              <div className="text-2xl font-bold text-amber-400 capitalize">{hotspot.status}</div>
              <span className="text-[11px] font-mono text-green-400 mt-1 block">NMC Crew Alerted</span>
            </div>
          </div>

          {/* Cluster Contributing Issues */}
          <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
            <div className="flex justify-between items-center border-b border-[#282a30] pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Cluster Contributing Incidents</h3>
              <span className="font-mono text-xs text-[#fa5c1b]">{clusteredIssues.length} Linked Issues</span>
            </div>

            <div className="divide-y divide-[#282a30]">
              {clusteredIssues.map((issue: any) => (
                <div
                  key={issue.id}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  className="py-3 flex justify-between items-center hover:bg-[#111319] px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoryColors[issue.category] ?? '#fa5c1b' }}
                      />
                      <span className="text-xs font-semibold text-white">
                        {categoryLabels[issue.category] ?? issue.category}
                      </span>
                      <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded uppercase">
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B8FA8] line-clamp-1">
                      {issue.ai_summary || issue.description}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#8B8FA8]">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
