---
name: IEEE RAS Kerala Event Identity
colors:
  surface: '#fff7fd'
  surface-dim: '#e1d7e2'
  surface-bright: '#fff7fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf0fc'
  surface-container: '#f5ebf6'
  surface-container-high: '#f0e5f1'
  surface-container-highest: '#eadfeb'
  on-surface: '#1f1a22'
  on-surface-variant: '#50434e'
  inverse-surface: '#342e37'
  inverse-on-surface: '#f8edf9'
  outline: '#81737f'
  outline-variant: '#d3c1cf'
  surface-tint: '#8d3e94'
  primary: '#42004a'
  on-primary: '#ffffff'
  primary-container: '#61116a'
  on-primary-container: '#d982dd'
  inverse-primary: '#fea9ff'
  secondary: '#b52140'
  on-secondary: '#ffffff'
  secondary-container: '#fe5971'
  on-secondary-container: '#5f0019'
  tertiary: '#242227'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a373d'
  on-tertiary-container: '#a5a0a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd6fb'
  primary-fixed-dim: '#fea9ff'
  on-primary-fixed: '#36003d'
  on-primary-fixed-variant: '#72247a'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b8'
  on-secondary-fixed: '#40000e'
  on-secondary-fixed-variant: '#91002b'
  tertiary-fixed: '#e7e0e8'
  tertiary-fixed-dim: '#cbc4cc'
  on-tertiary-fixed: '#1d1a20'
  on-tertiary-fixed-variant: '#49454c'
  background: '#fff7fd'
  on-background: '#1f1a22'
  surface-variant: '#eadfeb'
typography:
  display-lg:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: ibmPlexMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-mono:
    fontFamily: ibmPlexMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in a professional, editorial aesthetic that balances the technical nature of robotics with the communal atmosphere of an academic society. The brand personality is prestigious yet accessible, prioritizing clarity and spaciousness to highlight event details and technical achievements. 

The visual style leans into a **Modern Corporate** approach, utilizing a generous 8px spacing system and a clean 12-column grid. It avoids "tech-cliches" like neon glows or heavy dark modes in favor of a sophisticated light-themed environment. The interaction model is calm and deliberate, using high-quality typography and subtle depth to guide the user through complex event schedules and speaker lineups.

## Colors

The palette is derived from the IEEE Robotics and Automation Society institutional identity. 

- **Primary Action Purple (#61116A):** Reserved for high-priority interactive elements, such as primary buttons, active navigation states, and focus indicators.
- **Secondary Crimson (#98012E):** Used sparingly as a detail accent to distinguish specific tracks, filter highlights, or select metadata points.
- **Surface Hierarchy:** The background uses a soft off-white to reduce eye strain, while cards and containers use pure white to pop. 
- **Brand-tinted Surface:** Used for large section backgrounds or secondary panels to provide subtle brand presence without overwhelming the content.
- **Functional Grays:** Primary text is a deep, near-black purple to ensure high legibility while maintaining the brand's cool tonal bias.

## Typography

This design system uses a dual-font strategy to differentiate between narrative content and technical metadata.

- **Manrope:** Serves as the primary typeface for all headings and body copy. Bold weights are used for headlines to establish a clear hierarchy, while Regular and Medium weights handle readability for longer descriptions.
- **IBM Plex Mono:** Utilized for all "technical" data points. This includes event dates, timestamps, room numbers, and coordinate-style information. It provides a subtle nod to the engineering and robotics roots of the society.

Hierarchy is strictly enforced; use `label-caps` for section overlines and `label-mono` for auxiliary data like speaker titles or session categories.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop, transitioning to 8 columns for tablet and 4 columns for mobile.

- **Spacing Rhythm:** All margins, paddings, and gaps must be multiples of 8px. 
- **Editorial Layout:** On desktop, use wide margins (64px) to create a focused, centered content column. Large sections of text should ideally span 6-8 columns to maintain optimal line length.
- **Grid Alignment:** Align card edges and text blocks strictly to the grid. Use 24px gutters to provide significant breathing room between event cards or speaker profiles.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Shadows**. 

The background (#FAF9FB) sits at the lowest level. Content surfaces (#FFFFFF) sit on top with a very soft, cool-tinted shadow to indicate elevation. Shadows should be diffused with low opacity, using a hint of the primary purple in the shadow color (e.g., `rgba(97, 17, 106, 0.08)`) to maintain a cohesive look.

Avoid heavy dark borders; instead, use a 1px border (#E7E0E9) for low-elevation elements like input fields or secondary cards to keep the UI light and airy.

## Shapes

The design system employs a varied corner radius strategy to distinguish between structural containers and interactive elements:

- **Structural Panels:** Large containers, media cards, and hero sections use a 14px radius to feel modern and friendly.
- **Interactive Elements:** Buttons and input fields use a slightly tighter 10px radius, providing a distinct "clickable" feel that is softer than standard corporate styles but more structured than consumer social apps.
- **Filter Chips:** Always use a pill-shaped (fully rounded) radius to differentiate them from buttons and indicate their toggleable nature.

## Components

- **Buttons:** Primary buttons use the Brand Purple (#61116A) with white text and a 10px radius. Secondary buttons should be outlined with the Border color or use the Brand-tinted Surface with purple text.
- **Filter Chips:** Pill-shaped with a light border (#E7E0E9). Active states use the Secondary Crimson (#98012E) background with white text.
- **Cards:** White surface with 14px radius and a soft shadow. Use `label-mono` for dates at the top of the card and Manrope Bold for titles.
- **Input Fields:** 10px radius, 1px border (#E7E0E9), using Manrope Medium for placeholder text. Use the Primary Purple for the focus border state.
- **Event Timeline:** Use a vertical line in Brand-tinted Surface (#F4EDF5) with Primary Purple nodes to represent the schedule.
- **Navigation:** Clear, high-contrast links using Manrope Bold. The current page should be indicated with a subtle underline in the Secondary Crimson.