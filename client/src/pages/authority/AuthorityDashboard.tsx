import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useWards } from '../../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const { data: wards } = useWards();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resolutionNote] = useState<Record<string, string>>({});

  // Get current assigned ward
  const assignedWard = (wards ?? []).find((w: any) => w.id === user?.ward_id) ?? {
    name: 'Dharampeth Ward',
    latitude: 21.1458,
    longitude: 79.0882,
  };

  // Fetch ward data
  const { data: wardData, isLoading } = useQuery({
    queryKey: ['authority-ward-data', user?.ward_id],
    queryFn: async () => {
      if (!user?.ward_id) {
        // Fallback: fetch all issues for first ward
        const { data } = await api.get('/api/issues', { params: { limit: '50' } });
        return { hotspots: [], issues: data.data.issues ?? [] };
      }
      const { data } = await api.get(`/api/hotspots/${user.ward_id}`);
      return data.data;
    },
  });

  const hotspots = wardData?.hotspots ?? [];
  const issues = wardData?.issues ?? [];

  // Computed metrics
  const totalIssues = issues.length;
  const openIssues = issues.filter((i: any) => i.status === 'open').length;
  const highSeverity = issues.filter((i: any) => i.severity_hint === 'high' && i.status !== 'resolved').length;
  const activeHotspots = hotspots.length || (openIssues >= 3 ? 1 : 0);

  // Status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { data } = await api.patch(`/api/issues/${id}/status`, {
        status,
        resolution_note: note || `Updated by ${user?.name || 'Authority'}`,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authority-ward-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setUpdatingId(null);
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setUpdatingId(id);
    updateStatusMutation.mutate({
      id,
      status: newStatus,
      note: resolutionNote[id],
    });
  };

  return (
    <div className="bg-[#111319] text-[#e2e2eb] min-h-screen flex flex-col md:flex-row overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col py-6 w-72 h-screen fixed left-0 top-0 border-r border-[#282a30] bg-[#0c0e14] z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#fa5c1b]/20 border border-[#fa5c1b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#fa5c1b] text-lg">radar</span>
            </div>
            <span className="font-mono text-xs text-[#fa5c1b] font-bold tracking-wider uppercase">Nagpur Pulse</span>
          </div>
          <div className="text-xs text-[#8B8FA8]">Civic Intelligence Hub</div>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1">
          <button 
            onClick={() => navigate('/authority/dashboard')}
            className="flex items-center gap-3 bg-[#fa5c1b]/10 text-[#fa5c1b] border-r-4 border-[#fa5c1b] px-4 py-2.5 rounded-l text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>Ward Overview</span>
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-[#e2e2eb] px-4 py-2.5 rounded text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-lg">map</span>
            <span>Live City Map</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-[#e2e2eb] px-4 py-2.5 rounded text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-lg">analytics</span>
            <span>Public Analytics</span>
          </button>
        </nav>

        <div className="px-6 mt-auto space-y-4">
          <button 
            onClick={() => navigate('/submit')}
            className="w-full bg-[#fa5c1b] text-white font-mono text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d94a10] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Submit Report</span>
          </button>

          <div className="border-t border-[#282a30] pt-4 space-y-1">
            <div className="px-3 py-2 text-xs font-mono text-[#8B8FA8]">
              Logged as <strong className="text-white">{user?.name}</strong>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-red-400 px-3 py-2 rounded text-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#111319]/90 backdrop-blur-md border-b border-[#282a30] px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#e2e2eb]">{assignedWard.name}</h2>
            <p className="text-xs text-[#8B8FA8]">Ward specific statistics and live intelligence.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['authority-ward-data'] })}
              className="p-2 rounded-lg border border-[#282a30] text-[#8B8FA8] hover:text-[#fa5c1b] transition-colors bg-[#191b22]"
              title="Refresh Data"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#fa5c1b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Bento Grid KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3 text-[#8B8FA8]">
                    <span className="material-symbols-outlined text-base">report_problem</span>
                    <span className="font-mono text-xs uppercase">Total Issues</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-white">{totalIssues}</span>
                    <span className="text-xs font-mono text-green-400">Live</span>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3 text-[#8B8FA8]">
                    <span className="material-symbols-outlined text-base">pending_actions</span>
                    <span className="font-mono text-xs uppercase">Open</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-[#fa5c1b]">{openIssues}</span>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-[#191b22] border border-l-4 border-[#33343b] border-l-red-500 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3 text-red-400">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span className="font-mono text-xs uppercase">High Severity</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-red-400">{highSeverity}</span>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3 text-[#8B8FA8]">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span className="font-mono text-xs uppercase">Active Hotspots</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-amber-400">{activeHotspots}</span>
                  </div>
                </div>
              </div>

              {/* Map & AI Insight Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Map Section */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl lg:col-span-8 overflow-hidden relative h-[360px]">
                  <MapContainer
                    center={[assignedWard.latitude || 21.1458, assignedWard.longitude || 79.0882]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    />
                    {issues.map((issue: any, idx: number) => {
                      const lat = (assignedWard.latitude || 21.1458) + Math.sin(idx * 3.7) * 0.005;
                      const lng = (assignedWard.longitude || 79.0882) + Math.cos(idx * 2.3) * 0.005;
                      const color = categoryColors[issue.category] ?? '#fa5c1b';

                      return (
                        <CircleMarker
                          key={issue.id}
                          center={[lat, lng]}
                          radius={7}
                          pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
                        >
                          <Popup>
                            <div className="text-xs">
                              <strong>{categoryLabels[issue.category] ?? issue.category}</strong>
                              <p className="text-gray-600 mt-1">{issue.ai_summary ?? issue.description}</p>
                              <span className="text-[10px] font-mono mt-1 block uppercase text-orange-600">
                                Status: {statusLabels[issue.status] ?? issue.status}
                              </span>
                            </div>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>

                {/* AI Insight Box */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl lg:col-span-4 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#282a30] pb-3 mb-4">
                      <span className="material-symbols-outlined text-[#4ae176]">psychology</span>
                      <h3 className="text-base font-bold text-white">NVIDIA Civic AI Insight</h3>
                    </div>
                    <p className="text-sm text-[#8B8FA8] leading-relaxed mb-4">
                      {highSeverity > 0
                        ? `Critical safety clusters detected in ${assignedWard.name}. AI recommends immediate dispatch to arterial roads.`
                        : `Issues in ${assignedWard.name} are stabilizing. Resolution trajectory is on track.`}
                    </p>
                    <div className="bg-[#0c0e14] p-3 border border-[#282a30] rounded-lg text-xs font-mono text-[#ffb59c]">
                      Recommendation: Review open high-severity reports below and trigger status transitions.
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 w-full border border-[#33343b] text-white font-mono text-xs py-2 rounded-lg hover:bg-[#282a30] transition-colors"
                  >
                    View Citywide Metrics →
                  </button>
                </div>
              </div>

              {/* Recent Ward Issues Table */}
              <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-6">
                <div className="flex justify-between items-center border-b border-[#282a30] pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white">Ward Incident Queue</h3>
                  <span className="font-mono text-xs text-[#fa5c1b]">{issues.length} Total Reports</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282a30] text-xs font-mono text-[#8B8FA8]">
                        <th className="py-3 px-2">ID / DATE</th>
                        <th className="py-3 px-2">AI SUMMARY / TYPE</th>
                        <th className="py-3 px-2">STATUS</th>
                        <th className="py-3 px-2">SEVERITY</th>
                        <th className="py-3 px-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-[#282a30]">
                      {issues.slice(0, 15).map((issue: any) => (
                        <tr key={issue.id} className="hover:bg-[#1e1f26]/60 transition-colors">
                          <td className="py-3 px-2 font-mono text-xs text-[#8B8FA8]">
                            #{issue.id?.slice(0, 6)}
                            <span className="block text-[10px] text-gray-500">
                              {new Date(issue.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-medium text-[#e2e2eb]">
                              {categoryLabels[issue.category] ?? issue.category}
                            </div>
                            <div className="text-xs text-[#8B8FA8] truncate max-w-xs">
                              {issue.ai_summary ?? issue.description}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                              issue.status === 'resolved' ? 'bg-green-950/60 text-green-400 border border-green-800' :
                              issue.status === 'in_progress' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                              'bg-red-950/60 text-red-400 border border-red-800'
                            }`}>
                              {statusLabels[issue.status] ?? issue.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`font-mono text-xs uppercase font-bold ${
                              issue.severity_hint === 'high' ? 'text-red-400' :
                              issue.severity_hint === 'medium' ? 'text-amber-400' : 'text-green-400'
                            }`}>
                              {issue.severity_hint ?? 'MED'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {issue.status !== 'in_progress' && issue.status !== 'resolved' && (
                                <button
                                  onClick={() => handleStatusChange(issue.id, 'in_progress')}
                                  disabled={updatingId === issue.id}
                                  className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded text-xs font-mono hover:bg-amber-500/20 transition-colors"
                                >
                                  In Progress
                                </button>
                              )}
                              {issue.status !== 'resolved' && (
                                <button
                                  onClick={() => handleStatusChange(issue.id, 'resolved')}
                                  disabled={updatingId === issue.id}
                                  className="px-2.5 py-1 bg-green-500/10 border border-green-500/40 text-green-400 rounded text-xs font-mono hover:bg-green-500/20 transition-colors"
                                >
                                  ✓ Resolve
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/issues/${issue.id}`)}
                                className="px-2 py-1 text-[#8B8FA8] hover:text-white text-xs font-mono"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
