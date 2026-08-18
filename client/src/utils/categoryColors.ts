export const categoryColors: Record<string, string> = {
  pothole: '#E85D04',     // Nagpur Mandarin / Asphalt Fissure
  streetlight: '#F59E0B', // Municipal Amber Illumination
  water: '#06B6D4',       // Nag River Mineral Cyan
  drainage: '#0E7490',    // Stormwater Culvert Oxide Teal
  garbage: '#65A30D',     // Solid Waste Olive
  encroachment: '#DC2626', // Zoning Hazard Barrier Red
  other: '#64748B',       // Municipal Registry Slate
};

export const categoryLabels: Record<string, string> = {
  pothole: 'Road Hazard',
  streetlight: 'Streetlight',
  water: 'Water Utility',
  garbage: 'Sanitation',
  drainage: 'Storm Drainage',
  encroachment: 'Zoning & Nuisance',
  other: 'Civic Utility',
};

export const statusColors: Record<string, string> = {
  open: '#D9534F',        // Desaturated Alert Oxide
  in_progress: '#E09F3E', // Operational Amber
  resolved: '#38B000',    // Restored Civic Green
  flagged: '#64748B',     // Flagged / Hold Slate
};

export const statusLabels: Record<string, string> = {
  open: 'Open Incident',
  in_progress: 'Crew Dispatched',
  resolved: 'Resolved',
  flagged: 'Under Review',
};
