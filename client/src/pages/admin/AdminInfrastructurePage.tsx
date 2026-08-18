import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

export default function AdminInfrastructurePage() {
  const [assets, setAssets] = useState([
    { id: 'AST-01', asset: 'Wardha Road Arterial Corridor', type: 'Highway / Roadway', status: 'Optimal', budgetSpent: '₹14.2 Cr', condition: '92%' },
    { id: 'AST-02', asset: 'Ambazari Water Purification Plant', type: 'Water Utility', status: 'Maintenance', budgetSpent: '₹28.5 Cr', condition: '76%' },
    { id: 'AST-03', asset: 'Sitabuldi Smart Streetlight Grid', type: 'Electrical', status: 'Optimal', budgetSpent: '₹6.8 Cr', condition: '98%' },
    { id: 'AST-04', asset: 'Nag River Storm Drainage Canal', type: 'Flood Prevention', status: 'De-silting Active', budgetSpent: '₹19.4 Cr', condition: '81%' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [sector, setSector] = useState('Highway / Roadway');
  const [budget, setBudget] = useState('');
  const [condition, setCondition] = useState('95%');

  // Dynamic calculations
  const totalCapex = assets.reduce((sum, a) => {
    const num = parseFloat(a.budgetSpent.replace(/[^0-9.]/g, '')) || 0;
    return sum + num;
  }, 0).toFixed(1);

  const avgHealth = assets.length > 0
    ? (assets.reduce((sum, a) => sum + (parseFloat(a.condition.replace(/[^0-9.]/g, '')) || 0), 0) / assets.length).toFixed(1)
    : '89.2';

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !budget) return;

    const newId = `AST-0${assets.length + 1}`;
    setAssets([
      ...assets,
      {
        id: newId,
        asset: assetName,
        type: sector,
        status: 'Optimal',
        budgetSpent: `₹${budget} Cr`,
        condition: condition || '90%',
      },
    ]);

    setAssetName('');
    setBudget('');
    setShowModal(false);
  };

  return (
    <AppLayout
      title="Master City Infrastructure & Capital Asset Ledger"
      subtitle="Executive capital expenditure monitoring and asset health diagnostics."
      role="admin"
    >
      {/* High-Level Dynamic Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Total Capital Allocated</span>
          <div className="text-3xl font-display font-bold text-white tabular-nums">₹{totalCapex} Cr</div>
          <span className="text-[11px] font-mono text-[#4EBA6F] mt-1 block">FY 2026-27 Municipal Budget</span>
        </div>

        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Overall Asset Health</span>
          <div className="text-3xl font-display font-bold text-[#4EBA6F] tabular-nums">{avgHealth}%</div>
          <span className="text-[11px] font-mono text-[#4EBA6F] mt-1 block">Telemetry sensor verified</span>
        </div>

        <div className="hud-panel p-5">
          <span className="text-[10px] font-mono text-[#8B9BB4] uppercase block mb-1">Contractor Audits</span>
          <div className="text-3xl font-display font-bold text-[#E85D04] tabular-nums">100% Verified</div>
          <span className="text-[11px] font-mono text-[#8B9BB4] mt-1 block">Zero discrepancy logged</span>
        </div>
      </div>

      {/* Asset Table Container */}
      <div className="hud-panel p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#263345] pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-white">Major Municipal Capital Assets</h3>
            <span className="text-xs font-mono text-[#8B9BB4]">{assets.length} Active Public Infrastructure Units</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs font-mono py-2 px-3.5 flex items-center gap-1.5 shadow-md"
          >
            <span>+ Register New Asset</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#263345] text-xs font-mono text-[#8B9BB4]">
                <th className="py-3 px-2">ASSET ID</th>
                <th className="py-3 px-2">ASSET NAME</th>
                <th className="py-3 px-2">SECTOR</th>
                <th className="py-3 px-2">CAPEX SPENT</th>
                <th className="py-3 px-2">HEALTH SCORE</th>
                <th className="py-3 px-2 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#263345]">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-[#182230]/70 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-[#E85D04]">{a.id}</td>
                  <td className="py-3 px-2 font-bold text-white">{a.asset}</td>
                  <td className="py-3 px-2 font-mono text-[#8B9BB4]">{a.type}</td>
                  <td className="py-3 px-2 font-mono text-white font-bold">{a.budgetSpent}</td>
                  <td className="py-3 px-2 font-mono text-[#4EBA6F] font-bold">{a.condition}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#4EBA6F]/15 text-[#4EBA6F] border border-[#4EBA6F]/30 uppercase">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Registering New Asset */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="hud-panel-elevated max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#263345] pb-3">
              <h3 className="text-base font-display font-bold text-white">Register New Capital Asset</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8B9BB4] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[#8B9BB4] block mb-1">Asset / Project Name *</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Koradi Smart Water Pipeline Network"
                  required
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="text-[#8B9BB4] block mb-1">Infrastructure Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="input text-xs"
                >
                  <option value="Highway / Roadway">Highway / Roadway</option>
                  <option value="Water Utility">Water Utility</option>
                  <option value="Electrical & Smart Grid">Electrical & Smart Grid</option>
                  <option value="Flood Prevention & Drainage">Flood Prevention & Drainage</option>
                  <option value="Public Sanitation Facility">Public Sanitation Facility</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8B9BB4] block mb-1">Budget (₹ in Crores) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="8.5"
                    required
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[#8B9BB4] block mb-1">Health Score</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="95%"
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
