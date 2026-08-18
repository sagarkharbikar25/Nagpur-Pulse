import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useIssues } from '../../hooks/useIssues';
import { useWards } from '../../hooks/useWards';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';

export default function CitizenLiveFeedPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'open' | 'urgent' | 'resolved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: issueData, isLoading } = useIssues({ limit: '50' });
  const { data: wards } = useWards();

  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w.name]));
  const rawIssues = issueData?.issues ?? [];

  const filteredIssues = rawIssues.filter((issue: any) => {
    if (filter === 'open' && issue.status !== 'open') return false;
    if (filter === 'urgent' && issue.severity_hint !== 'high') return false;
    if (filter === 'resolved' && issue.status !== 'resolved') return false;
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    return true;
  });

  return (
    <AppLayout
      title="Live Civic Feed"
      subtitle="Real-time stream of citizen incident reports across Nagpur."
      role="citizen"
    >
      {/* Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feed Stream */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-3 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-[#fa5c1b] text-white shadow-md shadow-orange-950/40'
                    : 'bg-[#111319] text-[#8B8FA8] hover:text-white border border-[#282a30]'
                }`}
              >
                All Reports
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1 ${
                  filter === 'urgent'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#111319] text-red-400 hover:bg-red-950/30 border border-red-950/60'
                }`}
              >
                <span className="material-symbols-outlined text-xs">warning</span>
                <span>Urgent</span>
              </button>
              <button
                onClick={() => setFilter('open')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  filter === 'open'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#111319] text-amber-400 hover:bg-amber-950/30 border border-amber-950/60'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  filter === 'resolved'
                    ? 'bg-green-600 text-white'
                    : 'bg-[#111319] text-green-400 hover:bg-green-950/30 border border-green-950/60'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#111319] border border-[#282a30] text-xs font-mono text-[#e2e2eb] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#fa5c1b]"
            >
              <option value="all">All Categories</option>
              <option value="pothole">Potholes</option>
              <option value="streetlight">Streetlights</option>
              <option value="water">Water Supply</option>
              <option value="garbage">Garbage</option>
              <option value="drainage">Drainage</option>
              <option value="encroachment">Encroachment</option>
            </select>
          </div>

          {/* Issue Cards */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#fa5c1b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-8 text-center text-[#8B8FA8]">
              No reports matching your active filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue: any) => {
                const color = categoryColors[issue.category] ?? '#fa5c1b';
                const wardName = wardMap[issue.ward_id] ?? 'Nagpur Central';

                return (
                  <article
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className="bg-[#191b22] border border-[#33343b] hover:border-[#fa5c1b] rounded-xl p-5 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-sm text-white">
                          {categoryLabels[issue.category] ?? issue.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            issue.status === 'resolved'
                              ? 'bg-green-950/60 text-green-400 border border-green-800/60'
                              : issue.status === 'in_progress'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                              : 'bg-red-950/60 text-red-400 border border-red-800/60'
                          }`}
                        >
                          {statusLabels[issue.status] ?? issue.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8B8FA8]">
                        {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* AI Summary */}
                    {issue.ai_summary && (
                      <p className="text-xs text-[#ffb59c] font-medium mb-2 bg-[#111319] p-2.5 rounded border border-[#282a30] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#fa5c1b]">psychology</span>
                        <span>{issue.ai_summary}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#8B8FA8] leading-relaxed line-clamp-2 mb-3">
                      {issue.description}
                    </p>

                    {/* Photo preview if present */}
                    {issue.photo_url && (
                      <div className="mb-3 rounded-lg overflow-hidden h-36 w-full border border-[#282a30] bg-[#111319]">
                        <img
                          src={issue.photo_url}
                          alt="Incident Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-mono text-[#8B8FA8] border-t border-[#282a30] pt-3">
                      <div className="flex items-center gap-1 text-[#fa5c1b]">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{wardName}</span>
                      </div>
                      <span className="text-gray-500">#{issue.id?.slice(0, 8)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Digest & Hotspot Alerts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
            <div className="flex items-center gap-2 border-b border-[#282a30] pb-3 mb-3">
              <span className="material-symbols-outlined text-[#fa5c1b]">sensors</span>
              <h3 className="font-bold text-sm text-white">Live Stream Stats</h3>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#8B8FA8]">Active Feed Items</span>
                <span className="text-white font-bold">{rawIssues.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B8FA8]">Urgent / High Priority</span>
                <span className="text-red-400 font-bold">
                  {rawIssues.filter((i: any) => i.severity_hint === 'high').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B8FA8]">Resolved Today</span>
                <span className="text-green-400 font-bold">
                  {rawIssues.filter((i: any) => i.status === 'resolved').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#191b22] to-[#fa5c1b]/10 border border-[#fa5c1b]/30 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-mono font-bold text-[#fa5c1b] uppercase">Report an Incident</h4>
            <p className="text-xs text-[#8B8FA8] leading-relaxed">
              Spotted a civic breakdown? Submit a photo and description for instant AI categorization.
            </p>
            <button
              onClick={() => navigate('/submit')}
              className="w-full bg-[#fa5c1b] text-white font-mono text-xs font-bold py-2 rounded-lg hover:bg-[#d94a10] transition-colors mt-2"
            >
              + Submit New Report
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
