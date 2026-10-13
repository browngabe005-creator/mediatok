# MediaTok v43 — search routing and cover reliability

This update keeps existing Cloudflare Worker name, D1 database, accounts, forum, live chat, and notifications. No migrations required beyond those already applied for previous versions.

## What changed

- A stable `/api/search/media` endpoint is now served alongside `/api/search/v42`, `/api/search/v41` and the old category route.
- Browser search automatically attempts an available Worker search route; the previous frontend only used `/api/search/v42`. It falls back to direct public catalog APIs when **all** Worker search routes fail.
- Search results persist locally for 7 days and remain usable during upstream outages.
- Theme storage is guarded against browser storage-permission errors so a blocked localStorage API does not crash the whole client script before search initializes.
- Cover images use original HTTPS artwork first; when a host prevents hotlinking, the existing `/api/catalog-image` proxy is attempted, then the newer proxy route.
- Cover lookups also try new and existing Worker routes.
- v43 health/version metadata and service worker revision.

## Deploy

Back up the existing project and verify the Worker `mediatok` and the original D1 database binding before deploying. Extract the ZIP and run `npm install` followed by `npx wrangler deploy` in the extracted directory. Do not upload only the `public/` folder: it would update the browser without deploying new Worker routes. No D1 migrations are necessary.

Visit `https://mediatok.org/api/health` to verify `version` is `v43`. Search for Naruto (anime), One Piece (manga), Elden Ring (game), Dune (novel), and The Mentalist (TV). Try a search again after refreshing.

**Limitation:** The live domain is not DNS-resolvable from the current execution environment, so production endpoints and external provider availability cannot be verified here. Passing simulated tests does not guarantee a production repair. If the Worker itself isn't deployed or the domain route is wrong, a full Worker deployment / Cloudflare routing correction is still required.

## Tests run locally

- `node --check src/worker.js` and `node --check src/catalog-v41.js` and syntax validation of the inline frontend JavaScript
- `node tests/catalog-v41.mjs`
- `node tests/v42-diagnostics.mjs`
- `node tests/v43-recovery.mjs`
- `python tests/browser-v43-recovery.py` (Chromium, mocked remote APIs)
- `node tests/live-room-v37.cjs`
- `node tests/release-alerts-v38.mjs`

These tests do not connect to production or verify live third-party response rates.
