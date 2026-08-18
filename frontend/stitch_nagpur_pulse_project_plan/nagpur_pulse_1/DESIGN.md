---
name: Nagpur Pulse
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1d1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33343b'
  on-surface: '#e2e2eb'
  on-surface-variant: '#e3bfb3'
  inverse-surface: '#e2e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#aa897f'
  outline-variant: '#5b4138'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1900'
  primary-container: '#fa5c1b'
  on-primary-container: '#511500'
  inverse-primary: '#aa3600'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#c2842f'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#111319'
  on-background: '#e2e2eb'
  surface-variant: '#33343b'
  surface-base: '#0F1117'
  surface-elevated: '#1A1D27'
  border-subtle: '#2A2D3A'
  nagpur-orange: '#E8500A'
  data-green: '#4AE176'
  data-amber: '#FFB95F'
  data-red: '#FFB4AB'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  sidebar-width: 320px
  header-height: 64px
---

## Brand & Style

The design system is engineered for civic accountability and real-time data visualization. It targets a citizenry that demands transparency, utilizing a **Modern-Technical** aesthetic that blends high-utility SaaS patterns with the urgency of a newsroom dashboard.

The interface prioritizes information density and clarity. It avoids soft, organic shapes in favor of a rigid, grid-aligned structure. The emotional response is one of **rigorous professionalism and civic vigilance**. Visual interest is generated through high-contrast accents and subtle luminous effects on data points, suggesting a "live" pulse of the city's infrastructure and governance.

**Key Principles:**
- **Professionalism:** Precise alignment and restrained use of color.
- **Transparency:** Clear data visualization with technical credibility.
- **Accountability:** High-contrast status indicators that demand attention.

## Colors

The palette is built on a "Deep Night" foundation to reduce eye strain during extended data analysis while making the primary action color—Nagpur Orange—appear nearly self-illuminated.

- **Primary (#E8500A):** Reserved for critical actions, active states, and urgent alerts. It represents the energy and pulse of the city.
- **Surface Strategy:** Use `#0F1117` for the primary canvas (map base/navigation) and `#1A1D27` for elevated cards, sidebars, and overlays.
- **Borders:** Structural integrity is maintained through consistent use of `#2A2D3A` for container outlines.
- **Status Colors:** Success (Green), Warning (Amber), and Danger (Red) are strictly utility-driven, used for project completion status, budget overruns, or safety reports.

## Typography

The typography system creates a clear distinction between narrative content and quantitative data.

- **Inter** handles all interface labels, headlines, and descriptive text. Tighter letter-spacing is applied to headlines for a "locked-in," authoritative feel.
- **JetBrains Mono** is mandatory for any data string requiring precise reading: ID numbers, GPS coordinates, timestamps, and financial figures. This lends a technical "ledger-like" credibility.
- **Label Caps:** Use for category headers and small metadata tags to differentiate from body prose.

## Layout & Spacing

The design system utilizes a **Hybrid Fluid-Fixed** model. The spatial experience is dominated by a fluid background (usually a map) with fixed-width data panels and inspectors positioned as overlays.

- **Grid:** A 12-column grid is used for dashboard views and data-heavy pages.
- **Rhythm:** An 8px linear scale (with 4px sub-steps) governs all padding and margins to maintain a dense, professional layout.
- **Safe Areas:** Ensure a 24px margin from the edge of the viewport for all floating UI elements.
- **Reflow:** On mobile, sidebars transition into full-width bottom sheets. Interaction patterns shift from hover-heavy desktop tooltips to tap-and-focus patterns.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layering** and **Luminous Accents**.

- **Level 0 (Base):** Deep Navy (`#0F1117`) background.
- **Level 1 (Surface):** Dark Charcoal (`#1A1D27`) for cards and panels, defined by a 1px solid border (`#2A2D3A`).
- **Level 2 (Overlay):** Floating modals use the Surface color but add a 1px border of the Primary color at 30% opacity to create a subtle "active glow."
- **Focus States:** Selected elements on the map or in the list utilize a subtle outer glow: `box-shadow: 0 0 12px 0px rgba(232, 80, 10, 0.3)`.
- **Dotted Grids:** Use a 1px dotted pattern for the background of data sections to emphasize the technical, planned nature of the platform.

## Shapes

The design system utilizes a **Soft-Sharp** geometry to maintain a professional feel.

- **Containers:** A `0.25rem` (4px) corner radius is standard for cards and input fields, providing a modern edge without losing rigidity.
- **Interactive Elements:** Buttons and Chips may use `0.5rem` (8px) to provide a clearer tactile affordance.
- **Data Markers:** Map pins and data points remain strictly geometric (diamonds, squares, or circles) to represent precision.

## Components

- **Buttons:** Primary buttons are solid `#E8500A` with high-contrast text. Secondary buttons are outlined with `#2A2D3A` and use `JetBrains Mono` for labels to feel utilitarian.
- **Data Cards:** Must feature a header with `label-caps` text and a `data-lg` main metric. Borders are mandatory.
- **Inputs:** Dark backgrounds (`#0F1117`) with a 1px border. On focus, the border transitions to Primary Orange with a subtle outer glow.
- **Status Chips:** Background at 10% alpha of the status color with a solid 1px border of the same color. Text uses `data-md`.
- **Map Controls:** Floating pill-shaped buttons with high-blur (glassmorphism) backdrops to ensure legibility against complex map backgrounds.
- **Progress Bars:** Use a thick 8px track. The primary color indicates progress against a muted background track.
- **Technical Lists:** Use alternating row highlights (zebra striping) at 2% opacity for high-density data tables.