# RAS Connect Showcase

A UI-only Next.js implementation of the IEEE RAS Kerala Chapter RAS Connect event showcase.

## Development

```bash
npm install
npm run dev
```

Run `npm run check` for lint, mock-content integrity, and a production build. With a local server running, `npm run check:routes` exercises the primary routes and branded 404 responses.

The public content is mock data in `src/data/mock-data.ts`. Replace those records and the files in `public/images/` when production content becomes available. Chapter search uses `q`; archive views use `q`, `year`, `chapter`, and `page` URL parameters.
