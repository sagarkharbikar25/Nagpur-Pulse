import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  loading = false,
  loadingText,
  fullWidth = false,
  className = '',
  disabled,
  style = {},
  ...props
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return '';
      case 'danger':
        return 'btn-primary';
      default:
        return 'btn-primary';
    }
  };

  const buttonStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : undefined,
    ...(variant === 'danger' ? { backgroundColor: 'var(--error-container)', color: '#FFFFFF' } : {}),
    ...(variant === 'ghost' ? { backgroundColor: 'transparent', border: 'none', color: 'var(--secondary)' } : {}),
    ...style
  };

  return (
    <button
      className={`${getButtonClass()} ${className}`}
      disabled={disabled || loading}
      style={buttonStyle}
      {...props}
    >
      {loading ? (
        <>
          <div
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#FFFFFF',
              borderRadius: '50%'
            }}
            className="animate-spin"
          />
          <span>{loadingText || 'Loading...'}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
