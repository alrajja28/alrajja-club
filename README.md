# تطبيق نادي الرجاء العراقي

Customer-owned project: alrajja28.

## Development

Use Node.js 22.12+ or 24. Install with npm ci --legacy-peer-deps. Copy .env.example to .env.local and set VITE_CONVEX_URL. Run npm run dev, npm run lint, and npm run build.

The Convex backend lives in convex/. Run npm test to check permissions, publication, request privacy, idempotency, and server-calculated ticket totals.

Production deployment: watchful-nightingale-349. Development deployment: benevolent-goldfish-662. Use separate customer credentials when running Convex CLI.

Configure backend variables JWT_PRIVATE_KEY, JWKS, SITE_URL, APP_ORIGINS, ADMIN_EMAILS, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET. Never commit credentials or environment files. Google OAuth callbacks: https://watchful-nightingale-349.convex.site/api/auth/callback/google (production), https://benevolent-goldfish-662.eu-west-1.convex.site/api/auth/callback/google (development).

Deployment-only bootstrap:initialize imports original content once; it never overwrites an existing database.


## Release

Build with the production VITE_CONVEX_URL. Publish dist/ to the gh-pages branch. GitHub Pages serves this branch.

## Current boundaries

Google login remains unavailable until the customer completes the Google Cloud country and OAuth client setup. No paid trial or billing account was enabled.

Ticket submissions are review requests, not paid tickets. This release does not issue admission QR codes or process payments. Live video uses a provided HTTPS/YouTube source or uploaded MP4/WebM; it does not provision a broadcasting service.
