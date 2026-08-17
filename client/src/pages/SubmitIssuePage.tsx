import React from 'react';
import { TopBar } from '../components/layout/TopBar';
import { IssueForm } from '../components/issues/IssueForm';

export const SubmitIssuePage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      {/* Top Header */}
      <TopBar title="Report an Issue" showBack={true} />

      {/* Main Content Canvas */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 24px',
          position: 'relative'
        }}
      >
        <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>
              Submit a Report
            </h1>
            <p className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              Provide details about the civic issue. Our AI will automatically categorize it for the appropriate department.
            </p>
          </section>

          {/* Form */}
          <IssueForm />
        </div>

        {/* Ambient Glow */}
        <div
          style={{
            position: 'fixed',
            top: '-10%',
            right: '-5%',
            width: '40%',
            height: '40%',
            backgroundColor: 'rgba(255, 219, 207, 0.05)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      </main>
    </div>
  );
};
