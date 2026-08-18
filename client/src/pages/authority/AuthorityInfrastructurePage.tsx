import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

export default function AuthorityInfrastructurePage() {
  const [contracts, setContracts] = useState([
    {
      id: 'CNT-DH-01',
      project: 'Asphalt Patching & Pothole Repair (Wardha Rd)',
      contractor: 'Nagpur InfraTech Corp',
      crewLead: 'Eng. R. Deshmukh',
      allocatedBudget: '₹45 Lakh',
      status: 'Active Field Work',
      completion: 68,
    },
    {
      id: 'CNT-DH-02',
      project: 'Underground Drainage Desilting (Dharampeth West)',
      contractor: 'Vidarbha Civil Works',
      crewLead: 'Supervisor K. Patil',
      allocatedBudget: '₹22 Lakh',
      status: 'Scheduled',
      completion: 15,
    },
    {
      id: 'CNT-DH-03',
      project: 'LED Streetlight Transformer Replacement',
      contractor: 'MSEDCL Municipal Unit',
      crewLead: 'Foreman A. Joshi',
      allocatedBudget: '₹18 Lakh',
      status: 'Inspection Phase',
      completion: 95,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState('');
  const [contractor, setContractor] = useState('');
  const [crewLead, setCrewLead] = useState('');
  const [budget, setBudget] = useState('');

  // Dynamic calculations
  const totalAllocatedBudget = contracts.reduce((sum, c) => {
    const num = parseFloat(c.allocatedBudget.replace(/[^0-9.]/g, '')) || 0;
    return sum + num;
  }, 0);

  const activeCrewsCount = contracts.filter(c => c.status === 'Active Field Work').length || 1;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !contractor) return;

    const newId = `CNT-DH-0${contracts.length + 1}`;
    const budgetVal = budget || '15';
    setContracts([
      ...contracts,
      {
        id: newId,
        project,
        contractor,
        crewLead: crewLead || 'Site Foreman',
        allocatedBudget: `₹${budgetVal} Lakh`,
        status: 'Active Field Work',
        completion: 10,
      },
    ]);

    setProject('');
    setContractor('');
    setCrewLead('');
    setBudget('');
    setShowModal(false);
  };

  return (
    <AppLayout
      title="Ward Infrastructure & Contractor Management"
      subtitle="Supervise municipal repair work orders, contractor allocations, and engineering inspections."
      role="authority"
    >
      {/* Dynamic Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Active Work Orders</span>
          <div className="text-3xl font-display font-bold text-white tabular-nums">{contracts.length} Orders</div>
          <span className="text-[11px] font-mono text-[#E09F3E] mt-1 block">{activeCrewsCount} Crews on-site</span>
        </div>

        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Allocated Ward Budget</span>
          <div className="text-3xl font-display font-bold text-[#4EBA6F] tabular-nums">
            ₹{totalAllocatedBudget} Lakh
          </div>
          <span className="text-[11px] font-mono text-[#8B9BB4] mt-1 block">FY 2026-27 Ward 12 Allocation</span>
        </div>

        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Quality Inspection SLA</span>
          <div className="text-3xl font-display font-bold text-[#E85D04] tabular-nums">94.2%</div>
          <span className="text-[11px] font-mono text-[#4EBA6F] mt-1 block">Verified by Municipal Engineer</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="hud-panel p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#263345] pb-4">
          <h3 className="font-display font-bold text-base text-white">Ward Repair Contracts & Work Orders</h3>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs font-mono py-2 px-3.5 flex items-center gap-1.5 shadow-md"
          >
            <span>+ Issue Work Order</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#263345] text-xs font-mono text-[#8B9BB4]">
                <th className="py-3 px-2">WORK ORDER</th>
                <th className="py-3 px-2">SCOPE OF WORK</th>
                <th className="py-3 px-2">CONTRACTOR / CREW LEAD</th>
                <th className="py-3 px-2">COMPLETION</th>
                <th className="py-3 px-2">BUDGET</th>
                <th className="py-3 px-2 text-right">STAGE</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#263345]">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#182230]/70 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-[#E85D04]">{c.id}</td>
                  <td className="py-3 px-2">
                    <div className="font-semibold text-white">{c.project}</div>
                  </td>
                  <td className="py-3 px-2 font-mono">
                    <div className="text-[#E6EDF3]">{c.contractor}</div>
                    <div className="text-[10px] text-[#8B9BB4]">{c.crewLead}</div>
                  </td>
                  <td className="py-3 px-2 w-40">
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-[#8B9BB4]">
                      <span>{c.completion}%</span>
                    </div>
                    <div className="w-full bg-[#0F141C] h-1.5 rounded-full overflow-hidden border border-[#263345]">
                      <div
                        className="h-full bg-[#E85D04] rounded-full"
                        style={{ width: `${c.completion}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-white font-bold">{c.allocatedBudget}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E85D04]/15 text-[#E85D04] border border-[#E85D04]/30 uppercase">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Issuing Work Order */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="hud-panel-elevated max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#263345] pb-3">
              <h3 className="text-base font-display font-bold text-white">Issue Municipal Work Order</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8B9BB4] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[#8B9BB4] block mb-1">Scope / Project Name *</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. West High Court Road Resurfacing"
                  required
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="text-[#8B9BB4] block mb-1">Assigned Contractor Agency *</label>
                <input
                  type="text"
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value)}
                  placeholder="e.g. Vidarbha InfraTech Ltd"
                  required
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8B9BB4] block mb-1">Crew Lead Engineer</label>
                  <input
                    type="text"
                    value={crewLead}
                    onChange={(e) => setCrewLead(e.target.value)}
                    placeholder="Eng. M. Joshi"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[#8B9BB4] block mb-1">Budget (₹ in Lakh) *</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="25"
                    required
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary text-xs py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2 font-bold"
                >
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
