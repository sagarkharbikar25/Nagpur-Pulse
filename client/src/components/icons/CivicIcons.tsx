interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. Pothole / Road Fissure Icon (Real asphalt fracture silhouette)
// ─────────────────────────────────────────────────────────────
export function PotholeIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Road border edges */}
      <path d="M2 19h20" />
      <path d="M2 5h20" strokeDasharray="3 3" />
      {/* Jagged road crater depression */}
      <path d="M5 19l2-6 3 2 4-5 3 4 4-3 1 8" fill={color} fillOpacity="0.12" />
      <path d="M9 13l2 3" />
      <path d="M14 10l-1 4" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Streetlight / Municipal Lamppost Profile
// ─────────────────────────────────────────────────────────────
export function StreetlightIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Post base & pole */}
      <path d="M7 21h4" />
      <path d="M9 21V6" />
      {/* Curved arm extending out */}
      <path d="M9 6c0-2.5 2-3 5-3h3" />
      {/* Lamp fixture head */}
      <path d="M17 3v3h-4l1-3h3z" fill={color} fillOpacity="0.2" />
      {/* Directional light cone rays */}
      <path d="M14 10l-2 5" strokeDasharray="2 2" />
      <path d="M16 10v6" strokeDasharray="2 2" />
      <path d="M18 10l2 5" strokeDasharray="2 2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Water / Pipeline Hydraulic Valve (Nag River Water Utility)
// ─────────────────────────────────────────────────────────────
export function WaterIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Pipeline corridor */}
      <path d="M2 15h20" />
      <path d="M2 19h20" />
      {/* Pipe vertical junction flange */}
      <path d="M9 15v-4h6v4" />
      {/* Industrial valve wheel */}
      <path d="M8 8h8" />
      <circle cx="12" cy="8" r="1.5" fill={color} />
      <path d="M12 8v3" />
      {/* Water flow droplet indicator */}
      <path d="M12 16c-1.5 0-2.5 1-2.5 2.2a2.5 2.5 0 0 0 5 0c0-1.2-1-2.2-2.5-2.2z" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Drainage / Storm Drain Slotted Manhole Grate
// ─────────────────────────────────────────────────────────────
export function DrainageIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Manhole rim casing */}
      <rect x="3" y="4" width="18" height="16" rx="2" fill={color} fillOpacity="0.08" />
      {/* Heavy drainage slot grates */}
      <line x1="7" y1="8" x2="7" y2="16" />
      <line x1="10.5" y1="8" x2="10.5" y2="16" />
      <line x1="14" y1="8" x2="14" y2="16" />
      <line x1="17.5" y1="8" x2="17.5" y2="16" />
      {/* Crossbar brace */}
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Garbage / Municipal Sanitation Receptacle
// ─────────────────────────────────────────────────────────────
export function GarbageIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Bin body */}
      <path d="M5 8l1.5 12h11L19 8" fill={color} fillOpacity="0.08" />
      {/* Bin rim and handle lid */}
      <path d="M3 8h18" />
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      {/* Internal separation ribs */}
      <line x1="10" y1="12" x2="10" y2="17" />
      <line x1="14" y1="12" x2="14" y2="17" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Encroachment / Civic Barrier & Zoning Restriction Cone
// ─────────────────────────────────────────────────────────────
export function EncroachmentIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Base platform */}
      <path d="M3 20h18" />
      {/* Pylon cone */}
      <path d="M8 20l3.5-16h1L16 20" fill={color} fillOpacity="0.1" />
      {/* Reflective hazard bands */}
      <path d="M9.8 12h4.4" />
      <path d="M10.7 8h2.6" />
      <path d="M8.9 16h6.2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. General Civic / Municipal Seal
// ─────────────────────────────────────────────────────────────
export function OtherCivicIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" fill={color} fillOpacity="0.1" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. Navigation & System Suite Icons
// ─────────────────────────────────────────────────────────────

export function RadarIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <path d="M12 12l6-6" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  );
}

export function MapLayersIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill={color} fillOpacity="0.15" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

export function InfrastructureIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="14" width="6" height="7" rx="1" />
      <rect x="9" y="8" width="6" height="13" rx="1" />
      <rect x="15" y="3" width="6" height="18" rx="1" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function AIEngineIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" fill={color} fillOpacity="0.1" />
      <circle cx="9" cy="9" r="1.5" fill={color} />
      <circle cx="15" cy="9" r="1.5" fill={color} />
      <circle cx="12" cy="15" r="1.5" fill={color} />
      <path d="M9 9l3 6 3-6" />
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
    </svg>
  );
}

export function VoiceMicIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="2" width="6" height="12" rx="3" fill={color} fillOpacity="0.15" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function TicketIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V6z" fill={color} fillOpacity="0.08" />
      <line x1="9" y1="9" x2="15" y2="9" strokeDasharray="2 2" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function ExportIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic Category Icon Resolver
// ─────────────────────────────────────────────────────────────
export function CategoryCivicIcon({ category, size = 20, className = '', color = 'currentColor' }: { category: string; size?: number; className?: string; color?: string }) {
  const norm = (category || '').toLowerCase();
  if (norm === 'pothole') return <PotholeIcon size={size} className={className} color={color} />;
  if (norm === 'streetlight') return <StreetlightIcon size={size} className={className} color={color} />;
  if (norm === 'water') return <WaterIcon size={size} className={className} color={color} />;
  if (norm === 'drainage') return <DrainageIcon size={size} className={className} color={color} />;
  if (norm === 'garbage') return <GarbageIcon size={size} className={className} color={color} />;
  if (norm === 'encroachment') return <EncroachmentIcon size={size} className={className} color={color} />;
  return <OtherCivicIcon size={size} className={className} color={color} />;
}
