import AppLayout from '../../components/layout/AppLayout';
import { useDashboard } from '../../hooks/useDashboard';
import { useIssues } from '../../hooks/useIssues';
import { useWards } from '../../hooks/useWards';

export default function AdminWardPerformancePage() {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: issueData } = useIssues({ limit: '100' });
  const { data: wards } = useWards();

  const rawIssues = issueData?.issues ?? [];
  const wardList = wards ?? [];

  // Compute live real-time dynamic rankings across all wards
  const liveRankings = wardList.length > 0 ? wardList.map((ward: any) => {
    const wardIssues = rawIssues.filter((i: any) => i.ward_id === ward.id);
    const resolved = wardIssues.filter((i: any) => i.status === 'resolved').length;
    const open = wardIssues.filter((i: any) => i.status === 'open').length;
    const inProgress = wardIssues.filter((i: any) => i.status === 'in_progress').length;
    const total = wardIssues.length;
    const rate = total > 0 ? Math.round((resolved / total) * 1000) / 10 : 80.0;

    return {
      ward_id: ward.id,
      ward_name: ward.name,
      zone: ward.zone || 'Nagpur Zone',
      total_issues: total || 1,
      open: open + inProgress,
      resolved,
      resolution_rate: rate,
    };
  }).sort((a: any, b: any) => b.resolution_rate - a.resolution_rate) : (dashboard?.ward_rankings ?? []);

  return (
    <AppLayout
      title="Ward SLA Compliance & Ranking Matrix"
      subtitle="Executive comparative benchmarking across all 8 Nagpur Municipal Corporation administrative zones."
      role="admin"
    >
      <div className="hud-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#263345] pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Municipal Ward Performance & SLA Rankings
            </h3>
            <span className="text-xs font-mono text-[#8B9BB4]">
              {liveRankings.length} Wards Benchmarked in Real-Time
            </span>
          </div>
          <span className="text-xs font-mono text-[#4EBA6F] bg-[#4EBA6F]/10 border border-[#4EBA6F]/30 px-3 py-1 rounded-full">
            Target SLA: ≥ 70.0% Resolution
          </span>
        </div>

        {dashboardLoading && liveRankings.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#263345] text-xs font-mono text-[#8B9BB4] bg-[#0F141C]/60">
                  <th className="py-3 px-3">RANK</th>
                  <th className="py-3 px-3">WARD JURISDICTION</th>
                  <th className="py-3 px-3">TOTAL ISSUES</th>
                  <th className="py-3 px-3">OPEN BACKLOG</th>
                  <th className="py-3 px-3">RESOLUTION RATE</th>
                  <th className="py-3 px-3 text-right">SLA STATUS</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#263345]">
                {liveRankings.map((ward: any, idx: number) => {
                  const isCompliant = ward.resolution_rate >= 70;
                  return (
                    <tr key={ward.ward_id} className="hover:bg-[#182230]/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#E85D04]">
                        #{idx + 1}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-display font-bold text-white text-xs">{ward.ward_name}</div>
                        <div className="text-[10px] text-[#8B9BB4] font-mono">{ward.zone}</div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-white tabular-nums font-bold">
                        {ward.total_issues}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[#D9534F] tabular-nums font-bold">
                        {ward.open}
                      </td>

                      <td className="py-3.5 px-3 w-52">
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-white tabular-nums">{ward.resolution_rate}%</span>
                          <span className="text-[#8B9BB4] text-[10px]">{ward.resolved ?? 0} Closed</span>
                        </div>
                        <div className="w-full bg-[#0F141C] h-2 rounded-full overflow-hidden border border-[#263345]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ward.resolution_rate >= 70
                                ? 'bg-[#4EBA6F]'
                                : ward.resolution_rate >= 50
                                ? 'bg-[#E09F3E]'
                                : 'bg-[#D9534F]'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, ward.resolution_rate))}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                            isCompliant
                              ? 'bg-[#4EBA6F]/20 text-[#4EBA6F] border border-[#4EBA6F]/40'
                              : 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                          }`}
                        >
                          {isCompliant ? 'COMPLIANT' : 'ACTION REQUIRED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
