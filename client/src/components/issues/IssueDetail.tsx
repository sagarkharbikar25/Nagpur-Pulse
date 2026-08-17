import React, { useState } from 'react';
import { IssueStatusBadge } from './IssueStatusBadge';

export interface TimelineEvent {
  title: string;
  timestamp: string;
  description?: string;
  note?: string;
  statusType: 'resolved' | 'in_progress' | 'open';
}

export interface IssueDetailData {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  category: string;
  location: string;
  reportedOn: string;
  description: string;
  aiSummary: string;
  evidenceImages: string[];
  timeline: TimelineEvent[];
}

interface IssueDetailProps {
  issue?: Partial<IssueDetailData>;
}

const defaultIssueData: IssueDetailData = {
  id: '1042',
  severity: 'High',
  category: 'Pothole',
  location: 'Dharampeth, Main Road',
  reportedOn: 'Oct 24, 2023 - 14:30',
  description: "Large pothole formed after recent rains near the central square. It's causing traffic slowdowns and is dangerous for two-wheelers especially at night.",
  aiSummary: 'Severe road damage reported post-rainfall in high-traffic area. Requires urgent structural assessment and filling to prevent accidents.',
  evidenceImages: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZsntHlORgxaZQeR7PxWdTxxx5NEb-PaFlwbAnxjm4SvkjheBoqzUI8GiPRsx46REd9oLJ_9l0op0OCwobnRRv-9bzeqDHo22JIGgEyAyrGQsfLg5vod2VhyGqBpgwxwiJ4LNq8vzJ-2wdZwX8WJQous2kSkQrTIyR7HbrUl9p9lB4RZj_MLEXp39CPxf9iiRcAn5vtgBOHH8FXMc4Ns2KaPz895F3gJr_aB9mKgDmURbGRh2jWIZN1A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuApqs3xlwgzqy3QEj866ByF97ehsqfqBUMn0SWAnefErchke3kyNUHLRSti4VSEuZs8VEG5ryhNzODAeftivpb761DkqUh_C7_1v5t3NBqFr950SJNVYVEc9aYI8rIXbkPDqz-iiGQctzbKkR2FMO_tSu5Lstpelg-OrnNFG8sK1z3Lti9kiDq2Hurn4rZyUQaWEkXjsryjVb7_Dk1RcbsN-N-uyAGPEqYQVI64QFmMtdWfotKl1adzbw'
  ],
  timeline: [
    {
      title: 'Resolved',
      timestamp: 'Oct 26, 09:15',
      note: 'Pothole has been filled and leveled with temporary asphalt. Permanent road relaying scheduled for next quarter.',
      statusType: 'resolved'
    },
    {
      title: 'In Progress',
      timestamp: 'Oct 25, 11:00',
      description: 'Maintenance crew assigned to location.',
      statusType: 'in_progress'
    },
    {
      title: 'Open',
      timestamp: 'Oct 24, 14:30',
      description: 'Issue logged in system and pending review.',
      statusType: 'open'
    }
  ]
};

export const IssueDetail: React.FC<IssueDetailProps> = ({ issue }) => {
  const data = { ...defaultIssueData, ...issue };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Issue Header Card */}
      <div
        className="surface-level-1"
        style={{
          borderRadius: '4px',
          padding: '24px',
          backgroundColor: 'var(--surface-container)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}
        >
          <div>
            <span
              className="font-label-sm"
              style={{
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Issue ID
            </span>
            <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>
              #{data.id}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <IssueStatusBadge status="high_severity" text={`${data.severity} Severity`} />
            <IssueStatusBadge category={data.category} />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            borderTop: '1px solid var(--border-structural)',
            paddingTop: '16px'
          }}
        >
          <div>
            <span
              className="font-label-sm"
              style={{
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Location
            </span>
            <p
              className="font-body-md"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--on-surface)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--secondary)' }}>
                location_on
              </span>
              {data.location}
            </p>
          </div>

          <div>
            <span
              className="font-label-sm"
              style={{
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Reported On
            </span>
            <p
              className="font-body-md"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--on-surface)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--secondary)' }}>
                calendar_today
              </span>
              {data.reportedOn}
            </p>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Original Description */}
        <div
          className="surface-level-1"
          style={{
            borderRadius: '4px',
            padding: '16px',
            backgroundColor: 'var(--surface-container)'
          }}
        >
          <span
            className="font-label-sm"
            style={{
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Original Description
          </span>
          <p className="font-body-md" style={{ color: 'var(--on-surface)', lineHeight: '24px' }}>
            {data.description}
          </p>
        </div>

        {/* AI Summary */}
        <div
          style={{
            backgroundColor: 'var(--surface-bright)',
            border: '1px solid rgba(255, 181, 156, 0.3)',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--primary)', fontSize: '24px', flexShrink: 0 }}
          >
            smart_toy
          </span>
          <div>
            <span
              className="font-label-sm"
              style={{
                color: 'var(--primary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              AI Summary
            </span>
            <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: '24px' }}>
              {data.aiSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div>
        <span
          className="font-label-sm"
          style={{
            color: 'var(--secondary)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          Attached Evidence
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px'
          }}
        >
          {data.evidenceImages.map((src, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(src)}
              style={{
                aspectRatio: '16/9',
                backgroundColor: 'var(--surface-bright)',
                borderRadius: '4px',
                border: '1px solid var(--border-structural)',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <img
                src={src}
                alt={`Evidence ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(15, 17, 23, 0.4)',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#FFFFFF', fontSize: '28px' }}>
                  zoom_in
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Status Timeline */}
      <div>
        <h3
          className="font-headline-md"
          style={{
            color: 'var(--on-surface)',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-structural)'
          }}
        >
          Resolution Status
        </h3>

        <div
          style={{
            position: 'relative',
            borderLeft: '1px solid var(--border-structural)',
            marginLeft: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingBottom: '16px'
          }}
        >
          {data.timeline.map((event, idx) => {
            const isResolved = event.statusType === 'resolved';
            const isInProgress = event.statusType === 'in_progress';

            const dotColor = isResolved ? '#4ADE80' : isInProgress ? '#FBBF24' : '#F87171';

            return (
              <div key={idx} style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Status Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#1A1D27',
                    border: `2px solid ${dotColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isResolved && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#4ADE80'
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}
                >
                  <span
                    className="font-label-md"
                    style={{
                      color: 'var(--on-surface)',
                      fontWeight: isResolved ? 700 : 500
                    }}
                  >
                    {event.title}
                  </span>
                  <span className="font-label-sm" style={{ color: 'var(--secondary)' }}>
                    {event.timestamp}
                  </span>
                </div>

                {event.description && (
                  <p
                    className="font-body-md"
                    style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginTop: '4px' }}
                  >
                    {event.description}
                  </p>
                )}

                {event.note && (
                  <div
                    style={{
                      backgroundColor: '#1A1D27',
                      border: '1px solid var(--border-structural)',
                      borderRadius: '4px',
                      padding: '12px',
                      marginTop: '8px'
                    }}
                  >
                    <span
                      className="font-label-sm"
                      style={{
                        color: 'var(--secondary)',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px'
                      }}
                    >
                      Resolution Note
                    </span>
                    <p
                      className="font-body-md"
                      style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '20px' }}
                    >
                      {event.note}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '900px', width: '100%' }}>
            <img
              src={selectedImage}
              alt="Evidence detail"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '4px',
                border: '1px solid var(--border-structural)'
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0px',
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                close
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
