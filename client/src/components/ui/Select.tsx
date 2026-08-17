import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
          className="font-label-sm"
          style={{
            color: 'var(--secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          ref={ref}
          id={selectId}
          className={`input-civic ${error ? 'input-error' : ''} ${className}`}
          style={{
            height: '44px',
            paddingLeft: '12px',
            paddingRight: '36px',
            backgroundColor: 'var(--bg-base)',
            border: error ? '1px solid var(--error)' : '1px solid var(--border-structural)',
            color: 'var(--on-surface)',
            borderRadius: '4px',
            width: '100%',
            outline: 'none',
            fontFamily: 'var(--font-hanken)',
            fontSize: '16px',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--secondary)',
            pointerEvents: 'none',
            fontSize: '24px'
          }}
        >
          expand_more
        </span>
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--error)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
          <span className="font-label-sm">{error}</span>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
