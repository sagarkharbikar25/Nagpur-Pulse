import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useIssues } from '../hooks/useIssues';
import { useHotspots } from '../hooks/useHotspots';
import { useDashboard } from '../hooks/useDashboard';
import { useWards } from '../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../utils/categoryColors';

const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];
const CATEGORIES = ['pothole', 'streetlight', 'water', 'garbage', 'drainage', 'encroachment', 'other'];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { data: issueData, isLoading: issuesLoading } = useIssues(
    selectedCategory ? { category: selectedCategory, limit: '100' } : { limit: '100' }
  );
  const { data: hotspots } = useHotspots();
  const { data: dashboard } = useDashboard();
  const { data: wards } = useWards();

  // Build ward coordinate map for approximate issue placement
  const wardMap = Object.fromEntries(
    (wards ?? []).map((w: any) => [w.id, w])
  );

  const issues = issueData?.issues ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">🚦</span>
          <span className="text-text-high font-bold text-lg">Nagpur Pulse</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary text-sm px-4 py-2">
            Dashboard
          </button>
          <button onClick={() => navigate('/submit')} className="btn-primary text-sm px-4 py-2">
            + Report Issue
          </button>
        </div>
      </nav>

      {/* Stat bar */}
      <div className="bg-surface border-b border-border px-6 py-3 flex flex-wrap items-center gap-6 shrink-0">
        <p className="text-text-muted text-xs italic">"Every ward. Every issue. Visible."</p>
        <div className="flex gap-6 ml-auto">
          <Stat label="Total Issues" value={dashboard?.total_issues ?? '—'} color="text-text-high" />
          <Stat label="Resolved" value={dashboard?.city_resolution_rate ? `${dashboard.city_resolution_rate}%` : '—'} color="text-success" />
          <Stat label="Active Hotspots" value={dashboard?.active_hotspots ?? '—'} color="text-danger" />
          <Stat label="Open" value={dashboard?.open ?? '—'} color="text-warning" />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-6 py-3 flex gap-2 flex-wrap bg-background border-b border-border shrink-0">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !selectedCategory ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text-high'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedCategory === cat
                ? 'text-white border-transparent'
                : 'bg-surface text-text-muted border-border hover:text-text-high'
            }`}
            style={selectedCategory === cat ? { backgroundColor: categoryColors[cat] } : {}}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {issuesLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <MapContainer
          center={NAGPUR_CENTER}
          zoom={12}
          style={{ height: '100%', width: '100%', minHeight: '500px' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Hotspot circles */}
          {(hotspots ?? []).map((h: any) => {
            const ward = wardMap[h.ward_id] ?? h.wards;
            if (!ward?.latitude) return null;
            return (
              <Circle
                key={h.id}
                center={[ward.latitude, ward.longitude]}
                radius={800}
                pathOptions={{
                  color: '#EF4444',
                  fillColor: '#EF4444',
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: '6 4',
                }}
              >
                <Popup>
                  <div className="text-sm font-semibold text-red-600">
                    🔴 HOTSPOT: {ward.name}<br />
                    {categoryLabels[h.category] ?? h.category} — {h.issue_count} reports
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Issue pins */}
          {issues.map((issue: any, i: number) => {
            const ward = wardMap[issue.ward_id];
            if (!ward) return null;
            // Scatter pins slightly around ward center
            const scatter = 0.008;
            const lat = ward.latitude + (Math.sin(i * 7.3) * scatter);
            const lng = ward.longitude + (Math.cos(i * 5.1) * scatter);
            const color = categoryColors[issue.category] ?? '#6B7280';

            return (
              <CircleMarker
                key={issue.id}
                center={[lat, lng]}
                radius={7}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="min-w-48 text-sm">
                    <div className="font-semibold mb-1" style={{ color }}>
                      {categoryLabels[issue.category] ?? issue.category}
                    </div>
                    <div className="text-gray-700 mb-2 leading-snug">
                      {issue.ai_summary ?? issue.description?.slice(0, 100)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-700'
                        : issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {statusLabels[issue.status] ?? issue.status}
                      </span>
                      <button
                        onClick={() => navigate(`/issues/${issue.id}`)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <div className={`font-mono font-bold text-lg ${color}`}>{value}</div>
      <div className="text-text-muted text-xs">{label}</div>
    </div>
  );
}
