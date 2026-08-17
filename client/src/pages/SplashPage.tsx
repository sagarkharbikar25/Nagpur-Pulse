import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#111319] text-[#e2e2eb] min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-6 selection:bg-orange-500 selection:text-white">
      {/* Background Map Texture */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(250, 92, 27, 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />
      {/* Central Glow Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[#fa5c1b] rounded-full blur-[140px] opacity-10 animate-pulse" />
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center max-w-4xl w-full">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-24 h-24 rounded-2xl bg-[#1e1f26] border border-[#5b4138] flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(250,92,27,0.2)] relative group cursor-default">
            <span className="material-symbols-outlined text-[#fa5c1b] text-5xl group-hover:scale-110 transition-transform duration-300">
              radar
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2eb] mb-2 tracking-tight">
            Nagpur Pulse
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-[#fa5c1b] animate-ping" />
            <p className="text-base md:text-lg text-[#e3bfb3] font-medium tracking-wide">
              Every ward. Every issue. Visible.
            </p>
            <div className="w-2 h-2 rounded-full bg-[#fa5c1b] animate-ping" />
          </div>
        </div>

        {/* Entry Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
          {/* Citizen Portal Card */}
          <div 
            onClick={() => navigate('/home')}
            className="group flex flex-col items-center p-6 rounded-xl bg-[#191b22] border border-[#33343b] hover:border-[#fa5c1b] hover:shadow-[0_0_20px_rgba(250,92,27,0.25)] transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fa5c1b]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-16 h-16 rounded-full bg-[#282a30] flex items-center justify-center mb-4 group-hover:bg-[#fa5c1b]/20 transition-colors duration-300">
              <span className="material-symbols-outlined text-[#e3bfb3] group-hover:text-[#fa5c1b] transition-colors duration-300 text-3xl">
                groups
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#e2e2eb] mb-2">Citizen Portal</h2>
            <p className="text-sm text-[#8B8FA8] text-center mb-6 flex-1">
              AI-powered reporting, real-time map tracking, and ward analytics.
            </p>
            <button className="w-full py-2.5 px-4 bg-[#fa5c1b] text-white font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#d94a10] transition-colors relative z-10">
              Enter Citizen Portal
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Authority Login Card */}
          <div 
            onClick={() => navigate('/auth?role=authority')}
            className="group flex flex-col items-center p-6 rounded-xl bg-[#191b22] border border-[#33343b] hover:border-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F59E0B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-16 h-16 rounded-full bg-[#282a30] flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors duration-300">
              <span className="material-symbols-outlined text-[#e3bfb3] group-hover:text-[#F59E0B] transition-colors duration-300 text-3xl">
                admin_panel_settings
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#e2e2eb] mb-2">Authority Login</h2>
            <p className="text-sm text-[#8B8FA8] text-center mb-6 flex-1">
              Municipal AI dashboards, ticket management, and spatial task assignment.
            </p>
            <button className="w-full py-2.5 px-4 bg-transparent border border-[#5b4138] text-[#e2e2eb] font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#282a30] transition-colors relative z-10">
              Authority Login
              <span className="material-symbols-outlined text-[16px]">login</span>
            </button>
          </div>

          {/* Admin Access Card */}
          <div 
            onClick={() => navigate('/auth?role=admin')}
            className="group flex flex-col items-center p-6 rounded-xl bg-[#191b22] border border-[#33343b] hover:border-[#aa897f] hover:shadow-[0_0_20px_rgba(170,137,127,0.15)] transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-16 h-16 rounded-full bg-[#282a30] flex items-center justify-center mb-4 group-hover:bg-[#33343b] transition-colors duration-300">
              <span className="material-symbols-outlined text-[#e3bfb3] group-hover:text-white transition-colors duration-300 text-3xl">
                terminal
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#e2e2eb] mb-2">Admin Access</h2>
            <p className="text-sm text-[#8B8FA8] text-center mb-6 flex-1">
              Global system configuration, user management, and AI model oversight.
            </p>
            <button className="w-full py-2.5 px-4 bg-transparent border border-[#5b4138] text-[#e2e2eb] font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#282a30] transition-colors relative z-10">
              Admin Access
              <span className="material-symbols-outlined text-[16px]">key</span>
            </button>
          </div>
        </div>

        {/* Footer / Metadata */}
        <div className="mt-12 pt-6 border-t border-[#282a30] w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8B8FA8] font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-green-400">shield</span>
            <span>Secure Supabase & AI Connection Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span>Nagpur Civic Engine v2.4.1</span>
          </div>
        </div>
      </main>
    </div>
  );
}
