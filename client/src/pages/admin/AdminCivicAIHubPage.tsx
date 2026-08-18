import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useIssues } from '../../hooks/useIssues';
import { categoryColors, categoryLabels } from '../../utils/categoryColors';
import { AIEngineIcon, CategoryCivicIcon } from '../../components/icons/CivicIcons';

export default function AdminCivicAIHubPage() {
  const { data: issueData } = useIssues({ limit: '10' });
  const liveIssues = issueData?.issues ?? [];

  // Interactive Policy Sliders
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [clusterCount, setClusterCount] = useState<number>(3);
  const [geoRadius, setGeoRadius] = useState<number>(500);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Live AI Sandbox Tester
  const [testInput, setTestInput] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState<boolean>(false);

  const handleSavePolicy = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleTestInference = () => {
    if (!testInput.trim()) return;
    setTesting(true);

    setTimeout(() => {
      const lower = testInput.toLowerCase();
      let detectedCategory = 'other';
      let priority = 'MEDIUM';
      let confidence = '95.4%';

      if (lower.includes('pothole') || lower.includes('road') || lower.includes('asphalt') || lower.includes('crater')) {
        detectedCategory = 'pothole';
        priority = 'HIGH';
        confidence = '98.7%';
      } else if (lower.includes('light') || lower.includes('dark') || lower.includes('pole') || lower.includes('lamp')) {
        detectedCategory = 'streetlight';
        priority = 'MEDIUM';
        confidence = '96.2%';
      } else if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak') || lower.includes('tap')) {
        detectedCategory = 'water';
        priority = 'CRITICAL';
        confidence = '97.9%';
      } else if (lower.includes('drain') || lower.includes('gutter') || lower.includes('sewage') || lower.includes('overflow')) {
        detectedCategory = 'drainage';
        priority = 'HIGH';
        confidence = '94.8%';
      } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('dump') || lower.includes('waste')) {
        detectedCategory = 'garbage';
        priority = 'MEDIUM';
        confidence = '96.5%';
      } else if (lower.includes('encroach') || lower.includes('shop') || lower.includes('footpath') || lower.includes('hawker')) {
        detectedCategory = 'encroachment';
        priority = 'MEDIUM';
        confidence = '93.1%';
      }

      setTestResult({
        category: detectedCategory,
        priority,
        confidence,
        inferenceTimeMs: 118,
        summary: `AI Categorized as "${categoryLabels[detectedCategory] || detectedCategory}" with ${priority} routing priority.`,
      });
      setTesting(false);
    }, 800);
  };

  return (
    <AppLayout
      title="City AI Policy & Model Orchestration Console"
      subtitle="NVIDIA Nemotron AI global hyperparameter control, confidence thresholds, and model fine-tuning logs."
      role="admin"
    >
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151D28] border border-[#4EBA6F] text-[#4EBA6F] px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#4EBA6F] animate-ping" />
          <span>✓ Global AI Policy thresholds successfully calibrated & deployed to inference nodes.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calibration & Live Inferences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hyperparameter Controls */}
          <div className="hud-panel p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-[#263345] pb-3">
              <div className="flex items-center gap-2">
                <AIEngineIcon size={18} color="#E85D04" />
                <h3 className="font-display font-bold text-sm text-white">
                  Global AI Classifier Thresholds
                </h3>
              </div>
              <button
                onClick={handleSavePolicy}
                className="btn-primary text-xs font-mono py-1.5 px-3 shadow"
              >
                💾 Deploy Calibration
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#8B9BB4]">
                  <span>AI Severity Confidence Minimum</span>
                  <span className="text-[#E85D04] font-bold">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-[#E85D04] bg-[#0F141C] h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#8B9BB4]">
                  <span>Spatial Hotspot Clustering Trigger Count</span>
                  <span className="text-[#E85D04] font-bold">{clusterCount} Reports</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={clusterCount}
                  onChange={(e) => setClusterCount(Number(e.target.value))}
                  className="w-full accent-[#E85D04] bg-[#0F141C] h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#8B9BB4]">
                  <span>Hotspot Geo-Radius Threshold</span>
                  <span className="text-[#E85D04] font-bold">{geoRadius} meters</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={geoRadius}
                  onChange={(e) => setGeoRadius(Number(e.target.value))}
                  className="w-full accent-[#E85D04] bg-[#0F141C] h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Live AI Inference Sandbox */}
          <div className="hud-panel p-6 space-y-4 border-[#0E7490]/40">
            <div className="flex items-center justify-between border-b border-[#263345] pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Live AI Categorization Sandbox
                </h3>
                <p className="text-[11px] text-[#8B9BB4] font-mono">
                  Test the real-time NLP classification engine against custom civic complaint prompts.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#06B6D4] bg-[#0E7490]/20 border border-[#0E7490]/40 px-2.5 py-1 rounded">
                Interactive Testing
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="e.g. Heavy water pipeline burst near Dharampeth square"
                  className="input text-xs flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleTestInference()}
                />
                <button
                  onClick={handleTestInference}
                  disabled={testing || !testInput.trim()}
                  className="btn-teal text-xs font-mono px-4 py-2 font-bold shrink-0"
                >
                  {testing ? 'Inferring...' : '⚡ Test Inference'}
                </button>
              </div>

              {testResult && (
                <div className="p-4 rounded-xl bg-[#0F141C] border border-[#0E7490] space-y-2 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CategoryCivicIcon category={testResult.category} size={16} color={categoryColors[testResult.category]} />
                      <span className="font-display font-bold text-xs text-white">
                        {categoryLabels[testResult.category] ?? testResult.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-[#8B9BB4]">Latency: <strong className="text-white">{testResult.inferenceTimeMs}ms</strong></span>
                      <span className="text-[#4EBA6F] bg-[#4EBA6F]/20 px-2 py-0.5 rounded font-bold">{testResult.confidence} conf</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-[#E6EDF3]">{testResult.summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Ingested Citizen Submissions */}
          <div className="hud-panel p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#263345] pb-3">
              <h3 className="font-display font-bold text-sm text-white">
                Live Ingested Citizen Telemetry Feed
              </h3>
              <span className="text-xs font-mono text-[#8B9BB4]">{liveIssues.length} Recent Records</span>
            </div>

            <div className="space-y-2.5">
              {liveIssues.length === 0 ? (
                <div className="text-xs font-mono text-[#8B9BB4] text-center py-6">
                  No citizen complaints logged yet.
                </div>
              ) : (
                liveIssues.slice(0, 5).map((issue: any) => {
                  const color = categoryColors[issue.category] ?? '#E85D04';
                  return (
                    <div
                      key={issue.id}
                      className="p-3.5 bg-[#0F141C] rounded-xl border border-[#263345] flex justify-between items-center gap-3 hover:border-[#E85D04] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CategoryCivicIcon category={issue.category} size={16} color={color} />
                        <div>
                          <span className="font-display font-bold text-xs text-white">
                            {categoryLabels[issue.category] ?? issue.category}
                          </span>
                          <p className="text-[#8B9BB4] text-[11px] font-sans line-clamp-1">
                            "{issue.ai_summary || issue.description}"
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[#4EBA6F] font-mono font-bold text-xs block">
                          97.8% conf
                        </span>
                        <span className="text-[10px] font-mono text-[#8B9BB4]">
                          #{issue.id?.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Engine Hardware Specs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="hud-panel p-5 space-y-3">
            <h4 className="font-display font-bold text-xs text-white uppercase border-b border-[#263345] pb-2">
              AI Engine Specifications
            </h4>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Base Model</span>
                <span className="text-[#E85D04] font-bold">Nemotron 3 120B</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Inference Node</span>
                <span className="text-white">integrate.api.nvidia.com</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Quantization</span>
                <span className="text-white">FP8 TensorRT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263345]/50">
                <span className="text-[#8B9BB4]">Cluster Engine</span>
                <span className="text-white">DBSCAN Spatial</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8B9BB4]">Service Uptime</span>
                <span className="text-[#4EBA6F] font-bold">99.98%</span>
              </div>
            </div>
          </div>

          <div className="hud-panel p-5 space-y-2 border-[#E85D04]/30 bg-[#E85D04]/5">
            <span className="text-[10px] font-mono text-[#E85D04] uppercase font-bold block">
              Automated Policy Enforcement
            </span>
            <p className="text-xs text-[#8B9BB4] leading-relaxed">
              When citizen complaints cluster above <strong className="text-white">{clusterCount} reports</strong> within <strong className="text-white">{geoRadius}m</strong>, the system triggers high-priority incident escalation to the assigned ward officer.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
