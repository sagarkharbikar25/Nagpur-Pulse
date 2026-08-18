import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
import { useIssues } from '../hooks/useIssues';
import { useHotspots } from '../hooks/useHotspots';
import { useDashboard } from '../hooks/useDashboard';
import { useWards } from '../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../utils/categoryColors';
import {
  CategoryCivicIcon,
  PotholeIcon,
  StreetlightIcon,
  WaterIcon,
  DrainageIcon,
  GarbageIcon,
  EncroachmentIcon,
  RadarIcon,
  MapLayersIcon,
} from '../components/icons/CivicIcons';

const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];
const CATEGORIES = ['pothole', 'streetlight', 'water', 'garbage', 'drainage', 'encroachment', 'other'] as const;

type MapLayerType = 'dark' | 'satellite' | 'streets';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [mapLayer, setMapLayer] = useState<MapLayerType>('dark');
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

  const { data: issueData, isLoading: issuesLoading } = useIssues(
    selectedCategory ? { category: selectedCategory, limit: '100' } : { limit: '100' }
  );
  const { data: hotspots } = useHotspots();
  const { data: dashboard } = useDashboard();
  const { data: wards } = useWards();

  const wardMap = Object.fromEntries(
    (wards ?? []).map((w: any) => [w.id, w])
  );

  const rawIssues = issueData?.issues ?? [];
  const issues = rawIssues;

  // Dynamic calculations for HUD strip
  const totalIssues = rawIssues.length;
  const resolvedCount = rawIssues.filter((i: any) => i.status === 'resolved').length;
  const openBacklogCount = rawIssues.filter((i: any) => i.status === 'open' || i.status === 'in_progress').length;
  const liveResolutionRate = totalIssues > 0 
    ? ((resolvedCount / totalIssues) * 100).toFixed(1) 
    : (dashboard?.city_resolution_rate ?? 78.4);
  const liveHotspotsCount = (hotspots ?? []).length || (dashboard?.active_hotspots ?? 1);

  const tileUrls: Record<MapLayerType, string> = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const getCategoryIconComponent = (cat: string) => {
    switch (cat) {
      case 'pothole': return <PotholeIcon size={15} color="#E85D04" />;
      case 'streetlight': return <StreetlightIcon size={15} color="#F59E0B" />;
      case 'water': return <WaterIcon size={15} color="#06B6D4" />;
      case 'drainage': return <DrainageIcon size={15} color="#0E7490" />;
      case 'garbage': return <GarbageIcon size={15} color="#65A30D" />;
      case 'encroachment': return <EncroachmentIcon size={15} color="#DC2626" />;
      default: return <RadarIcon size={15} color="#8B9BB4" />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0F141C] text-[#E6EDF3] flex flex-col relative font-sans selection:bg-[#E85D04] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-SCREEN HERO MAP CANVAS
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {issuesLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-[#0F141C]/75 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs text-[#8B9BB4] uppercase tracking-wider">Syncing Ward Telemetry...</span>
            </div>
          </div>
        )}

        <MapContainer
          center={NAGPUR_CENTER}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url={tileUrls[mapLayer]}
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Hotspot Cluster Radii */}
          {(hotspots ?? []).map((h: any) => {
            const ward = wardMap[h.ward_id] ?? h.wards;
            if (!ward?.latitude) return null;
            return (
              <Circle
                key={h.id}
                center={[ward.latitude, ward.longitude]}
                radius={850}
                pathOptions={{
                  color: '#D9534F',
                  fillColor: '#D9534F',
                  fillOpacity: 0.16,
                  weight: 2,
                  dashArray: '5 5',
                }}
              >
                <Popup>
                  <div className="p-2 font-sans text-xs">
                    <div className="flex items-center gap-1.5 text-[#D9534F] font-bold font-display uppercase tracking-wider text-[11px] mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#D9534F] animate-ping" />
                      <span>Active Hotspot Cluster</span>
                    </div>
                    <div className="font-bold text-gray-900 text-sm font-display">{ward.name} Ward</div>
                    <div className="text-gray-600 font-mono text-[11px] mt-0.5">
                      {categoryLabels[h.category] ?? h.category} · {h.issue_count} Cumulative Reports
                    </div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Incident Pins with Distinct Civic Color Fill */}
          {issues.map((issue: any, i: number) => {
            const ward = wardMap[issue.ward_id];
            if (!ward) return null;
            const scatter = 0.007;
            const lat = ward.latitude + (Math.sin(i * 7.3) * scatter);
            const lng = ward.longitude + (Math.cos(i * 5.1) * scatter);
            const color = categoryColors[issue.category] ?? '#E85D04';

            return (
              <CircleMarker
                key={issue.id}
                center={[lat, lng]}
                radius={7}
                pathOptions={{
                  color: '#0F141C',
                  fillColor: color,
                  fillOpacity: 0.95,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedIssue(issue),
                }}
              >
                <Popup>
                  <div className="p-1 text-xs font-sans text-gray-900">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <strong className="capitalize">{categoryLabels[issue.category] ?? issue.category}</strong>
                    </div>
                    <p className="text-[11px] text-gray-700 mb-2 line-clamp-2">{issue.description}</p>
                    <button
                      onClick={() => navigate(`/issues/${issue.id}`)}
                      className="w-full bg-[#E85D04] text-white text-[10px] font-mono font-bold py-1 px-2 rounded"
                    >
                      View Ticket Details →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING HUD HEADER (TOP TELEMETRY STRIP)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 px-4 pt-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Brand Node */}
        <div className="pointer-events-auto hud-panel px-3.5 py-2 flex items-center gap-3">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1B2432] border border-[#324259] p-1 flex items-center justify-center shrink-0 group-hover:border-[#E85D04] transition-colors">
              <img src="/nagpur-logo.png" alt="Nagpur Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                NAGPUR PULSE
              </span>
              <span className="text-[9px] font-mono text-[#8B9BB4] block uppercase tracking-wider">
                Civic Intelligence Radar
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Spatial Telemetry HUD Meters */}
        <div className="pointer-events-auto hud-panel px-4 py-2 hidden md:flex items-center gap-6 text-xs shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block">City Resolution</span>
            <span className="font-mono font-bold text-sm text-[#4EBA6F] tabular-nums">
              {liveResolutionRate}%
            </span>
          </div>
          <div className="h-6 w-px bg-[#263345]" />
          <div>
            <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block">Active Hotspots</span>
            <span className="font-mono font-bold text-sm text-[#D9534F] tabular-nums">
              {liveHotspotsCount} Clusters
            </span>
          </div>
          <div className="h-6 w-px bg-[#263345]" />
          <div>
            <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block">Open Backlog</span>
            <span className="font-mono font-bold text-sm text-[#E09F3E] tabular-nums">
              {openBacklogCount} Incidents
            </span>
          </div>
          <div className="h-6 w-px bg-[#263345]" />
          <div>
            <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block">Ward Coverage</span>
            <span className="font-mono font-bold text-sm text-white tabular-nums">
              8 Zones Active
            </span>
          </div>
        </div>

        {/* Action Controls & User Account Pill */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="hud-panel p-1 flex items-center text-xs font-mono shadow-md">
            <button
              onClick={() => setMapLayer('dark')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                mapLayer === 'dark' ? 'bg-[#E85D04] text-white font-bold shadow' : 'text-[#8B9BB4] hover:text-white'
              }`}
              title="Basalt Dark Radar"
            >
              <RadarIcon size={13} />
              <span className="hidden sm:inline">Radar</span>
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                mapLayer === 'satellite' ? 'bg-[#0E7490] text-white font-bold shadow' : 'text-[#8B9BB4] hover:text-white'
              }`}
              title="Satellite View"
            >
              <MapLayersIcon size={13} />
              <span className="hidden sm:inline">Satellite</span>
            </button>
          </div>

          {/* Report Issue Action */}
          <button
            onClick={() => navigate('/submit')}
            className="btn-primary text-xs font-display font-bold px-3.5 py-2 flex items-center gap-1.5 transition-all shadow-lg"
          >
            <span>+ Report Issue</span>
          </button>

          {/* User Profile Pill & Small Logout (Positioned Last) */}
          {user ? (
            <div className="hud-panel px-3 py-1.5 flex items-center gap-2.5 text-xs shadow-md">
              <div className="text-left">
                <span className="font-display font-bold text-white text-[11px] block leading-tight">
                  {user.name || 'Citizen User'}
                </span>
                <span className="font-mono text-[#8B9BB4] text-[9px] block leading-tight truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="text-[#D9534F] hover:text-red-300 font-mono text-[10px] font-bold bg-[#D9534F]/15 hover:bg-[#D9534F]/30 px-2 py-1 rounded transition-colors"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="hud-panel hover:border-[#E85D04] text-xs font-mono text-[#8B9BB4] hover:text-white px-3 py-2 transition-colors shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. FLOATING CATEGORY FILTER BAR (BOTTOM-CENTER HUD)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 pointer-events-none">
        <div className="pointer-events-auto hud-panel px-3 py-2 flex items-center gap-2 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#263345] shadow-2xl">
          {/* Category Pills with Real Custom SVG Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-[#E85D04] text-white shadow-md'
                  : 'bg-[#182230] text-[#8B9BB4] hover:text-white border border-[#263345]'
              }`}
            >
              All Types ({rawIssues.length})
            </button>

            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              const color = categoryColors[cat] ?? '#E85D04';
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#1F2A3C] text-white border-white/30 shadow-inner'
                      : 'bg-[#182230] text-[#8B9BB4] border-[#263345] hover:text-white hover:border-[#384C66]'
                  }`}
                >
                  {getCategoryIconComponent(cat)}
                  <span style={isSelected ? { color } : {}}>{categoryLabels[cat]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. SELECTED INCIDENT DRAWER (WHEN PIN CLICKED)
      ───────────────────────────────────────────────────────────── */}
      {selectedIssue && (
        <div className="absolute top-20 right-4 z-30 max-w-sm w-full hud-panel-elevated p-5 space-y-4 shadow-2xl animate-in fade-in slide-from-right-4 duration-200">
          <div className="flex items-start justify-between border-b border-[#263345] pb-3">
            <div className="flex items-center gap-2">
              <CategoryCivicIcon category={selectedIssue.category} size={20} color={categoryColors[selectedIssue.category]} />
              <div>
                <span className="font-display font-bold text-sm text-white capitalize block">
                  {categoryLabels[selectedIssue.category] ?? selectedIssue.category}
                </span>
                <span className="text-[10px] font-mono text-[#8B9BB4]">
                  {wardMap[selectedIssue.ward_id]?.name ?? 'Dharampeth'} Ward · #{selectedIssue.id?.slice(0, 8)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-[#8B9BB4] hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <div className="bg-[#151D28] border border-[#263345] rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#E85D04] uppercase font-bold block">
              AI Telemetry Classification
            </span>
            <p className="text-xs text-[#E6EDF3] leading-relaxed">
              {selectedIssue.ai_summary ?? selectedIssue.description}
            </p>
          </div>

          {/* Attached Photo Preview */}
          {selectedIssue.photo_url && (
            <div className="rounded-lg overflow-hidden border border-[#263345] bg-[#0F141C] h-32">
              <img
                src={selectedIssue.photo_url}
                alt="Damage Evidence"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedIssue.status === 'resolved'
                  ? 'bg-[#4EBA6F]/20 text-[#4EBA6F]'
                  : selectedIssue.status === 'in_progress'
                  ? 'bg-[#E09F3E]/20 text-[#E09F3E]'
                  : 'bg-[#D9534F]/20 text-[#D9534F]'
              }`}
            >
              {statusLabels[selectedIssue.status] ?? selectedIssue.status}
            </span>
            <button
              onClick={() => navigate(`/issues/${selectedIssue.id}`)}
              className="text-[#E85D04] hover:underline font-bold"
            >
              Full Details →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
