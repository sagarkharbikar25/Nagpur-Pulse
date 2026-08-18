import AppLayout from '../../components/layout/AppLayout';
import { useDashboard } from '../../hooks/useDashboard';
import { useHotspots } from '../../hooks/useHotspots';
import { categoryLabels } from '../../utils/categoryColors';

export default function AdminOverviewPage() {
  const { data: dashboard } = useDashboard();
  const { data: hotspots } = useHotspots();

  return (
    <AppLayout
      title="Municipal Executive Command Center"
      subtitle="Citywide intelligence telemetry, SLA enforcement, and municipal resource dispatch."
      role="admin"
    >
      {/* Citywide High-Level Bento KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <span className="text-[10px] font-mono text-[#8B8FA8] uppercase block mb-1">Total City Reports</span>
          <div className="text-3xl font-bold font-mono text-white">{dashboard?.total_issues ?? 30}</div>
          <span className="text-[10px] text-green-400 font-mono mt-1 block">8 Wards Live Tracking</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <span className="text-[10px] font-mono text-[#8B8FA8] uppercase block mb-1">City Resolution Rate</span>
          <div className="text-3xl font-bold font-mono text-green-400">
            {dashboard?.city_resolution_rate ?? 78}%
          </div>
          <span className="text-[10px] text-green-400 font-mono mt-1 block">Target SLA: 75%</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <span className="text-[10px] font-mono text-[#8B8FA8] uppercase block mb-1">Active AI Hotspots</span>
          <div className="text-3xl font-bold font-mono text-[#fa5c1b]">
            {dashboard?.active_hotspots ?? 2}
          </div>
          <span className="text-[10px] text-red-400 font-mono mt-1 block">Requires Commissioner Review</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <span className="text-[10px] font-mono text-[#8B8FA8] uppercase block mb-1">Municipal Field Crews</span>
          <div className="text-3xl font-bold font-mono text-amber-400">24 Crews</div>
          <span className="text-[10px] text-[#8B8FA8] font-mono mt-1 block">Across All 8 Zones</span>
        </div>
      </div>

      {/* Ward Performance Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#191b22] border border-[#33343b] rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#282a30] pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">City Ward Performance Leaderboard</h3>
              <span className="text-xs font-mono text-[#8B8FA8]">Ranked by Resolution Speed</span>
            </div>
            <button
              onClick={() => {
                const rows = [
                  ['Ward Name', 'Total Issues', 'Open Backlog', 'Resolution Rate (%)'],
                  ...(dashboard?.ward_leaderboard ?? [
                    { ward_name: 'Dharampeth', total_issues: 12, open: 2, resolution_rate: 87 },
                    { ward_name: 'Sitabuldi', total_issues: 8, open: 1, resolution_rate: 80 },
                    { ward_name: 'Sadar', total_issues: 6, open: 1, resolution_rate: 75 },
                    { ward_name: 'Laxmi Nagar', total_issues: 5, open: 2, resolution_rate: 72 },
                  ]).map((w: any) => [w.ward_name, w.total_issues, w.open, `${w.resolution_rate}%`]),
                ];
                const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `Nagpur_Pulse_SLA_Report_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-[#191b22] hover:bg-[#282a30] text-xs font-mono text-[#fa5c1b] border border-[#fa5c1b]/40 hover:border-[#fa5c1b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-xs">download</span>
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {(dashboard?.ward_leaderboard ?? [
              { ward_id: '1', ward_name: 'Dharampeth', resolution_rate: 87, total_issues: 12, open: 2 },
              { ward_id: '2', ward_name: 'Sitabuldi', resolution_rate: 80, total_issues: 8, open: 1 },
              { ward_id: '3', ward_name: 'Sadar', resolution_rate: 75, total_issues: 6, open: 1 },
              { ward_id: '4', ward_name: 'Laxmi Nagar', resolution_rate: 72, total_issues: 5, open: 2 },
            ]).map((ward: any, index: number) => (
              <div key={ward.ward_id} className="p-3.5 rounded-lg bg-[#111319] border border-[#282a30] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#fa5c1b] w-5">#{index + 1}</span>
                  <div>
                    <div className="font-semibold text-xs text-white">{ward.ward_name}</div>
                    <div className="text-[10px] font-mono text-[#8B8FA8]">{ward.total_issues} Total Reports</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-green-400">{ward.resolution_rate}%</span>
                    <span className="text-[10px] text-[#8B8FA8] block font-mono">Resolved</span>
                  </div>
                  <div className="w-24 bg-[#191b22] h-2 rounded-full overflow-hidden border border-[#282a30]">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${ward.resolution_rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots Overview */}
        <div className="lg:col-span-4 bg-[#191b22] border border-[#33343b] rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-[#282a30] pb-3">
            Active Spatial Hotspots
          </h3>

          <div className="space-y-3">
            {(hotspots ?? []).map((h: any) => (
              <div key={h.id} className="p-3.5 rounded-lg bg-red-950/40 border border-red-900/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-red-400 capitalize">
                    {categoryLabels[h.category] ?? h.category} Outbreak
                  </span>
                  <span className="text-[10px] font-mono text-white bg-red-800 px-2 py-0.5 rounded font-bold">
                    {h.issue_count} Reports
                  </span>
                </div>
                <p className="text-[11px] text-[#8B8FA8]">
                  Automated cluster triggered in ward jurisdiction. Crew dispatched.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
