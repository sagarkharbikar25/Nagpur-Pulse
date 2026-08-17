import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  onNewReport?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewReport }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Report Issue', path: '/report', icon: 'add_circle' },
    { label: 'My Reports', path: '/issue/1042', icon: 'history' },
    { label: 'Map View', path: '/#map', icon: 'map' },
    { label: 'UI Library', path: '/components', icon: 'widgets' },
    { label: 'Sign In / Auth', path: '/auth', icon: 'account_circle' }
  ];

  return (
    <nav
      className="surface-level-1"
      style={{
        width: '256px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        borderRight: '1px solid var(--border-structural)',
        zIndex: 40
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '0 8px', marginBottom: '32px' }}>
        <h1
          className="font-headline-md"
          style={{
            fontWeight: 700,
            color: 'var(--primary-accent)',
            fontSize: '24px',
            lineHeight: '30px'
          }}
        >
          Civic Portal
        </h1>
        <p
          className="font-label-sm"
          style={{
            color: 'var(--secondary)',
            textTransform: 'uppercase',
            marginTop: '4px',
            letterSpacing: '0.05em'
          }}
        >
          City Governance
        </p>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              color: isActive ? 'var(--primary-accent)' : 'var(--secondary)',
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? 'rgba(51, 52, 59, 0.4)' : 'transparent',
              borderRight: isActive ? '2px solid var(--primary-accent)' : 'none'
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                    color: isActive ? 'var(--primary-accent)' : 'var(--secondary)'
                  }}
                  data-weight={isActive ? 'fill' : 'regular'}
                >
                  {item.icon}
                </span>
                <span className="font-label-md">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom CTA Button */}
      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', borderRadius: '4px' }}
          onClick={() => {
            if (onNewReport) {
              onNewReport();
            } else {
              navigate('/report');
            }
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            campaign
          </span>
          <span>New Report</span>
        </button>
      </div>
    </nav>
  );
};
