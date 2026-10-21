# تطبيق نادي الرجاء العراقي

Customer-owned project: alrajja28.

## Development

Use Node.js 22.12+ or 24. Install with npm ci --legacy-peer-deps. Copy .env.example to .env.local and set VITE_CONVEX_URL. Run npm run dev, npm run lint, and npm run build.

The Convex backend lives in convex/. Run npm test to check permissions, publication, request privacy, idempotency, and server-calculated ticket totals.

Production deployment: watchful-nightingale-349. Development deployment: benevolent-goldfish-662. Use separate customer credentials when running Convex CLI.

Configure backend variables FIREBASE_PROJECT_ID=alrajja-club-auth and ADMIN_EMAILS=alrajja28@gmail.com. Never commit secrets or credential files. Convex JWT configuration uses the Google public JWKS; it does not require a Google OAuth client secret. The old Convex Auth tables remain intact for data compatibility; only the Firebase issuer is accepted by the current auth configuration.

Deployment-only bootstrap:initialize imports original content once; it never overwrites an existing database.


## Release

Build with the production VITE_CONVEX_URL. Publish dist/ to the gh-pages branch. GitHub Pages serves this branch.

## Current boundaries

Google login uses the customer-owned Firebase project alrajja-club-auth (Spark, no billing). Only Google is enabled. Application data and uploads stay in Convex. src/backend/firebase-config.json contains public web SDK identifiers, not server credentials. Convex verifies the Firebase issuer, project audience, signature, verified email, and Google provider before linking a user.

Ticket submissions are review requests, not paid tickets. This release does not issue admission QR codes or process payments. Live video uses a provided HTTPS/YouTube source or uploaded MP4/WebM; it does not provision a broadcasting service.
