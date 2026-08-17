import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  icon,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
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
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--secondary)',
              fontSize: '20px',
              pointerEvents: 'none'
            }}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-civic ${error ? 'input-error' : ''} ${className}`}
          style={{
            height: '44px',
            paddingLeft: icon ? '40px' : '12px',
            paddingRight: '12px',
            backgroundColor: 'var(--bg-base)',
            border: error ? '1px solid var(--error)' : '1px solid var(--border-structural)',
            color: 'var(--on-surface)',
            borderRadius: '4px',
            width: '100%',
            outline: 'none',
            fontFamily: 'var(--font-hanken)',
            fontSize: '16px'
          }}
          {...props}
        />
      </div>
      {error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--error)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
          <span className="font-label-sm">{error}</span>
        </div>
      ) : helperText ? (
        <span className="font-label-sm" style={{ color: 'var(--tertiary-container)', marginTop: '4px' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxCharCount?: number;
  aiHelpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  charCount,
  maxCharCount,
  aiHelpText,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label
          htmlFor={textareaId}
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
      <textarea
        ref={ref}
        id={textareaId}
        className={`input-civic ${error ? 'input-error' : ''} ${className}`}
        style={{
          minHeight: '100px',
          padding: '10px 12px',
          backgroundColor: 'var(--bg-base)',
          border: error ? '1px solid var(--error)' : '1px solid var(--border-structural)',
          color: 'var(--on-surface)',
          borderRadius: '4px',
          width: '100%',
          outline: 'none',
          fontFamily: 'var(--font-hanken)',
          fontSize: '16px',
          resize: 'vertical'
        }}
        {...props}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        {aiHelpText ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>auto_awesome</span>
            <span className="font-label-sm">{aiHelpText}</span>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--error)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
            <span className="font-label-sm">{error}</span>
          </div>
        ) : <div />}

        {maxCharCount !== undefined && (
          <span
            className="font-label-sm"
            style={{
              color: (charCount || 0) > maxCharCount ? 'var(--error)' : 'var(--tertiary-container)'
            }}
          >
            {charCount || 0} / {maxCharCount}
          </span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
