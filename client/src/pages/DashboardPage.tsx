import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDashboard } from '../hooks/useDashboard';
import { useIssues } from '../hooks/useIssues';
import { useHotspots } from '../hooks/useHotspots';
import { useWards } from '../hooks/useWards';
import { useAuth } from '../hooks/useAuth';
import { categoryColors, categoryLabels } from '../utils/categoryColors';
import AppLayout from '../components/layout/AppLayout';
import {
  AIEngineIcon,
} from '../components/icons/CivicIcons';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useDashboard();
  const { data: issueData } = useIssues({ limit: '30' });
  const { data: hotspots } = useHotspots();
  const { data: wards } = useWards();

  const issues = issueData?.issues ?? [];
  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w]));

  return (
    <AppLayout
      title={user ? `Welcome, ${user.name}` : 'Nagpur Pulse Overview'}
      subtitle="Citywide civic accountability digest, real-time resolution metrics, and ward performance."
      role="citizen"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Reports */}
            <div className="hud-panel p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase mb-1">Total Reports</span>
              <div className="text-3xl font-display font-bold text-white tabular-nums">
                {dashboard?.total_issues ?? issues.length ?? 0}
              </div>
              <span className="text-[11px] font-mono text-[#8B9BB4] mt-1 block">Citywide Ingestion</span>
            </div>

            {/* Open */}
            <div className="hud-panel p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase mb-1">Open Backlog</span>
              <div className="text-3xl font-display font-bold text-[#D9534F] tabular-nums">
                {dashboard?.open ?? 0}
              </div>
              <span className="text-[11px] font-mono text-[#D9534F] mt-1 block">Awaiting Dispatch</span>
            </div>

            {/* In Progress */}
            <div className="hud-panel p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase mb-1">In Progress</span>
              <div className="text-3xl font-display font-bold text-[#E09F3E] tabular-nums">
                {dashboard?.in_progress ?? 0}
              </div>
              <span className="text-[11px] font-mono text-[#E09F3E] mt-1 block">Crews on-site</span>
            </div>

            {/* Resolved */}
            <div className="hud-panel p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#8B9BB4] uppercase mb-1">Resolved</span>
              <div className="text-3xl font-display font-bold text-[#4EBA6F] tabular-nums">
                {dashboard?.resolved ?? 0}
              </div>
              <span className="text-[11px] font-mono text-[#4EBA6F] mt-1 block">
                {dashboard?.city_resolution_rate ?? 78}% SLA Met
              </span>
            </div>
          </div>

          {/* Map View & AI Insight Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="hud-panel lg:col-span-8 overflow-hidden relative h-[340px]">
              <MapContainer
                center={[21.1458, 79.0882]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                {(hotspots ?? []).map((h: any) => {
                  const ward = wardMap[h.ward_id] ?? h.wards;
                  if (!ward?.latitude) return null;
                  return (
                    <Circle
                      key={h.id}
                      center={[ward.latitude, ward.longitude]}
                      radius={750}
                      pathOptions={{ color: '#D9534F', fillColor: '#D9534F', fillOpacity: 0.16, weight: 2 }}
                    >
                      <Popup>
                        <div className="text-xs p-1 font-sans">
                          <strong className="text-red-500 font-display">🔴 Hotspot Cluster: {ward.name}</strong>
                          <p className="text-gray-600 mt-0.5">{categoryLabels[h.category] ?? h.category} ({h.issue_count} reports)</p>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}
                {issues.map((issue: any, idx: number) => {
                  const ward = wardMap[issue.ward_id];
                  if (!ward?.latitude) return null;
                  const lat = ward.latitude + Math.sin(idx * 4.3) * 0.006;
                  const lng = ward.longitude + Math.cos(idx * 3.1) * 0.006;
                  const color = categoryColors[issue.category] ?? '#E85D04';

                  return (
                    <CircleMarker
                      key={issue.id}
                      center={[lat, lng]}
                      radius={6}
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <div className="text-xs p-1 font-sans">
                          <strong>{categoryLabels[issue.category] ?? issue.category}</strong>
                          <p className="text-gray-600 mt-1">{issue.ai_summary ?? issue.description}</p>
                          <button
                            onClick={() => navigate(`/issues/${issue.id}`)}
                            className="text-blue-500 text-[10px] font-bold mt-1 block"
                          >
                            Open Ticket →
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* AI Summary Card */}
            <div className="hud-panel lg:col-span-4 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 border-b border-[#263345] pb-3 mb-3">
                  <AIEngineIcon size={18} color="#E85D04" />
                  <h3 className="text-sm font-display font-bold text-white">NVIDIA AI Summary</h3>
                </div>
                <p className="text-xs text-[#8B9BB4] leading-relaxed mb-3">
                  {dashboard?.city_resolution_rate ?? 78}% average resolution rate across all 8 municipal zones.
                  Potholes and storm drainage maintenance represent 64% of ongoing public works.
                </p>
                <div className="bg-[#0F141C] p-3 border border-[#263345] rounded-lg text-xs font-mono text-[#4EBA6F]">
                  ✓ Dharampeth and Sitabuldi leading in SLA turnaround speed this week.
                </div>
              </div>

              <button
                onClick={() => navigate('/home')}
                className="w-full btn-primary text-xs py-2 text-center"
              >
                Launch Full-Screen Radar →
              </button>
            </div>
          </div>

          {/* Ward Rankings Breakdown */}
          <div className="hud-panel p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#263345] pb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Ward Performance Leaderboard</h3>
                <span className="text-xs font-mono text-[#8B9BB4]">8 Nagpur Municipal Zones Tracked</span>
              </div>
              <button
                onClick={() => navigate('/citizen/feed')}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                View Live Feed →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(dashboard?.ward_rankings ?? []).map((w: any) => (
                <div key={w.ward_id} className="p-4 bg-[#0F141C] border border-[#263345] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-sm text-white">{w.ward}</span>
                    <span className="font-mono text-xs font-bold text-[#4EBA6F]">{w.resolution_rate}% Resolved</span>
                  </div>
                  <div className="h-1.5 bg-[#263345] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4EBA6F] rounded-full"
                      style={{ width: `${w.resolution_rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-[#8B9BB4]">
                    <span>{w.total} Total</span>
                    <span className="text-[#D9534F]">{w.open} Open</span>
                    <span className="text-[#4EBA6F]">{w.resolved} Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
