import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IssueStatusBadge, type StatusType, type CategoryType } from './IssueStatusBadge';

export interface IssueItem {
  id: string | number;
  title: string;
  description: string;
  category: CategoryType;
  status: StatusType;
  location: string;
  createdAt: string;
  severity?: 'High' | 'Medium' | 'Low';
  imageUrl?: string;
}

interface IssueCardProps {
  issue: IssueItem;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="surface-level-1"
      style={{
        borderRadius: '4px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, transform 0.1s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-structural)';
      }}
    >
      {/* Header / Meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-structural)',
          paddingBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IssueStatusBadge category={issue.category} />
          <IssueStatusBadge status={issue.status} />
        </div>
        <span className="font-label-sm" style={{ color: 'var(--tertiary-container)' }}>
          {issue.createdAt}
        </span>
      </div>

      {/* Content */}
      <div>
        <h4
          className="font-headline-md"
          style={{
            fontSize: '20px',
            lineHeight: '28px',
            color: 'var(--on-surface)',
            marginBottom: '8px',
            transition: 'color 0.15s ease'
          }}
        >
          {issue.title}
        </h4>
        <p
          className="font-body-md line-clamp-2"
          style={{ color: 'var(--secondary)', fontSize: '15px', lineHeight: '22px' }}
        >
          {issue.description}
        </p>
      </div>

      {/* Footer / Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          marginTop: 'auto'
        }}
      >
        <div
          className="font-label-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            location_on
          </span>
          <span>{issue.location}</span>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{
            minHeight: '32px',
            padding: '4px 12px',
            fontSize: '12px',
            borderRadius: '2px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          <span>View Details</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            arrow_forward
          </span>
        </button>
      </div>
    </article>
  );
};
