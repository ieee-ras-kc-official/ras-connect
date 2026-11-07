# Frontend

Next.js App Router, React and Tailwind, deployed with the native Next.js framework on Vercel. Pages are server-rendered on request so new events/chapters and sitemap entries work without rebuilding. Unknown records return HTTP 404. No Apache configuration or static fallback pages are used.

Use Node 22+, copy `.env.example` to `.env`, then `npm ci` and `npm run dev`. Production requires `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`. See the [root README](../README.md) and [Vercel deployment guide](../DEPLOYMENT.md).

`npm run check` runs lint, type generation, TypeScript, content validation, native build and HTTP route/security checks. `npm start` starts the production Next.js server. Builds fail on unavailable or invalid source content. The proxy applies a fresh script nonce per request; static resources remain cacheable and pages are never cached with a reused nonce.
