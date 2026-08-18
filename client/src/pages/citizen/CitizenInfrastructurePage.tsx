import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useDashboard } from '../../hooks/useDashboard';

interface Project {
  id: string;
  name: string;
  ward: string;
  category: string;
  progress: number;
  budget: string;
  status: 'In Progress' | 'Inspection' | 'Completed';
  targetDate: string;
}

const mockProjects: Project[] = [
  {
    id: 'INF-2024-01',
    name: 'West High Court Road Arterial Resurfacing',
    ward: 'Dharampeth',
    category: 'Roadways',
    progress: 74,
    budget: '₹2.4 Cr',
    status: 'In Progress',
    targetDate: 'Oct 2026',
  },
  {
    id: 'INF-2024-02',
    name: 'Smart LED Grid Transition (Phase 3)',
    ward: 'Sitabuldi',
    category: 'Electrical',
    progress: 92,
    budget: '₹85 Lakh',
    status: 'Inspection',
    targetDate: 'Aug 2026',
  },
  {
    id: 'INF-2024-03',
    name: 'Futala Lake Storm Drain De-silting',
    ward: 'Sadar',
    category: 'Drainage',
    progress: 100,
    budget: '₹1.1 Cr',
    status: 'Completed',
    targetDate: 'Jul 2026',
  },
  {
    id: 'INF-2024-04',
    name: 'Ambazari Feeder Pipeline Replacement',
    ward: 'Laxmi Nagar',
    category: 'Water Supply',
    progress: 45,
    budget: '₹3.8 Cr',
    status: 'In Progress',
    targetDate: 'Dec 2026',
  },
  {
    id: 'INF-2024-05',
    name: 'Manewada Ring Road Pothole Patching Blitz',
    ward: 'Manewada',
    category: 'Roadways',
    progress: 88,
    budget: '₹40 Lakh',
    status: 'In Progress',
    targetDate: 'Aug 2026',
  },
];

export default function CitizenInfrastructurePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { data: dashboard } = useDashboard();

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ward.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout
      title="Infrastructure Ledger"
      subtitle="Public transparency registry for municipal engineering & civic utility works."
      role="citizen"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <div className="flex justify-between items-center text-[#8B8FA8] text-xs font-mono mb-2">
            <span>ACTIVE PROJECTS</span>
            <span className="material-symbols-outlined text-amber-400 text-base">construction</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">142</div>
          <span className="text-[11px] text-green-400 font-mono mt-1 block">+12 this quarter</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <div className="flex justify-between items-center text-[#8B8FA8] text-xs font-mono mb-2">
            <span>BUDGET DEPLOYED</span>
            <span className="material-symbols-outlined text-[#4ae176] text-base">account_balance</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">₹4.2 Cr</div>
          <span className="text-[11px] text-[#8B8FA8] font-mono mt-1 block">8 Wards Allocated</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <div className="flex justify-between items-center text-[#8B8FA8] text-xs font-mono mb-2">
            <span>OVERALL COMPLETION</span>
            <span className="material-symbols-outlined text-green-400 text-base">task_alt</span>
          </div>
          <div className="text-3xl font-bold font-mono text-green-400">
            {dashboard?.city_resolution_rate ?? 78}%
          </div>
          <span className="text-[11px] text-green-400 font-mono mt-1 block">On target schedule</span>
        </div>

        <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
          <div className="flex justify-between items-center text-[#8B8FA8] text-xs font-mono mb-2">
            <span>CRITICAL HOTSPOTS</span>
            <span className="material-symbols-outlined text-red-400 text-base">warning</span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#fa5c1b]">
            {dashboard?.active_hotspots ?? 2}
          </div>
          <span className="text-[11px] text-red-400 font-mono mt-1 block">Active repair crew alerts</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8FA8] text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search projects, wards, IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111319] border border-[#33343b] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#fa5c1b]"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Roadways', 'Water Supply', 'Drainage', 'Electrical'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-[#fa5c1b] text-white'
                  : 'bg-[#111319] text-[#8B8FA8] hover:text-white border border-[#282a30]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5">
        <div className="flex justify-between items-center border-b border-[#282a30] pb-3 mb-4">
          <h3 className="font-bold text-sm text-white">Registered Infrastructure Projects</h3>
          <span className="font-mono text-xs text-[#8B8FA8]">{filteredProjects.length} Projects Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#282a30] text-xs font-mono text-[#8B8FA8]">
                <th className="py-3 px-2">PROJECT ID</th>
                <th className="py-3 px-2">INITIATIVE / WARD</th>
                <th className="py-3 px-2">CATEGORY</th>
                <th className="py-3 px-2">PROGRESS</th>
                <th className="py-3 px-2">BUDGET</th>
                <th className="py-3 px-2 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#282a30]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#111319] transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-[#fa5c1b] font-bold">{p.id}</td>
                  <td className="py-3 px-2">
                    <div className="font-semibold text-white text-xs">{p.name}</div>
                    <div className="text-[11px] font-mono text-[#8B8FA8]">{p.ward} Ward</div>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs text-[#8B8FA8]">{p.category}</td>
                  <td className="py-3 px-2 w-44">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span>{p.progress}%</span>
                      <span className="text-gray-500">Target: {p.targetDate}</span>
                    </div>
                    <div className="w-full bg-[#111319] h-1.5 rounded-full overflow-hidden border border-[#282a30]">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-green-500 h-full rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs text-white">{p.budget}</td>
                  <td className="py-3 px-2 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        p.status === 'Completed'
                          ? 'bg-green-950/60 text-green-400 border border-green-800/60'
                          : p.status === 'Inspection'
                          ? 'bg-purple-950/60 text-purple-400 border border-purple-800/60'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
