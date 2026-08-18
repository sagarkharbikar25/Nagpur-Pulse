import { useNavigate } from 'react-router-dom';
import {
  RadarIcon,
  InfrastructureIcon,
  AIEngineIcon,
} from '../components/icons/CivicIcons';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0F141C] text-[#E6EDF3] min-h-screen flex flex-col justify-between selection:bg-[#E85D04] selection:text-white font-sans relative overflow-hidden">
      {/* Background Subtle Spatial Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #E6EDF3 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between border-b border-[#222D3D] bg-[#0F141C]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#151D28] border border-[#324259] p-1.5 flex items-center justify-center shadow-md">
            <img src="/nagpur-logo.png" alt="Nagpur Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-tight text-white block">
              NAGPUR PULSE
            </span>
            <span className="text-[9px] font-mono text-[#8B9BB4] block uppercase tracking-wider">
              NMC Municipal Operations & Telemetry
            </span>
          </div>
        </div>

        {/* Clean Header Right: Access Portal Link */}
        <div>
          <button
            onClick={() => navigate('/auth')}
            className="hud-panel px-3.5 py-1.5 text-xs font-mono text-[#8B9BB4] hover:text-white hover:border-[#E85D04] transition-colors"
          >
            Official / Citizen Login →
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto w-full text-center">
        {/* Brand Emblem */}
        <div className="w-24 h-24 rounded-2xl bg-[#161D27] border border-[#2B3A4E] p-2 flex items-center justify-center mb-5 shadow-[0_0_35px_rgba(232,93,4,0.22)]">
          <img
            src="/nagpur-logo.png"
            alt="Nagpur The Orange City Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182230] border border-[#263345] text-xs font-mono text-[#8B9BB4] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#4EBA6F] animate-pulse" />
          <span>Vikasit Nagpur 2026 · AI-Powered Civic Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white mb-3 max-w-3xl">
          Every Ward. Every Incident. <span className="text-[#E85D04]">Visible in Real-Time.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#8B9BB4] max-w-2xl leading-relaxed mb-8">
          The unified municipal operations platform for Nagpur — transforming citizen reports into geo-clustered hotspot diagnostics and rapid civil engineering dispatch.
        </p>

        {/* 3 Domain Portal Entry Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-left">
          {/* 1. Citizen Portal */}
          <div
            onClick={() => navigate('/auth?role=citizen')}
            className="group hud-panel p-5 hover:border-[#E85D04] transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-[#E85D04] font-bold">Public Terminal</span>
              <RadarIcon size={18} color="#E85D04" />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-[#E85D04] transition-colors">
              Citizen Radar
            </h3>
            <p className="text-xs text-[#8B9BB4] leading-relaxed mb-4">
              Submit voice/text complaints, inspect live pothole & drainage pins, and track resolution tickets.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#E85D04]">
              <span>Access Citizen Portal</span>
              <span>→</span>
            </div>
          </div>

          {/* 2. Ward Authority */}
          <div
            onClick={() => navigate('/auth?role=authority')}
            className="group hud-panel p-5 hover:border-[#E09F3E] transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-[#E09F3E] font-bold">Zone Operations</span>
              <InfrastructureIcon size={18} color="#E09F3E" />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-[#E09F3E] transition-colors">
              Ward Authority Hub
            </h3>
            <p className="text-xs text-[#8B9BB4] leading-relaxed mb-4">
              Triage open incidents, trigger 1-click AI contractor dispatch, and manage municipal work orders.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#E09F3E]">
              <span>Enter Ward Console</span>
              <span>→</span>
            </div>
          </div>

          {/* 3. Municipal Admin */}
          <div
            onClick={() => navigate('/auth?role=admin')}
            className="group hud-panel p-5 hover:border-[#4EBA6F] transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-[#4EBA6F] font-bold">Executive Command</span>
              <AIEngineIcon size={18} color="#4EBA6F" />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-[#4EBA6F] transition-colors">
              City Admin
            </h3>
            <p className="text-xs text-[#8B9BB4] leading-relaxed mb-4">
              Analyze citywide ward SLA leaderboards, export CSV audit reports, and calibrate AI policy models.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#4EBA6F]">
              <span>Open Admin HQ</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Telemetry Strip */}
      <footer className="relative z-20 px-6 py-3 border-t border-[#222D3D] bg-[#0F141C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8B9BB4]">
        <div className="flex items-center gap-4">
          <span>Nagpur Municipal Corporation (NMC)</span>
          <span>·</span>
          <span>8 Administrative Wards</span>
          <span>·</span>
          <strong className="text-white">Nag River Basin Telemetry</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4EBA6F] animate-ping" />
          <span className="text-white">System Status: 100% Operational</span>
        </div>
      </footer>
    </div>
  );
}
