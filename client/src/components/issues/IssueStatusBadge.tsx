import React from 'react';

export type StatusType = 'resolved' | 'in_progress' | 'open' | 'reviewing' | 'urgent' | 'high_severity' | 'draft' | string;
export type CategoryType = 'infrastructure' | 'sanitation' | 'public_safety' | 'pothole' | 'water' | 'roads' | string;

interface IssueStatusBadgeProps {
  status?: StatusType;
  category?: CategoryType;
  text?: string;
  icon?: string;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({
  status,
  category,
  text,
  icon
}) => {
  if (category) {
    let catIcon = icon || 'category';
    let catLabel = text || category;

    switch (category.toLowerCase()) {
      case 'infrastructure':
        catIcon = icon || 'maps_ar';
        catLabel = text || 'Infrastructure';
        break;
      case 'sanitation':
        catIcon = icon || 'delete';
        catLabel = text || 'Sanitation';
        break;
      case 'public_safety':
      case 'public safety':
        catIcon = icon || 'security';
        catLabel = text || 'Public Safety';
        break;
      case 'pothole':
        catIcon = icon || 'warning';
        catLabel = text || 'Pothole';
        break;
      default:
        break;
    }

    return (
      <span
        className="font-label-sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '2px',
          textTransform: 'uppercase',
          backgroundColor: 'rgba(51, 52, 59, 0.5)',
          border: '1px solid var(--border-structural)',
          color: 'var(--secondary)',
          fontSize: '12px',
          fontWeight: 500
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          {catIcon}
        </span>
        {catLabel}
      </span>
    );
  }

  // Status Badge
  let badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 500
  };

  let badgeIcon = icon;
  let badgeText: string | undefined;

  switch (status?.toLowerCase()) {
    case 'resolved':
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        color: '#4ADE80'
      };
      badgeIcon = badgeIcon || 'check_circle';
      badgeText = text || 'Resolved';
      break;

    case 'in_progress':
    case 'in progress':
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        color: '#FBBF24'
      };
      badgeIcon = badgeIcon || 'pending';
      badgeText = text || 'In Progress';
      break;

    case 'reviewing':
    case 'pending':
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'rgba(232, 80, 10, 0.1)',
        border: '1px solid #E8500A',
        color: '#E8500A'
      };
      badgeIcon = badgeIcon || 'pending';
      badgeText = text || 'Reviewing';
      break;

    case 'urgent':
    case 'high_severity':
    case 'high severity':
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'rgba(255, 180, 171, 0.1)',
        border: '1px solid var(--error)',
        color: 'var(--error)'
      };
      badgeIcon = badgeIcon || 'warning';
      badgeText = text || (status === 'urgent' ? 'Urgent' : 'High Severity');
      break;

    case 'open':
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        border: '1px solid rgba(248, 113, 113, 0.4)',
        color: '#F87171'
      };
      badgeIcon = badgeIcon || 'radio_button_checked';
      badgeText = text || 'Open';
      break;

    case 'draft':
    default:
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'var(--surface-variant)',
        border: '1px solid var(--border-structural)',
        color: 'var(--on-surface)'
      };
      badgeText = text || status || 'Draft';
      break;
  }

  return (
    <span className="font-label-sm" style={badgeStyle}>
      {badgeIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          {badgeIcon}
        </span>
      )}
      {badgeText}
    </span>
  );
};
