import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  RadarIcon,
  InfrastructureIcon,
  AIEngineIcon,
  TicketIcon,
  ExportIcon,
} from '../icons/CivicIcons';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  role?: 'citizen' | 'authority' | 'admin';
}

export default function AppLayout({
  children,
  title = 'Nagpur Pulse',
  subtitle = 'Civic Intelligence Platform',
  role = 'citizen',
}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  let storedUser = null;
  try {
    const raw = localStorage.getItem('nagpur_pulse_user');
    if (raw) storedUser = JSON.parse(raw);
  } catch {
    // ignore
  }
  const activeUser = user || storedUser;

  const citizenNav = [
    { label: 'Overview', icon: 'dashboard', path: '/dashboard' },
    { label: 'Live GIS Map', icon: 'map', path: '/home' },
    { label: 'Live Feed', icon: 'rss_feed', path: '/citizen/feed' },
    { label: 'Ward Status', icon: 'location_city', path: '/citizen/wards' },
    { label: 'Infrastructure', icon: 'construction', path: '/citizen/infrastructure' },
    { label: 'Civic AI Assistant', icon: 'psychology', path: '/citizen/ai-assistant' },
  ];

  const authorityNav = [
    { label: 'Ward Overview', icon: 'dashboard', path: '/authority/dashboard' },
    { label: 'Ward Status & Map', icon: 'analytics', path: '/authority/ward-status' },
    { label: 'Infra Management', icon: 'construction', path: '/authority/infrastructure' },
    { label: 'Official Feed', icon: 'rss_feed', path: '/authority/feed' },
    { label: 'Civic AI Hazard Hub', icon: 'psychology', path: '/authority/ai-hub' },
  ];

  const adminNav = [
    { label: 'City Overview', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'City Live Feed', icon: 'rss_feed', path: '/admin/feed' },
    { label: 'Ward Leaderboard', icon: 'leaderboard', path: '/admin/ward-performance' },
    { label: 'Master Infra Ledger', icon: 'domain', path: '/admin/infrastructure' },
    { label: 'AI Policy Hub', icon: 'psychology', path: '/admin/ai-hub' },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'authority' ? authorityNav : citizenNav;

  const renderNavIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
      case 'map':
        return <RadarIcon size={16} />;
      case 'rss_feed':
        return <TicketIcon size={16} />;
      case 'location_city':
      case 'domain':
      case 'construction':
        return <InfrastructureIcon size={16} />;
      case 'psychology':
        return <AIEngineIcon size={16} />;
      case 'leaderboard':
      case 'analytics':
        return <ExportIcon size={16} />;
      default:
        return <RadarIcon size={16} />;
    }
  };

  return (
    <div className="bg-[#0F141C] text-[#E6EDF3] min-h-screen flex flex-col md:flex-row overflow-x-hidden selection:bg-[#E85D04] selection:text-white font-sans">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col py-6 w-64 h-screen fixed left-0 top-0 border-r border-[#222D3D] bg-[#0F141C] z-40">
        <div className="px-6 mb-4">
          <div 
            className="flex items-center gap-3 mb-1 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-lg bg-[#151D28] border border-[#324259] p-1 flex items-center justify-center group-hover:border-[#E85D04] transition-colors shrink-0">
              <img src="/nagpur-logo.png" alt="Nagpur Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                NAGPUR PULSE
              </span>
              <span className="text-[9px] font-mono text-[#8B9BB4] block uppercase tracking-wider">
                {role === 'admin' ? 'Commissioner HQ' : role === 'authority' ? 'Ward Operations' : 'Civic Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links with Clean Custom SVGs */}
        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#E85D04]/15 text-[#E85D04] border-r-2 border-[#E85D04]'
                    : 'text-[#8B9BB4] hover:bg-[#182230] hover:text-white'
                }`}
              >
                <span className="shrink-0">{renderNavIcon(item.icon)}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 mt-auto space-y-3 pt-3 border-t border-[#222D3D]">
          {role === 'citizen' && (
            <button
              onClick={() => navigate('/submit')}
              className="w-full btn-primary text-xs font-display font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2"
            >
              <span>+ Report Incident</span>
            </button>
          )}

          {activeUser ? (
            <div className="space-y-1 bg-[#151D28] p-3 rounded-xl border border-[#263345]">
              <div className="text-xs text-white font-display font-bold truncate">{activeUser.name}</div>
              <div className="text-[10px] text-[#8B9BB4] font-mono truncate">{activeUser.email}</div>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="w-full flex items-center justify-between text-[#D9534F] hover:text-red-300 text-[10px] font-mono pt-2 mt-1 border-t border-[#263345] transition-colors font-bold"
              >
                <span>Logout</span>
                <span>🚪</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="w-full btn-secondary text-xs py-2 rounded-lg text-center"
            >
              <span>Official Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 ml-0 md:ml-64 min-h-screen overflow-y-auto">
        {/* Sticky Page Header */}
        <header className="sticky top-0 z-30 bg-[#0F141C]/90 backdrop-blur-md border-b border-[#222D3D] px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-display font-bold text-white tracking-tight">{title}</h1>
            <p className="text-xs text-[#8B9BB4]">{subtitle}</p>
          </div>

          {/* Role-Specific Header Actions */}
          <div className="flex items-center gap-2">
            {role === 'citizen' && (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className="hud-panel p-2 text-[#8B9BB4] hover:text-[#E85D04] transition-colors flex items-center gap-1.5 text-xs font-mono"
                  title="Open Live Map"
                >
                  <RadarIcon size={14} />
                  <span className="hidden sm:inline">Radar</span>
                </button>
                <button
                  onClick={() => navigate('/submit')}
                  className="btn-primary text-xs font-display font-bold px-3 py-2 flex items-center gap-1"
                >
                  <span>+ Report Issue</span>
                </button>
              </>
            )}

            {role === 'authority' && (
              <button
                onClick={() => navigate('/authority/ai-hub')}
                className="hud-panel hover:border-[#E09F3E] text-xs font-mono text-white px-3 py-2 flex items-center gap-1.5 transition-all"
              >
                <AIEngineIcon size={14} color="#E09F3E" />
                <span>AI Hazard Hub</span>
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => navigate('/admin/ai-hub')}
                className="hud-panel hover:border-[#4EBA6F] text-xs font-mono text-[#4EBA6F] px-3 py-2 flex items-center gap-1.5 transition-all"
              >
                <AIEngineIcon size={14} color="#4EBA6F" />
                <span>AI Policy Tuning</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Body */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
