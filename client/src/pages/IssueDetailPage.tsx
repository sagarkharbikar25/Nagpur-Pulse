import React from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { IssueDetail } from '../components/issues/IssueDetail';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      {/* Top Header */}
      <TopBar title="Issue Details" showBack={true} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto',
          padding: '32px 24px'
        }}
      >
        <IssueDetail issue={{ id: id || '1042' }} />
      </main>
    </div>
  );
};
