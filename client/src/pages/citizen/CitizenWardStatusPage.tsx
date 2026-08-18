import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import { useWards } from '../../hooks/useWards';
import { useIssues } from '../../hooks/useIssues';
import api from '../../services/api';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';

export default function CitizenWardStatusPage() {
  const { data: wards, isLoading: wardsLoading } = useWards();
  const [selectedWardId, setSelectedWardId] = useState<string>('');

  const currentWardId = selectedWardId || wards?.[0]?.id || '';
  const currentWard = (wards ?? []).find((w: any) => w.id === currentWardId);

  // Fetch ward stats
  const { data: wardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['ward-stats', currentWardId],
    queryFn: async () => {
      if (!currentWardId) return null;
      const { data } = await api.get(`/api/wards/${currentWardId}/stats`);
      return data.data;
    },
    enabled: !!currentWardId,
  });

  // Fetch ward issues
  const { data: issueData } = useIssues({ ward_id: currentWardId, limit: '20' });
  const issues = issueData?.issues ?? [];

  return (
    <AppLayout
      title="Ward Status & Diagnostics"
      subtitle="Detailed civic performance metrics and issue resolution tracking by ward."
      role="citizen"
    >
      {/* Ward Selector Bar */}
      <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#fa5c1b] uppercase tracking-wider block">
            SELECTED JURISDICTION
          </span>
          <h2 className="text-xl font-bold text-white">
            {currentWard?.name || 'Loading Ward...'} ({currentWard?.zone || 'Zone 1'})
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-mono text-[#8B8FA8] whitespace-nowrap">Switch Ward:</label>
          <select
            value={currentWardId}
            onChange={(e) => setSelectedWardId(e.target.value)}
            className="bg-[#111319] border border-[#33343b] text-xs font-mono text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa5c1b] w-full sm:w-48"
            disabled={wardsLoading}
          >
            {(wards ?? []).map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#fa5c1b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Bento KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Ward Performance Score */}
            <div className="md:col-span-4 bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-[#8B8FA8] uppercase">Resolution Score</span>
                <span className="material-symbols-outlined text-[#fa5c1b] text-xl">speed</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold font-mono text-[#fa5c1b]">
                  {wardStats?.resolution_rate ?? 78}%
                </span>
                <span className="text-xs text-[#8B8FA8] font-mono">Resolved</span>
              </div>
              <div className="w-full bg-[#111319] h-2 rounded-full overflow-hidden border border-[#282a30]">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-full rounded-full"
                  style={{ width: `${wardStats?.resolution_rate ?? 78}%` }}
                />
              </div>
              <p className="text-[11px] text-green-400 font-mono mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>Active citizen monitoring</span>
              </p>
            </div>

            {/* Total Active Issues */}
            <div className="md:col-span-4 bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-[#8B8FA8] uppercase">Open / In Progress</span>
                <span className="material-symbols-outlined text-amber-400 text-xl">pending_actions</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-amber-400">
                  {(wardStats?.open ?? 0) + (wardStats?.in_progress ?? 0)}
                </span>
                <span className="text-xs text-[#8B8FA8] font-mono">Incidents</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-[#8B8FA8] pt-3 border-t border-[#282a30]">
                <span>Open: <strong className="text-red-400">{wardStats?.open ?? 0}</strong></span>
                <span>In Progress: <strong className="text-amber-400">{wardStats?.in_progress ?? 0}</strong></span>
              </div>
            </div>

            {/* Resolved Counter */}
            <div className="md:col-span-4 bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-[#8B8FA8] uppercase">Total Resolved</span>
                <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-green-400">
                  {wardStats?.resolved ?? 0}
                </span>
                <span className="text-xs text-[#8B8FA8] font-mono">Completed</span>
              </div>
              <div className="text-[11px] font-mono text-[#8B8FA8] pt-3 border-t border-[#282a30]">
                Total Lifetime Reports: <strong className="text-white">{wardStats?.total_issues ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* Category Breakdown & Recent Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Breakdown */}
            <div className="lg:col-span-4 bg-[#191b22] border border-[#33343b] rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-[#282a30] pb-3">
                Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(wardStats?.category_breakdown ?? {
                  pothole: 4,
                  water: 3,
                  streetlight: 2,
                  garbage: 2,
                }).map(([cat, count]: [string, any]) => {
                  const color = categoryColors[cat] ?? '#fa5c1b';
                  const label = categoryLabels[cat] ?? cat;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-[#e2e2eb]">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          {label}
                        </span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                      <div className="w-full bg-[#111319] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: color,
                            width: `${Math.min(100, (count / (wardStats?.total_issues || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ward Issues List */}
            <div className="lg:col-span-8 bg-[#191b22] border border-[#33343b] rounded-xl p-5">
              <div className="flex justify-between items-center border-b border-[#282a30] pb-3 mb-4">
                <h3 className="font-bold text-sm text-white">Active Ward Reports</h3>
                <span className="font-mono text-xs text-[#fa5c1b]">{issues.length} Items</span>
              </div>

              {issues.length === 0 ? (
                <div className="text-center py-10 text-[#8B8FA8] text-xs font-mono">
                  No active issues recorded in {currentWard?.name}.
                </div>
              ) : (
                <div className="divide-y divide-[#282a30]">
                  {issues.map((issue: any) => (
                    <div key={issue.id} className="py-3 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: categoryColors[issue.category] ?? '#fa5c1b' }}
                          />
                          <span className="text-xs font-semibold text-white">
                            {categoryLabels[issue.category] ?? issue.category}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            issue.status === 'resolved' ? 'text-green-400 bg-green-950/40' :
                            issue.status === 'in_progress' ? 'text-amber-400 bg-amber-950/40' :
                            'text-red-400 bg-red-950/40'
                          }`}>
                            {statusLabels[issue.status] ?? issue.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B8FA8] line-clamp-1">
                          {issue.ai_summary ?? issue.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#8B8FA8] whitespace-nowrap">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
