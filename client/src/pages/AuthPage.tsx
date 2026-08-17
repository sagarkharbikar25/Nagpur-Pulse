import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleBackToLogin = () => {
    setSubmitted(false);
    setEmail('');
    setName('');
    setEmailError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--bg-base)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', position: 'relative' }}>
        {/* Logo Header */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            cursor: 'pointer'
          }}
        >
          <span
            className="material-symbols-outlined fill"
            style={{ fontSize: '32px', color: 'var(--primary)' }}
          >
            dataset
          </span>
          <h1 className="font-headline-md" style={{ color: 'var(--on-surface)' }}>
            CivicReport
          </h1>
        </div>

        {/* Default State / Form */}
        {!submitted ? (
          <div
            className="surface-level-1"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--surface-variant)',
              padding: '32px 24px',
              borderRadius: '4px'
            }}
          >
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
                Welcome back
              </h2>
              <p className="font-body-md" style={{ color: 'var(--secondary)' }}>
                We'll send a magic login link to your inbox.
              </p>
            </div>

            <form onSubmit={handleSendMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name Input */}
              <Input
                label="Full Name"
                id="name"
                icon="person"
                placeholder="Jane Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Email Input */}
              <Input
                label="Email Address"
                id="email"
                icon="mail"
                placeholder="jane@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                error={emailError}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                loadingText="Sending..."
                icon="arrow_forward"
                fullWidth
                style={{
                  height: '44px',
                  backgroundColor: '#E8500A',
                  marginTop: '8px'
                }}
              >
                Send Magic Link
              </Button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a
                href="#help"
                className="font-label-sm"
                style={{
                  color: 'var(--secondary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Need assistance? Please contact support@nagpurpulse.gov');
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  help
                </span>
                Having trouble?
              </a>
            </div>
          </div>
        ) : (
          /* Success State */
          <div
            className="surface-level-1"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--surface-variant)',
              padding: '32px 24px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(232, 80, 10, 0.1)',
                border: '1px solid #E8500A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}
            >
              <span className="material-symbols-outlined" style={{ color: '#E8500A', fontSize: '32px' }}>
                mark_email_read
              </span>
            </div>

            <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
              Check your email
            </h2>
            <p className="font-body-md" style={{ color: 'var(--secondary)', marginBottom: '32px' }}>
              We sent a magic link to <strong style={{ color: 'var(--on-surface)' }}>{email}</strong>. Click the link inside to sign in.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                style={{ height: '44px', backgroundColor: 'var(--bg-base)' }}
                onClick={() => {
                  window.open(`mailto:${email}`, '_blank');
                }}
              >
                Open Email App
              </Button>

              <button
                type="button"
                className="font-label-sm"
                onClick={handleBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  margin: '8px auto 0 auto'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  arrow_back
                </span>
                Back to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
