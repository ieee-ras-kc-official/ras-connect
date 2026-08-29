# RAS Day Implementation Specification

## Source of Truth

- `PROMPT.md` defines the approved product scope, content rules, accessibility requirements, and interaction constraints.
- `stitch_ras_day_showcase/` is the visual reference for layout, composition, spacing, imagery, and overall art direction.
- When the Stitch export conflicts with `PROMPT.md`, follow `PROMPT.md` while preserving the closest compatible visual treatment from Stitch.
- Known Stitch conflicts to correct include the registration CTA, event metadata on gallery cards, serif typography, extra footer links, and missing home-page sections.

## Repository and Stack

- Initialize a local Git repository before implementation with `git init`.
- Do not create or push a remote GitHub repository during this phase.
- Use Next.js with the App Router and TypeScript.
- Use npm as the package manager.
- Use Tailwind CSS v4, translating and consolidating the Stitch utility styles into a maintainable design system.
- Use Motion for purposeful UI animation and route/component-level orchestration.
- Keep this phase UI-only. Do not add a backend, CMS, authentication, registration workflow, or external database.

## Application Architecture

- Implement reusable, data-driven routes backed by local typed TypeScript mock data.
- Use dynamic chapter routes and dynamic event routes rather than duplicating static page files.
- Keep chapter, event, archive, and relationship data in a centralized mock-data module so it can be replaced with real content later.
- Use explicit event archive status from the data record. Do not infer archive state from the event date.
- Generate valid known dynamic routes from the mock dataset where appropriate.

## Mock Content

- Use the Stitch content as the starting point.
- Expand the mock dataset across several chapters, events, and years so all search, filtering, archive grouping, related-event, and empty-state behavior can be exercised.
- Keep invented data clearly identified as mock in the source code. Do not add visible `Mock` badges to the public UI.
- Include data cases for an event without a date, an event without an extra gallery, a chapter with no published events, and archived events across multiple years.
- Do not present invented attendance counts, awards, sponsors, testimonials, or factual claims.

## Images and Assets

- Download the imagery referenced by the Stitch HTML into the Next.js `public/` directory and commit it locally.
- Use local assets in the implementation so the UI does not depend on expiring Google-hosted URLs.
- Preserve replaceable, descriptive filenames and centralized image references so the user can swap in real photography later.
- Use the supplied IEEE RAS logo as the exact brand asset.
- When an image is absent or fails to load, show a branded neutral placeholder containing `Photo unavailable` while preserving the card or page content and navigation.

## UI and UX Fidelity

- Treat the Stitch screenshots as visual references, not literal implementation requirements.
- Preserve their light editorial feel, generous spacing, brand palette, image-led compositions, and responsive hierarchy.
- Correct all conflicts against `PROMPT.md`:
  - Use Manrope for display and body copy and IBM Plex Mono only for metadata.
  - Remove registration actions and upcoming-status marketing.
  - Event cards contain only the event photograph and event name.
  - Remove dates and descriptions from related-event cards.
  - Remove unprovided Privacy Policy and Contact links.
  - Add the planned Recent Moments, About RAS Day, and Archive callout sections to Home.
  - Keep the About navigation item linked to the Home about section.
- Implement the five route families from the prompt: Home, Chapters, Chapter Detail, Event Detail, and Archive.
- Build explicit desktop and mobile layouts, including the mobile navigation sheet and responsive archive filters.

## Client-Side Behavior

- Make chapter search, archive search, archive year filtering, archive chapter filtering, mobile navigation, home chapter-preview switching, and archive Load More behavior functional.
- Synchronize chapter search and archive filter state to URL query parameters.
- Filtered URLs must survive refresh, work with browser forward/back navigation, and be shareable.
- Show clear empty states for no chapter matches, no archive matches, and chapters without published events.
- Clear-filter controls update both the interface and the URL.

## Motion

- Use Motion for the restrained animation language described in `PROMPT.md`.
- Include hero content reveal, hero-image stagger, event-card hover feedback, chapter-preview crossfade, menu transitions, and filtered-result transitions where they improve clarity.
- Animate transform and opacity only where practical.
- Respect `prefers-reduced-motion` and provide stable static equivalents.
- Do not add parallax, scroll hijacking, marquees, perpetual animation, magnetic cursors, or dramatic route transitions.

## Edge Cases and Failure Modes

- Missing or failed images render the branded `Photo unavailable` placeholder.
- Missing optional event dates omit the date row rather than showing fabricated content or `TBA`.
- Events without additional gallery images omit the gallery section.
- Chapters with no current events render the approved chapter empty state.
- Search and filter combinations with no results render the approved zero-results states and reset actions.
- Unknown chapter and event slugs render a branded 404 page with links to Home and Chapters. Do not silently redirect.
- Archived events remain accessible through the global archive and their direct event URLs.
- Only events explicitly marked archived appear in archive results.

## Accessibility and Quality

- Meet the accessibility, responsive, semantic, focus, contrast, tap-target, and reduced-motion requirements in `PROMPT.md`.
- Preserve usable navigation and chapter discovery without relying on hover.
- Use loading UI shaped like the final content rather than generic spinners.
- Validate the production build and exercise the primary linked flows before completion.

## Out of Scope

- Remote GitHub repository creation or pushing.
- Real production SBC or event data.
- CMS or backend integration.
- User accounts, registration, payments, or admin tools.
- Deployment configuration beyond a normal production-ready Next.js build.
