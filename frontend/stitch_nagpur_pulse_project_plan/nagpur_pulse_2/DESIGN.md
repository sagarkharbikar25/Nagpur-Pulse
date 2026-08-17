---
name: Nagpur Pulse
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1e1f26'
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
  tertiary-container: '#ca8100'
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

## Colors
The palette is built on a "Deep Night" foundation to reduce eye strain during extended data analysis while making the primary action color—Vibrant Orange—appear nearly self-illuminated.

- **Primary (#E8500A):** Reserved for critical actions, active states, and urgent alerts.
- **Background & Surface:** Use `#0F1117` for the primary canvas (map base/navigation) and `#1A1D27` for elevated cards, sidebars, and overlays.
- **Borders:** Every container must have a defined border using `#2A2D3A` to maintain structural integrity in a low-light UI.
- **Status Colors:** Use Success, Warning, and Danger colors specifically for data categorization (e.g., project completion status, budget overruns, or safety reports).

## Typography
The typography system creates a clear distinction between **narrative content** and **quantitative data**.

- **Inter** is the workhorse for all interface labels, headlines, and descriptive text. Use tighter letter-spacing for headlines to maintain a modern, "locked-in" feel.
- **JetBrains Mono** is utilized for any data string that requires precise reading: ID numbers, GPS coordinates, timestamps, financial figures, and status tags. This lends a technical, "ledger-like" credibility to the accountability platform.
- **Hierarchy:** Use `text_high` for primary reading and `text_muted` for metadata or secondary labels.

## Layout & Spacing
The layout follows a **Hybrid Fluid-Fixed** model. The map occupies the global background (fluid), while data panels and inspectors are positioned as fixed-width overlays or docked sidebars.

- **Grid:** Use a 12-column grid for dashboard views.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Responsiveness:** On mobile, sidebars transition into full-width bottom sheets. Large map interactions move from hover-states to tap-and-focus patterns.
- **Safe Areas:** Ensure a 24px margin from the edge of the viewport for all critical floating UI elements.

## Elevation & Depth
This design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Luminous Accents**.

- **Level 0 (Base):** Deep Navy (`#0F1117`) used for the map or background.
- **Level 1 (Surface):** Dark Charcoal (`#1A1D27`) for cards and panels. These should have a 1px solid border of `#2A2D3A`.
- **Level 2 (Overlay):** Floating modals or tooltips use the Surface color but add a 1px border of the Primary color at 30% opacity to suggest "glow."
- **Active State:** Any selected element (like a clicked precinct on a map) should utilize a subtle outer glow effect using the Primary color: `box-shadow: 0 0 12px 0px rgba(232, 80, 10, 0.3)`.

## Shapes
To maintain a professional and technical feel, the design system utilizes a **Soft-Sharp** geometry. 

- **Containers:** Use `0.25rem` (4px) corner radius for most cards and input fields. This provides just enough softness to feel modern without losing the "data-centric" rigidity.
- **Interactive Elements:** Buttons and Chips may use up to `0.5rem` (8px) to differentiate them from static containers.
- **Visual Markers:** Map pins and data points should remain geometric (diamonds or circles) to emphasize their role as precise coordinates.

## Components
- **Buttons:** Primary buttons are solid `#E8500A` with `#F2F2F2` text. Secondary buttons are outlined with `#2A2D3A` and use `JetBrains Mono` for the label to feel "utilitarian."
- **Data Cards:** Must feature a header with a `label-caps` category and a `data-lg` main metric.
- **Inputs:** Dark backgrounds (`#0F1117`) with a 1px border. On focus, the border color changes to the Primary Orange with a subtle glow.
- **Status Chips:** Use a background alpha of 10% of the status color (Success/Warning/Danger) with a solid 1px border of the same color. Text should be `data-md`.
- **Map Controls:** Floating pill-shaped buttons with high-blur backdrops to ensure legibility over complex map tiles.
- **Accountability Progress Bars:** Use a thick 8px track with the Primary color indicating progress, and a `text_muted` background track.