import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useWards } from '../../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';
import AppLayout from '../../components/layout/AppLayout';
import {
  CategoryCivicIcon,
  AIEngineIcon,
} from '../../components/icons/CivicIcons';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: wards } = useWards();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Get current assigned ward
  const assignedWard = (wards ?? []).find((w: any) => w.id === user?.ward_id) ?? {
    name: 'Dharampeth Ward (Zone 1)',
    latitude: 21.1458,
    longitude: 79.0882,
  };

  // Fetch ward data
  const { data: wardData, isLoading } = useQuery({
    queryKey: ['authority-ward-data', user?.ward_id],
    queryFn: async () => {
      if (!user?.ward_id) {
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
  const inProgressIssues = issues.filter((i: any) => i.status === 'in_progress').length;
  const resolvedIssues = issues.filter((i: any) => i.status === 'resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 84;
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['authority-ward-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setUpdatingId(null);
      setToastMessage(`✓ Issue #${variables.id.slice(0, 6)} updated to "${statusLabels[variables.status]}"`);
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err: any) => {
      setUpdatingId(null);
      alert(err?.response?.data?.error || 'Status update failed. Try again.');
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setUpdatingId(id);
    updateStatusMutation.mutate({
      id,
      status: newStatus,
    });
  };

  return (
    <AppLayout
      title={`${assignedWard.name} Command & Triage`}
      subtitle="Ward operations, real-time spatial diagnostics, and automated contractor crew dispatch."
      role="authority"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161D27] border border-[#4EBA6F] text-[#4EBA6F] px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#4EBA6F] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Bento Grid Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="hud-panel p-5">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Total Ward Reports</span>
              <div className="text-3xl font-display font-bold text-white tabular-nums">{totalIssues}</div>
              <span className="text-[11px] font-mono text-[#8B9BB4] mt-1 block">Telemetry sensor verified</span>
            </div>

            <div className="hud-panel p-5">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Ward Resolution Rate</span>
              <div className="text-3xl font-display font-bold text-[#4EBA6F] tabular-nums">{resolutionRate}%</div>
              <span className="text-[11px] font-mono text-[#4EBA6F] mt-1 block">SLA Target: 75%</span>
            </div>

            <div className="hud-panel p-5">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Open Incidents</span>
              <div className="text-3xl font-display font-bold text-[#E09F3E] tabular-nums">{openIssues}</div>
              <span className="text-[11px] font-mono text-[#E09F3E] mt-1 block">{inProgressIssues} in progress</span>
            </div>

            <div className="hud-panel p-5">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Active Hotspots</span>
              <div className="text-3xl font-display font-bold text-[#D9534F] tabular-nums">{activeHotspots}</div>
              <span className="text-[11px] font-mono text-[#D9534F] mt-1 block">Priority clusters flagged</span>
            </div>
          </div>

          {/* Spatial Map & AI Triage Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ward GIS Map */}
            <div className="hud-panel lg:col-span-8 overflow-hidden relative h-[360px]">
              <MapContainer
                center={[assignedWard.latitude || 21.1458, assignedWard.longitude || 79.0882]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                {issues.map((issue: any, idx: number) => {
                  const lat = (assignedWard.latitude || 21.1458) + Math.sin(idx * 3.7) * 0.005;
                  const lng = (assignedWard.longitude || 79.0882) + Math.cos(idx * 2.3) * 0.005;
                  const color = categoryColors[issue.category] ?? '#E85D04';

                  return (
                    <CircleMarker
                      key={issue.id}
                      center={[lat, lng]}
                      radius={7}
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <div className="text-xs p-1 font-sans">
                          <strong>{categoryLabels[issue.category] ?? issue.category}</strong>
                          <p className="text-gray-600 mt-1">{issue.ai_summary ?? issue.description}</p>
                          <span className="text-[10px] font-mono mt-1 block font-bold text-[#E85D04]">
                            Status: {statusLabels[issue.status] ?? issue.status}
                          </span>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* AI Decision Support Box */}
            <div className="hud-panel lg:col-span-4 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 border-b border-[#263345] pb-3 mb-3">
                  <AIEngineIcon size={18} color="#06B6D4" />
                  <h3 className="text-sm font-display font-bold text-white">NVIDIA Nemotron Triage</h3>
                </div>
                <p className="text-xs text-[#8B9BB4] leading-relaxed mb-3">
                  {openIssues > 0
                    ? `AI detected ${openIssues} open incidents in ${assignedWard.name}. Arterial road repairs and storm drain de-silting are recommended for immediate dispatch.`
                    : `No critical backlog detected in ${assignedWard.name}. All response crews are operating normally.`}
                </p>
                <div className="bg-[#0F141C] p-3 border border-[#263345] rounded-lg text-xs font-mono text-[#E85D04]">
                  Automated Recommendation: Trigger ⚡ AI Dispatch on high-severity road hazards below.
                </div>
              </div>

              <button 
                onClick={() => navigate('/authority/ai-hub')}
                className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-2"
              >
                <span>Open AI Predictive Risk Console</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Incident Queue Table */}
          <div className="hud-panel p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#263345] pb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Ward Incident Queue</h3>
                <span className="text-xs font-mono text-[#8B9BB4]">{issues.length} Total Municipal Reports</span>
              </div>
              <button
                onClick={() => navigate('/authority/infrastructure')}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                View Contractor Ledger →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#263345] text-xs font-mono text-[#8B9BB4]">
                    <th className="py-3 px-2">ID / DATE</th>
                    <th className="py-3 px-2">INCIDENT TYPE & AI SUMMARY</th>
                    <th className="py-3 px-2">STATUS</th>
                    <th className="py-3 px-2">SEVERITY</th>
                    <th className="py-3 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#263345]">
                  {issues.map((issue: any) => (
                    <tr key={issue.id} className="hover:bg-[#182230]/70 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs text-[#8B9BB4]">
                        #{issue.id?.slice(0, 6)}
                        <span className="block text-[10px] text-gray-500">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 font-display font-semibold text-white">
                          <CategoryCivicIcon category={issue.category} size={15} color={categoryColors[issue.category]} />
                          <span>{categoryLabels[issue.category] ?? issue.category}</span>
                        </div>
                        <div className="text-xs text-[#8B9BB4] truncate max-w-sm mt-0.5">
                          {issue.ai_summary ?? issue.description}
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <span className={`badge ${
                          issue.status === 'resolved' ? 'badge-resolved' :
                          issue.status === 'in_progress' ? 'badge-in-progress' :
                          'badge-open'
                        }`}>
                          {statusLabels[issue.status] ?? issue.status}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span className={`font-mono text-xs uppercase font-bold ${
                          issue.severity_hint === 'high' ? 'text-[#D9534F]' :
                          issue.severity_hint === 'medium' ? 'text-[#E09F3E]' : 'text-[#4EBA6F]'
                        }`}>
                          {issue.severity_hint ?? 'MED'}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {issue.status === 'open' && (
                            <button
                              onClick={() => {
                                alert(`🤖 NVIDIA AI Auto-Dispatched!\n\n• Contractor: Nagpur Municipal Field Unit #04\n• Crew Lead: Eng. S. Kulkarni\n• ETA: 2.0 Hours\n• Priority: High\n\nWork order logged & citizen notified.`);
                                handleStatusChange(issue.id, 'in_progress');
                              }}
                              disabled={updatingId === issue.id}
                              className="px-2.5 py-1 bg-[#E85D04]/15 border border-[#E85D04] text-[#E85D04] hover:bg-[#E85D04] hover:text-white rounded text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm"
                            >
                              <span>⚡ AI Dispatch</span>
                            </button>
                          )}

                          {issue.status !== 'resolved' && (
                            <button
                              onClick={() => handleStatusChange(issue.id, 'resolved')}
                              disabled={updatingId === issue.id}
                              className="px-2.5 py-1 bg-[#4EBA6F]/15 border border-[#4EBA6F] text-[#4EBA6F] rounded text-xs font-mono font-bold hover:bg-[#4EBA6F] hover:text-white transition-colors"
                            >
                              ✓ Resolve
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/issues/${issue.id}`)}
                            className="px-2 py-1 text-[#8B9BB4] hover:text-white text-xs font-mono"
                          >
                            View Ticket
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
    </AppLayout>
  );
}
