# Google Stitch Prompt

Create a high-fidelity, responsive, multi-page website design for **RAS Day**, an event showcase run by the **IEEE Robotics and Automation Society Kerala Chapter (IEEE RAS KC)**.

Use the uploaded IEEE Robotics & Automation Society logo as the primary brand reference. Preserve the logo exactly as supplied. Do not redraw it, recolor it, crop it, distort it, add effects to it, or place it on a low-contrast background.

## Project objective

RAS Day is a curated public showcase of robotics and automation events organized by IEEE RAS Student Branch Chapters (SBCs) at colleges across Kerala. The website should help visitors:

1. Understand what RAS Day is immediately.
2. Discover participating Student Branch Chapters without seeing an overwhelming wall of event cards.
3. Open an SBC page and browse the events organized by that chapter.
4. Open an event to read its location and full description.
5. Browse older events in a clear archive.

This is a public showcase and gallery, not an admin dashboard, registration portal, news site, or event-booking product. Do not add sign-up flows, pricing, user accounts, dashboards, or invented calls to register.

## Design read

Read this as a modern institutional event showcase for students, faculty, chapter organizers, and IEEE visitors. It should feel credible, thoughtful, contemporary, and distinctly connected to robotics without using science-fiction visual cliches.

Use these design dials:

- `DESIGN_VARIANCE: 6/10` - composed and editorial, with selective asymmetry.
- `MOTION_INTENSITY: 4/10` - restrained motion used for hierarchy and feedback.
- `VISUAL_DENSITY: 4/10` - spacious enough to feel curated, but not empty.

The result should look custom-designed for IEEE RAS Kerala Chapter. It must not resemble a generic conference template, startup landing page, or AI product website.

## Brand and color system

Use a light theme only across every page. Do not create dark sections or a dark-mode toggle.

Derive the palette from the uploaded logo:

- Primary brand purple: `#61116A`
- Secondary brand crimson: `#98012E`
- Main page background: `#FAF9FB`
- Elevated surface: `#FFFFFF`
- Primary text: `#1D1820`
- Muted text: `#6F6672`
- Border and divider: `#E7E0E9`
- Subtle brand-tinted surface: `#F4EDF5`

Use purple for primary actions, selected navigation, focus emphasis, and major accents. Use crimson more sparingly for small active details and selected filter states. Do not introduce blue, teal, orange, neon, or any unrelated accent. Do not apply generic purple glow effects. If a gradient is used at all, it must be a very restrained blend of the two brand colors in a small decorative area, never gradient headline text or a full-page mesh.

Keep photography in natural color with consistent, slightly cool grading. The page background should remain bright and neutral.

## Typography

Use **Manrope** for display and body text, with **IBM Plex Mono** only for small metadata such as dates or locations. The overall voice should be precise, warm, and direct.

- Desktop hero title: approximately 64-72 px, bold, tight tracking, maximum two lines.
- Mobile hero title: approximately 42-48 px.
- Section headings: 36-48 px desktop and 30-36 px mobile.
- Body copy: 16-18 px with comfortable line height and a maximum readable width near 65 characters.
- Small metadata: 12-13 px, never too faint to read.

Avoid all-caps labels above every heading. Across the whole home page, use no more than two small eyebrow labels.

## Layout and visual language

Use a max content width around 1280 px, a clear 12-column desktop grid, generous outer margins, and an 8 px spacing system. Prefer editorial grouping, whitespace, and subtle dividers over boxed cards.

Use a consistent shape system:

- Media and major content panels: 14 px radius.
- Buttons and inputs: 10 px radius.
- Filter chips may be pill-shaped because they are compact controls.
- Avoid mixing many unrelated corner radii.

Use very subtle, cool-tinted shadows only when elevation communicates hierarchy. Event cards should look like gallery figures, not floating dashboard cards: image first, event name below, no unnecessary surface box.

Robotics should be communicated through authentic event photography and precise layout, not through glowing circuits, holograms, 3D chrome robots, fake dashboards, code snippets, hexagonal sci-fi patterns, or decorative technical grids.

Use real or generated documentary-style placeholder photography that shows student teams building robots, workshops, demonstrations, competitions, electronics workbenches, and campus collaboration. Make every image clearly replaceable with the real event photography later. Do not fabricate captions, awards, participant counts, or institutional claims.

## Shared header and navigation

Create a sticky but lightweight header, 68-72 px high on desktop:

- Uploaded IEEE RAS logo on the left, rendered clearly at approximately 38-44 px high with adequate clear space.
- Navigation on the right: `Home`, `Chapters`, `Archive`, `About`.
- Active page indicated with typography and a short brand-colored underline, not a colored dot.
- Keep all desktop navigation on one line.
- On mobile, use the logo plus a simple menu button that opens an accessible full-width menu sheet.

Do not add a duplicate header CTA. The navigation links are enough.

## Required screens and routes

Create one connected design system and the following five reusable screen templates. Show polished desktop layouts at 1440 px and explicit mobile layouts at 390 px. Preserve the same header, footer, colors, typography, spacing, and component rules across all screens.

### 1. Home page

The home page should introduce RAS Day, create visual interest, and route people toward chapters. It must not dump every event onto the landing page.

#### Hero

Use an asymmetric split hero that fits within the initial viewport beneath the header.

Left side:

- Eyebrow: `IEEE RAS Kerala Chapter`
- Main heading: `RAS Day`
- Supporting copy: `A statewide showcase of robotics events led by IEEE RAS student chapters across Kerala.`
- Primary button: `Explore chapters`
- Secondary text link: `View archive`

Right side:

- A refined editorial composition of one dominant robotics-event photograph and two smaller supporting photographs.
- Use varied but aligned image proportions, not three equal cards.
- Keep the images documentary and human, showing students actively making or demonstrating robotics projects.
- Add no text badges or decorative labels over the images.

The hero should feel confident and spacious. Keep both calls to action visible without scrolling. Do not add stats, trust logos, a countdown, a scrolling prompt, floating particles, or decorative copy below the buttons.

#### Chapter navigator

Use the heading `Explore Student Branch Chapters` and the copy `Start with a chapter, then discover the events its student community brought to life.`

Create an editorial chapter directory preview instead of a card wall:

- Use a two-column composition on desktop.
- One side contains a large preview image or selected chapter image.
- The other side contains a clean vertical index of a limited number of featured SBCs.
- Each row shows only `Student Branch Chapter Name` and `College Name`, followed by a simple arrow icon.
- Hovering or focusing a row updates the preview image with a short, smooth crossfade.
- Selecting a row opens that SBC detail page.
- End the section with one link: `View all chapters`.

On mobile, place the preview image above a single-column chapter list. Do not require hover to understand or use the list.

#### Recent moments

Use the heading `Recent moments from RAS Day`.

Show only four curated event entries in an asymmetric editorial gallery, not an equal three-card feature row. Each event entry must contain exactly:

- One event photograph.
- The main event name beneath the photograph.

Do not show date, college, location, category, badges, or descriptions on these event cards. Clicking an entry opens its event detail screen.

#### About RAS Day

Create a calm, full-width statement section using a subtle brand-tinted background. Use the heading `Built by student communities across Kerala` and concise copy explaining that RAS Day brings together the robotics and automation activities organized by IEEE RAS Student Branch Chapters. Include no invented numbers or claims.

#### Archive callout

Create a simple, high-contrast callout near the footer:

- Heading: `Looking for an earlier event?`
- Supporting text: `Browse past RAS Day activities by year and Student Branch Chapter.`
- Button: `Open archive`

This should be a composed horizontal band on desktop and a vertical stack on mobile, not another card grid.

### 2. All chapters page

Create a dedicated directory page titled `Student Branch Chapters` with the supporting copy `Explore the colleges and student communities contributing to RAS Day.`

Include:

- A clearly labeled search field: `Search chapters or colleges`.
- An alphabetical chapter index or two-column editorial list, depending on the amount of content.
- Each chapter entry shows a replaceable chapter image, `Student Branch Chapter Name`, and `College Name`.
- No invented event counts, rankings, status badges, dates, or statistics.
- Selecting an entry opens the reusable SBC detail page.

Keep the directory easy to scan and avoid placing every chapter inside an elevated white card. Use whitespace and a single subtle divider between rows. On mobile, collapse to one column with large touch targets.

Include a useful zero-results state with the message `No chapters match that search.` and a `Clear search` action.

### 3. Reusable SBC detail page

This page is the main gallery for one Student Branch Chapter.

Top section:

- Breadcrumb: `Home / Chapters / Student Branch Chapter Name`
- Large chapter title: `Student Branch Chapter Name`
- Secondary line: `College Name`
- A concise chapter description placeholder.
- One wide, replaceable chapter or campus-event photograph.

Current event gallery:

- Heading: `Events by this chapter`
- Optional year filter only if there are events across multiple active years.
- Use a spacious responsive gallery with up to three columns on wide screens, two on tablet, and one on mobile.
- Every event card must contain exactly one photograph and the main event name below it.
- Do not place location, date, description, college name, category, tags, or buttons inside the card.
- The entire card is clickable and has a clear keyboard focus state.
- Image aspect ratios may vary subtly for an editorial rhythm, but titles and spacing should remain aligned.

If this SBC has older events, include one understated link after the current gallery: `View archived events from this chapter`.

Create an empty state for chapters without published events: `No events have been published for this chapter yet.` Do not fill the state with fake content.

### 4. Reusable event detail page

Create a dedicated, deep-linkable event detail page instead of a modal so the event can be shared and viewed comfortably on mobile.

Use a strong 7/5 desktop split:

- One side contains a large event photograph with a stable aspect ratio.
- The other side contains the event name, chapter identity, location, optional date, and description.

Information hierarchy:

- Breadcrumb: `Home / Chapters / Student Branch Chapter Name / Event Name`
- Main heading: `Event Name`
- Organizer line: `Organized by Student Branch Chapter Name`
- Clearly labeled metadata rows for `Location` and `Date`. Omit the date row completely when no date is supplied.
- Section heading: `About the event`
- Full event description.

If more real photos are available, add a restrained photo gallery below the description. Use two or three varied image sizes and no fake captions. If only one image exists, do not render an empty gallery.

End with `More from this chapter`, showing two related event cards that follow the same strict image-plus-name rule, and a text link `Back to chapter`.

### 5. Archive page

Create a page titled `Event archive` with the supporting copy `Past RAS Day events, organized for easy browsing.`

Prevent clutter through progressive filtering:

- A search field labeled `Search events`.
- A year selector labeled `Year`.
- A chapter selector labeled `Student Branch Chapter`.
- A visible `Clear filters` action when filters are active.
- Default to the most recent archived year when archive data exists.

Group results first by year and then by Student Branch Chapter. Within each chapter group, display event cards using exactly one photograph and the event name. Do not add metadata to the cards. Use generous spacing between groups so the hierarchy is obvious.

Use pagination or a restrained `Load more` action if a selected group contains many events. Do not create an endless wall of cards.

Include the zero-results state `No archived events match these filters.` with a `Clear filters` action.

## Footer

Use a restrained footer on the same light theme:

- Uploaded IEEE RAS logo.
- Links: `Home`, `Chapters`, `Archive`, `About`.
- Text: `IEEE Robotics and Automation Society Kerala Chapter`.
- A simple copyright line without inventing an address, phone number, email address, social handle, or legal link.

Do not add a newsletter form or oversized footer CTA.

## Content rules

The real names of chapters, colleges, events, dates, and locations have not been supplied yet. Where content is needed for the design, use clearly replaceable neutral placeholders such as:

- `Student Branch Chapter Name`
- `College Name`
- `Event Name`
- `Event Location`
- `Event description goes here.`

Do not invent college names, chapter names, event titles, participant counts, dates, awards, testimonials, sponsors, statistics, or claims. Do not use Lorem Ipsum.

Model the content so it can later be replaced with:

- SBC: name, college name, optional description, cover image, list of events.
- Event: name, primary photograph, location, description, optional date, optional additional photographs, archive status.

## Interaction and motion

Motion must be subtle and purposeful:

- Gentle opacity and 16-24 px vertical reveal for the hero content on first load.
- A short stagger for the three hero photographs.
- Small image scale from 1.00 to approximately 1.03 on event-card hover.
- Smooth title color and underline transitions on links.
- Crossfade when the active chapter preview changes.
- Tactile button press with a very small scale reduction.

Animate only transform and opacity. Do not use parallax, scroll hijacking, marquees, auto-playing carousels, magnetic cursors, perpetual loops, or dramatic page transitions. Respect `prefers-reduced-motion` and provide a fully static equivalent.

## Responsive behavior

Design every screen for desktop and mobile, not as a desktop layout that merely shrinks.

- Below 768 px, all asymmetric layouts collapse into a clear single column.
- Use 20-24 px horizontal page padding on mobile.
- Keep all tap targets at least 44 px.
- Place headings and supporting copy above related media on mobile.
- Preserve the event-card rule of photograph plus event name only.
- Filters become a compact stacked toolbar or accessible filter sheet on mobile.
- Breadcrumbs may wrap or collapse to a back link on narrow screens.
- Never use a fixed `100vh` layout that can jump under a mobile browser toolbar.

## Accessibility and quality requirements

- Meet WCAG AA contrast for all body text, controls, focus rings, and button labels.
- Use semantic heading order and clear landmarks.
- Every input has a visible label. Do not use placeholder text as the only label.
- Provide visible keyboard focus states using the brand purple.
- Use descriptive alt-text placeholders for meaningful images and empty alt text for purely decorative images.
- Do not communicate selection through color alone.
- Reserve image space to prevent layout shifts.
- Ensure button labels stay on one line at desktop sizes.
- Include loading skeletons shaped like the chapter and event layouts rather than generic spinners.
- Include the specified empty and zero-results states.

## Prototype connections

Connect the screens into a clickable prototype:

- `Explore chapters` and `View all chapters` open the All Chapters page.
- A chapter entry opens the SBC detail page.
- An event card opens the Event Detail page.
- `View archive`, `Open archive`, and the header `Archive` link open the Archive page.
- `Back to chapter` returns to the correct SBC page.
- The logo returns to Home.
- The `About` navigation item scrolls to the About RAS Day section on Home.

## Explicit exclusions

Do not use:

- Dark mode or isolated dark sections.
- Generic AI purple glows, aurora meshes, or neon gradients.
- Giant robot renders or futuristic city imagery.
- Three identical feature cards.
- Glassmorphism.
- Gradient headline text.
- Fake dashboards, terminal windows, or code panels.
- Decorative circuit boards, crosshair grids, or floating particles.
- Scroll prompts, countdown timers, weather, or location strips.
- Decorative colored dots.
- Emojis.
- Stock testimonials, sponsor logos, or fake statistics.
- Excessive badges, pills, eyebrows, or section labels.
- Event cards containing anything beyond the event photograph and main event name.
- Em dashes or en dashes in visible copy. Use normal punctuation or a regular hyphen.

Before finalizing, audit the screens as one system. Confirm that the landing page feels curated rather than crowded, each event remains discoverable through its SBC, old events are clearly separated into the archive, the exact uploaded logo is used consistently, the light theme never changes, the two brand colors retain consistent roles, and all five routes work coherently on desktop and mobile.
