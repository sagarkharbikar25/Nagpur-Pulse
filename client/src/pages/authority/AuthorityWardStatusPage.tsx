import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useWards } from '../../hooks/useWards';
import { useIssues } from '../../hooks/useIssues';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { categoryColors, categoryLabels, statusLabels } from '../../utils/categoryColors';
import { CategoryCivicIcon } from '../../components/icons/CivicIcons';

export default function AuthorityWardStatusPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: wards } = useWards();
  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  let storedUser = null;
  try {
    const raw = localStorage.getItem('nagpur_pulse_user');
    if (raw) storedUser = JSON.parse(raw);
  } catch {
    // ignore
  }
  const activeUser = user || storedUser;
  const userWardName = activeUser?.ward_name || activeUser?.name?.match(/\((.*?)\)/)?.[1] || '';
  const userWard = (wards ?? []).find(
    (w: any) => (activeUser?.ward_id && w.id === activeUser.ward_id) ||
                (userWardName && w.name.toLowerCase() === userWardName.toLowerCase())
  );

  const activeWardId = selectedWardId || userWard?.id || activeUser?.ward_id || wards?.[0]?.id || '';
  const currentWard = (wards ?? []).find((w: any) => w.id === activeWardId) || userWard;

  const { data: issueData } = useIssues({ ward_id: activeWardId, limit: '50' });
  const wardIssues = issueData?.issues ?? [];

  // Live Dynamic Counters
  const resolvedCount = wardIssues.filter((i: any) => i.status === 'resolved').length;
  const inProgressCount = wardIssues.filter((i: any) => i.status === 'in_progress').length;
  const openCount = wardIssues.filter((i: any) => i.status === 'open').length;
  const activeBacklog = openCount + inProgressCount;
  const totalIssuesCount = wardIssues.length;
  const liveResolutionRate = totalIssuesCount > 0 
    ? ((resolvedCount / totalIssuesCount) * 100).toFixed(1) 
    : '100.0';
  const activeFieldCrews = Math.max(1, inProgressCount);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/api/issues/${id}/status`, {
        status,
        resolution_note: `Updated to ${status} by ${user?.name || 'Ward Officer Sharma'}`,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['authority-ward-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['authority-ward-data'] });
      setToastMessage(`✓ Issue #${variables.id.slice(0, 6)} updated to "${statusLabels[variables.status]}"`);
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.error || 'Action failed. Please retry.');
    },
  });

  return (
    <AppLayout
      title="Detailed Ward SLA & Action Status"
      subtitle="Officer Command Console for assigned ward jurisdiction & field crews."
      role="authority"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151D28] border border-[#4EBA6F] text-[#4EBA6F] px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#4EBA6F] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Officer Jurisdiction Banner */}
      <div className="hud-panel p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#E85D04] uppercase tracking-wider block font-bold">
            OFFICER JURISDICTION
          </span>
          <h2 className="text-xl font-display font-bold text-white">
            {currentWard?.name || 'Dharampeth'} Ward ({currentWard?.zone || 'Zone 1'})
          </h2>
          <p className="text-xs text-[#8B9BB4] font-mono mt-0.5">
            Supervisor: <strong className="text-white">{user?.name || 'Ward Officer Sharma'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-[#8B9BB4]">Select Ward:</label>
          <select
            value={activeWardId}
            onChange={(e) => setSelectedWardId(e.target.value)}
            className="bg-[#0F141C] border border-[#263345] text-xs font-mono text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#E85D04]"
          >
            {(wards ?? []).map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Live KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="hud-panel p-4">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Active Backlog</span>
          <div className="text-2xl font-display font-bold text-[#D9534F] tabular-nums">
            {activeBacklog}
          </div>
          <span className="text-[10px] text-[#8B9BB4] font-mono mt-1 block">{openCount} unassigned</span>
        </div>

        <div className="hud-panel p-4">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Resolution Rate</span>
          <div className="text-2xl font-display font-bold text-[#4EBA6F] tabular-nums">
            {liveResolutionRate}%
          </div>
          <span className="text-[10px] text-[#4EBA6F] font-mono mt-1 block">Live SLA Compliance</span>
        </div>

        <div className="hud-panel p-4">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Total Resolved</span>
          <div className="text-2xl font-display font-bold text-white tabular-nums">
            {resolvedCount}
          </div>
          <span className="text-[10px] text-[#4EBA6F] font-mono mt-1 block">Verified Completed</span>
        </div>

        <div className="hud-panel p-4">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Active Field Crews</span>
          <div className="text-2xl font-display font-bold text-[#E09F3E] tabular-nums">
            {activeFieldCrews} Crews
          </div>
          <span className="text-[10px] text-[#E09F3E] font-mono mt-1 block">{inProgressCount} active repair sites</span>
        </div>
      </div>

      {/* Actionable Ward Incident Queue */}
      <div className="hud-panel p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#263345] pb-4">
          <h3 className="text-base font-display font-bold text-white">Actionable Ward Incident Queue</h3>
          <span className="font-mono text-xs text-[#8B9BB4]">{wardIssues.length} Incidents</span>
        </div>

        <div className="divide-y divide-[#263345]">
          {wardIssues.map((issue: any) => (
            <div key={issue.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <CategoryCivicIcon category={issue.category} size={15} color={categoryColors[issue.category]} />
                  <span className="font-display font-semibold text-xs text-white">
                    {categoryLabels[issue.category] ?? issue.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B9BB4]">#{issue.id?.slice(0, 8)}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      issue.status === 'resolved'
                        ? 'bg-[#4EBA6F]/20 text-[#4EBA6F] border border-[#4EBA6F]/40'
                        : issue.status === 'in_progress'
                        ? 'bg-[#E09F3E]/20 text-[#E09F3E] border border-[#E09F3E]/40'
                        : 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                    }`}
                  >
                    {statusLabels[issue.status] ?? issue.status}
                  </span>
                </div>
                <p className="text-xs text-[#E6EDF3] leading-relaxed">{issue.ai_summary || issue.description}</p>
                <div className="text-[10px] font-mono text-[#8B9BB4]">
                  Reported: {new Date(issue.created_at).toLocaleString()}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {issue.status !== 'in_progress' && issue.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: issue.id, status: 'in_progress' })}
                    disabled={updateStatusMutation.isPending}
                    className="px-3 py-1.5 rounded bg-[#E85D04] hover:bg-[#D45000] text-white text-xs font-mono font-bold transition-all shadow-sm"
                  >
                    Dispatch Crew →
                  </button>
                )}
                {issue.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: issue.id, status: 'resolved' })}
                    disabled={updateStatusMutation.isPending}
                    className="px-3 py-1.5 rounded bg-[#4EBA6F]/20 border border-[#4EBA6F] hover:bg-[#4EBA6F] hover:text-white text-[#4EBA6F] text-xs font-mono font-bold transition-colors"
                  >
                    Mark Resolved ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
