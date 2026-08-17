import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDashboard } from '../hooks/useDashboard';
import { useIssues } from '../hooks/useIssues';
import { useHotspots } from '../hooks/useHotspots';
import { useWards } from '../hooks/useWards';
import { useAuth } from '../hooks/useAuth';
import { categoryColors, categoryLabels } from '../utils/categoryColors';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: dashboard, isLoading } = useDashboard();
  const { data: issueData } = useIssues({ limit: '30' });
  const { data: hotspots } = useHotspots();
  const { data: wards } = useWards();

  const issues = issueData?.issues ?? [];
  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w]));

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
          <div className="text-xs text-[#8B8FA8]">Civic Intelligence Portal</div>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 bg-[#4ae176]/10 text-[#4ae176] border-r-4 border-[#4ae176] px-4 py-2.5 rounded-l text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>City Overview</span>
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-[#e2e2eb] px-4 py-2.5 rounded text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-lg">map</span>
            <span>Live Map & Hotspots</span>
          </button>
          <button 
            onClick={() => navigate('/submit')}
            className="flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-[#e2e2eb] px-4 py-2.5 rounded text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Report Civic Issue</span>
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

          {user ? (
            <div className="border-t border-[#282a30] pt-4 space-y-1">
              <div className="px-3 py-2 text-xs font-mono text-[#8B8FA8]">
                {user.email}
              </div>
              <button 
                onClick={signOut}
                className="w-full flex items-center gap-3 text-[#8B8FA8] hover:bg-[#191b22] hover:text-red-400 px-3 py-2 rounded text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="w-full border border-[#33343b] text-[#e2e2eb] font-mono text-xs py-2 rounded-lg hover:bg-[#191b22] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#111319]/90 backdrop-blur-md border-b border-[#282a30] px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#e2e2eb]">
              {user ? `Welcome, ${user.name}` : 'Nagpur Pulse Dashboard'}
            </h2>
            <p className="text-xs text-[#8B8FA8]">Here is your civic accountability digest for today.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/submit')}
              className="btn-primary text-xs font-mono px-4 py-2 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Report Issue</span>
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="btn-secondary text-xs font-mono px-4 py-2 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>View Map</span>
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
              {/* KPI Bento Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Reports */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-xs font-mono text-[#8B8FA8] uppercase mb-2">Total Reports</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-white">{dashboard?.total_issues ?? 0}</span>
                    <span className="material-symbols-outlined text-[#8B8FA8]">folder_open</span>
                  </div>
                </div>

                {/* Open */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-xs font-mono text-[#8B8FA8] uppercase mb-2">Open</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-[#fa5c1b]">{dashboard?.open ?? 0}</span>
                    <span className="material-symbols-outlined text-[#fa5c1b]">pending</span>
                  </div>
                </div>

                {/* In Progress */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-xs font-mono text-[#8B8FA8] uppercase mb-2">In Progress</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-amber-400">{dashboard?.in_progress ?? 0}</span>
                    <span className="material-symbols-outlined text-amber-400">autorenew</span>
                  </div>
                </div>

                {/* Resolved */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 flex flex-col justify-between">
                  <div className="text-xs font-mono text-[#8B8FA8] uppercase mb-2">Resolved</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-green-400">{dashboard?.resolved ?? 0}</span>
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                  </div>
                </div>

                {/* AI Insight Box */}
                <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 col-span-2 lg:col-span-1 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 mb-2">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>AI INSIGHT</span>
                  </div>
                  <p className="text-xs text-[#8B8FA8] leading-tight">
                    {dashboard?.city_resolution_rate}% citywide resolution rate across 8 wards.
                  </p>
                </div>
              </div>

              {/* Map View */}
              <div className="bg-[#191b22] border border-[#33343b] rounded-xl overflow-hidden relative h-[320px]">
                <MapContainer
                  center={[21.1458, 79.0882]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  {(hotspots ?? []).map((h: any) => {
                    const ward = wardMap[h.ward_id] ?? h.wards;
                    if (!ward?.latitude) return null;
                    return (
                      <Circle
                        key={h.id}
                        center={[ward.latitude, ward.longitude]}
                        radius={700}
                        pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.15, weight: 2 }}
                      >
                        <Popup>
                          <div className="text-xs">
                            <strong className="text-red-600">🔴 Hotspot: {ward.name}</strong>
                            <p>{categoryLabels[h.category] ?? h.category} ({h.issue_count} reports)</p>
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
                    const color = categoryColors[issue.category] ?? '#fa5c1b';

                    return (
                      <CircleMarker
                        key={issue.id}
                        center={[lat, lng]}
                        radius={6}
                        pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}
                      >
                        <Popup>
                          <div className="text-xs">
                            <strong>{categoryLabels[issue.category] ?? issue.category}</strong>
                            <p className="text-gray-600 mt-1">{issue.ai_summary ?? issue.description}</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>

              {/* Ward Rankings Breakdown */}
              <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-6">
                <div className="flex justify-between items-center border-b border-[#282a30] pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white">Ward Performance Leaderboard</h3>
                  <span className="font-mono text-xs text-[#8B8FA8]">8 Nagpur Wards Tracked</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(dashboard?.ward_rankings ?? []).map((w: any) => (
                    <div key={w.ward_id} className="p-4 bg-[#111319] border border-[#282a30] rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-white">{w.ward}</span>
                        <span className="font-mono text-xs font-bold text-green-400">{w.resolution_rate}% Resolved</span>
                      </div>
                      <div className="h-1.5 bg-[#282a30] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
                          style={{ width: `${w.resolution_rate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-mono text-[#8B8FA8]">
                        <span>{w.total} Total</span>
                        <span className="text-red-400">{w.open} Open</span>
                        <span className="text-green-400">{w.resolved} Resolved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
