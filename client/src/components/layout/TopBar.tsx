import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showBrand?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  showBrand = true
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className="surface-level-1"
      style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: '64px',
        borderBottom: '1px solid var(--border-structural)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              arrow_back
            </span>
            <span className="font-headline-md" style={{ color: 'var(--primary)', fontSize: '20px' }}>
              {title || 'Back'}
            </span>
          </button>
        ) : showBrand ? (
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '28px', color: 'var(--primary-accent)' }}
              data-weight="fill"
            >
              dataset
            </span>
            <span
              className="font-display"
              style={{
                fontSize: '24px',
                lineHeight: '32px',
                color: 'var(--primary)',
                letterSpacing: '-0.02em'
              }}
            >
              CivicReport
            </span>
          </div>
        ) : title ? (
          <h1 className="font-headline-md" style={{ color: 'var(--on-surface)', fontSize: '20px' }}>
            {title}
          </h1>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)' }}>
        <button
          type="button"
          aria-label="Notifications"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--on-surface-variant)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={() => alert('Notifications: No unread alerts')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            notifications
          </span>
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--primary-accent)',
              borderRadius: '50%'
            }}
          />
        </button>

        <button
          type="button"
          aria-label="Account Profile"
          onClick={() => navigate('/auth')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--on-surface-variant)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
};
