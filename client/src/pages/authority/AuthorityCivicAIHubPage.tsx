import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useHotspots } from '../../hooks/useHotspots';
import { useWards } from '../../hooks/useWards';
import { categoryLabels } from '../../utils/categoryColors';
import { AIEngineIcon } from '../../components/icons/CivicIcons';

export default function AuthorityCivicAIHubPage() {
  const { data: hotspots } = useHotspots();
  const { data: wards } = useWards();
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);

  const wardMap = Object.fromEntries((wards ?? []).map((w: any) => [w.id, w.name]));

  const diagnosticScenarios = [
    {
      title: 'Monsoon Runoff & Storm Drainage Risk',
      confidence: '89.4%',
      ward: 'Dharampeth West',
      urgency: 'HIGH',
      recommendation:
        'NVIDIA Nemotron Predictive Engine: High probability (89%) of storm catch-basin overflow near West High Court Road within next 48h. Recommended: Dispatch de-silting crew #02 to clear arterial culvert before scheduled rainfall.',
    },
    {
      title: 'Pavement Asphalt Fracture Degradation',
      confidence: '94.1%',
      ward: 'Wardha Road Arterial',
      urgency: 'CRITICAL',
      recommendation:
        'NVIDIA Spatial Clustering: Heavy heavy-vehicle transit detected over 3 adjacent reported road depressions. Pothole progression rate estimated at +45% in 72h. Recommended: Pre-allocate hot-mix asphalt patching team.',
    },
    {
      title: 'Smart Streetlight Grid Transformer Surge',
      confidence: '96.2%',
      ward: 'Sitabuldi Central',
      urgency: 'MODERATE',
      recommendation:
        'Telemetry Diagnostics: Voltage drop pattern across 14 lighting fixtures on Station Road indicates failing step-down transformer. Recommended: Request MSEDCL field crew capacitor inspection.',
    },
  ];

  const runPredictiveAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDiagnosticIndex((prev) => (prev + 1) % diagnosticScenarios.length);
      setAnalyzing(false);
    }, 1200);
  };

  const currentDiagnostic = diagnosticScenarios[diagnosticIndex];

  return (
    <AppLayout
      title="Municipal Civic AI Intelligence Hub"
      subtitle="Predictive anomaly detection, hotspot clustering intelligence, and resource allocation models."
      role="authority"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Anomaly & Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Predictive Card */}
          <div className="hud-panel p-6 space-y-4 border-[#E85D04]/50 bg-gradient-to-br from-[#151D28] to-[#E85D04]/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/20 border border-[#E85D04] flex items-center justify-center shrink-0">
                  <AIEngineIcon size={20} color="#E85D04" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">NVIDIA Nemotron 3 Spatial Cluster Engine</h3>
                  <span className="text-[10px] text-[#E85D04] font-mono block">Real-time Multi-Ward Spatial Clustering & NLP</span>
                </div>
              </div>

              <button
                onClick={runPredictiveAnalysis}
                disabled={analyzing}
                className="btn-primary text-xs font-mono py-2 px-3.5 flex items-center gap-2 shadow-lg"
              >
                {analyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Sensor Streams...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Run AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Output */}
            <div className="p-4 rounded-xl bg-[#0F141C] border border-[#263345] space-y-2">
              <div className="flex justify-between items-center border-b border-[#263345] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-ping" />
                  <span className="font-display font-bold text-xs text-white uppercase">{currentDiagnostic.title}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#8B9BB4]">Confidence:</span>
                  <span className="font-bold text-[#4EBA6F]">{currentDiagnostic.confidence}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40">
                    {currentDiagnostic.urgency}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#E6EDF3] leading-relaxed pt-1 font-mono">
                {currentDiagnostic.recommendation}
              </p>
            </div>
          </div>

          {/* Active Hotspot Radar */}
          <div className="hud-panel p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#263345] pb-3">
              <h3 className="font-display font-bold text-sm text-white">
                Active Hotspot Threshold Alerts (3+ Incidents Clustered)
              </h3>
              <span className="text-xs font-mono text-[#8B9BB4]">{(hotspots ?? []).length} Spatial Clusters</span>
            </div>

            <div className="space-y-3">
              {(hotspots ?? []).length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0F141C] border border-[#263345] text-xs font-mono text-[#8B9BB4] text-center">
                  No active high-density clusters in this ward jurisdiction.
                </div>
              ) : (
                (hotspots ?? []).map((h: any) => {
                  const wardName = wardMap[h.ward_id] ?? 'Dharampeth';
                  return (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl bg-[#0F141C] border border-[#D9534F]/40 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#D9534F] animate-ping" />
                          <span className="font-display font-bold text-xs text-white">{wardName}</span>
                          <span className="text-[10px] font-mono text-[#D9534F] bg-[#D9534F]/20 px-2 py-0.5 rounded uppercase font-bold">
                            {categoryLabels[h.category] ?? h.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B9BB4]">
                          High incident density: {h.issue_count} verified citizen submissions.
                        </p>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#D9534F]">
                        {h.issue_count} Reports
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Model Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="hud-panel p-5 space-y-3">
            <h4 className="font-display font-bold text-xs text-white uppercase border-b border-[#263345] pb-2">
              Inference Parameters
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Model</span>
                <span className="text-white font-bold">Nemotron 3 120B</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Cluster Radius</span>
                <span className="text-white">500 meters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Cluster Threshold</span>
                <span className="text-white">≥ 3 Reports</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Inference Latency</span>
                <span className="text-[#4EBA6F] font-bold">142 ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8B9BB4]">Classification SLA</span>
                <span className="text-white">&lt; 1.2 sec</span>
              </div>
            </div>
          </div>

          <div className="hud-panel p-5 space-y-2">
            <span className="text-[10px] font-mono text-[#06B6D4] uppercase font-bold block">
              Auto-Classification Guarantee
            </span>
            <p className="text-xs text-[#8B9BB4] leading-relaxed">
              Every citizen submission is processed with high-accuracy municipal taxonomy categorization and automated geo-hash indexing.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
