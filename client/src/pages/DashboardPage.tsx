import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { MobileNav } from '../components/layout/MobileNav';
import { IssueCard, type IssueItem } from '../components/issues/IssueCard';
import { IssueStatusBadge } from '../components/issues/IssueStatusBadge';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

const mockIssues: IssueItem[] = [
  {
    id: '1042',
    title: 'Severe Pothole on Main St.',
    description: 'A deep pothole has formed in the right lane going northbound, causing several cars to swerve dangerously into oncoming traffic during rush hour.',
    category: 'Infrastructure',
    status: 'reviewing',
    location: '1200 Block, Main St.',
    createdAt: 'Oct 24, 2023',
    severity: 'High'
  },
  {
    id: '1043',
    title: 'Overflowing Waste Container',
    description: 'Public waste bin near Dharampeth market has not been cleared for 3 days, causing unpleasant odor and blocking sidewalk access.',
    category: 'Sanitation',
    status: 'in_progress',
    location: 'Dharampeth Market Lane',
    createdAt: 'Oct 25, 2023',
    severity: 'Medium'
  },
  {
    id: '1044',
    title: 'Broken Streetlight at Intersection',
    description: 'Dark junction creating accident hazards for night pedestrians and commuters near Laxmi Nagar square.',
    category: 'Public Safety',
    status: 'resolved',
    location: 'Laxmi Nagar 4th Cross',
    createdAt: 'Oct 22, 2023',
    severity: 'Low'
  }
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState('All');
  const [toastVisible, setToastVisible] = useState(true);

  const wardOptions = [
    { value: 'All', label: 'All Wards' },
    { value: 'Dharampeth', label: 'Dharampeth' },
    { value: 'Dhantoli', label: 'Dhantoli' },
    { value: 'Laxmi Nagar', label: 'Laxmi Nagar' },
    { value: 'Hanuman Nagar', label: 'Hanuman Nagar' },
    { value: 'Mangalwari', label: 'Mangalwari' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Desktop Side Navigation */}
      <div className="desktop-only">
        <Sidebar onNewReport={() => navigate('/report')} />
      </div>

      {/* Main Content Area */}
      <div className="main-layout-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Top Header */}
        <TopBar showBrand={true} />

        {/* Canvas Body */}
        <main style={{ padding: '32px 24px', maxWidth: '1120px', margin: '0 auto', width: '100%' }}>
          {/* Header Banner */}
          <div
            style={{
              marginBottom: '32px',
              borderBottom: '1px solid var(--border-structural)',
              paddingBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
                  UI Component Library & Civic Feed
                </h2>
                <p className="font-body-md" style={{ color: 'var(--secondary)' }}>
                  Developer-ready building blocks mapped to the CivicReport Design System.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="primary"
                  icon="add_circle"
                  iconPosition="left"
                  onClick={() => navigate('/report')}
                >
                  New Report
                </Button>
                <Button
                  variant="secondary"
                  icon="account_circle"
                  iconPosition="left"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout for Components */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Composite Patterns (Issue Cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3
                  className="font-label-md"
                  style={{
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}
                >
                  Composite Patterns
                </h3>
                <p className="font-label-sm" style={{ color: 'var(--surface-bright)' }}>
                  High-density information displays.
                </p>
              </div>

              {/* Reusable Issue Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>

              {/* Photo Upload Control Component Preview */}
              <div
                className="surface-level-1"
                style={{ borderRadius: '4px', padding: '16px' }}
              >
                <label
                  className="font-label-sm"
                  style={{
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '12px'
                  }}
                >
                  Photo Evidence
                </label>
                <div
                  onClick={() => navigate('/report')}
                  style={{
                    border: '1px dashed var(--border-structural)',
                    borderRadius: '4px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(12, 14, 20, 0.5)',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 80, 10, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-structural)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--surface-variant)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: 'var(--secondary)', fontSize: '24px' }}
                    >
                      add_a_photo
                    </span>
                  </div>
                  <p className="font-body-md" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>
                    Drag and drop or <span style={{ color: 'var(--primary-accent)', textDecoration: 'underline' }}>browse</span>
                  </p>
                  <p className="font-label-sm" style={{ color: 'var(--tertiary-container)' }}>
                    JPEG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Atomic Elements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border-structural)', paddingBottom: '8px' }}>
                <h3
                  className="font-label-md"
                  style={{
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}
                >
                  Atomic Elements
                </h3>
              </div>

              {/* Form Controls */}
              <div
                className="surface-level-1"
                style={{
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Default Input */}
                <Input
                  label="Location (Default)"
                  placeholder="Enter street address..."
                  defaultValue="1200 Block, Main St."
                />

                {/* Error State Textarea */}
                <Textarea
                  label="Description (Error State)"
                  placeholder="Provide details..."
                  error="Description is required."
                  rows={3}
                />

                {/* Select */}
                <Select
                  label="Category (Select)"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  options={wardOptions}
                />
              </div>

              {/* Buttons & Badges */}
              <div
                className="surface-level-1"
                style={{
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div>
                  <label
                    className="font-label-sm"
                    style={{
                      color: 'var(--secondary)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '12px'
                    }}
                  >
                    Buttons
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/report')}
                    >
                      Submit Report
                    </Button>
                    <Button
                      variant="secondary"
                      icon="close"
                      iconPosition="left"
                      fullWidth
                    >
                      Cancel Action
                    </Button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-structural)', paddingTop: '16px' }}>
                  <label
                    className="font-label-sm"
                    style={{
                      color: 'var(--secondary)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '12px'
                    }}
                  >
                    Status Indicators
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <IssueStatusBadge status="resolved" />
                    <IssueStatusBadge status="urgent" />
                    <IssueStatusBadge status="reviewing" />
                    <IssueStatusBadge status="in_progress" />
                    <IssueStatusBadge status="draft" />
                  </div>
                </div>
              </div>

              {/* Toast Notification Showcase */}
              {toastVisible && (
                <div
                  className="surface-level-1"
                  style={{
                    borderLeft: '4px solid var(--primary-accent)',
                    borderRadius: '0 4px 4px 0',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ color: 'var(--primary-accent)', fontSize: '22px' }}
                    >
                      task_alt
                    </span>
                    <span className="font-body-md" style={{ color: 'var(--on-surface)', fontSize: '14px' }}>
                      Report submitted successfully.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToastVisible(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      close
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
