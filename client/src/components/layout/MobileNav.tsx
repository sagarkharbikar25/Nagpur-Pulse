import React from 'react';
import { NavLink } from 'react-router-dom';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Report', path: '/report', icon: 'campaign' },
    { label: 'Activity', path: '/issue/1042', icon: 'list_alt' },
    { label: 'Profile', path: '/auth', icon: 'person' }
  ];

  return (
    <nav
      className="surface-level-1 mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '64px',
        borderTop: '1px solid var(--border-structural)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'var(--surface-level-1)'
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '100%',
            padding: '0 12px',
            textDecoration: 'none',
            color: isActive ? 'var(--primary-accent)' : 'var(--on-surface-variant)',
            transition: 'color 0.15s ease, transform 0.1s ease'
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '32px',
                    height: '3px',
                    backgroundColor: 'var(--primary-accent)',
                    borderBottomLeftRadius: '2px',
                    borderBottomRightRadius: '2px'
                  }}
                />
              )}
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  color: isActive ? 'var(--primary-accent)' : 'var(--on-surface-variant)'
                }}
                data-weight={isActive ? 'fill' : 'regular'}
              >
                {item.icon}
              </span>
              <span
                className="font-label-sm"
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  marginTop: '2px'
                }}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
