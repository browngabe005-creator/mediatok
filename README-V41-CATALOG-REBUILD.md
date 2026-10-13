# MediaTok v41 — Search and artwork rebuild

## What changed

The main catalog UI no longer uses the v34–v40 streaming pipeline, parallel direct-browser catalog searches, or their retry chains. All main searches use a single endpoint:

`GET /api/search/v41?type=anime&q=naruto`

Supported types: `all`, `anime`, `manga`, `light-novel`, `webnovel`, `visual-novel`, `film`, `tv`, `novel`, `comic`, `game`.

- New independent `src/catalog-v41.js` catalog service, isolated from the rest of the Worker.
- Provider requests are staggered: backups are attempted only if the first provider has not found usable results. Timeouts and per-provider cooldowns prevent long waits and hammering rate-limited services.
- Matching results are cached persistently in a new **additive** D1 table. Search still works without that table, but persistent recovery is then unavailable. Cached titles remain usable during upstream outages (up to 30 days; marked stale after six hours).
- New cover image route `/api/search/v41/image?url=<encoded HTTPS image URL>` with an explicit host allowlist. The browser first uses MediaTok's image proxy, then its direct source and alternate sources on failure. Image errors are not cached by the new image route.
- New cached poster lookup `/api/search/v41/cover?type=manga&q=one%20piece`; `alternate=1` asks other providers for covers after the supplied image fails.
- Images in main media search, homepage discovery covers, activity and profile poster grids now use the new loading logic. The header's member lookup still uses the existing first-party `/api/search/users` endpoint.
- Profile avatars, follower badge, notification bell, forum chat, and previous logged media records are untouched.

**Limits:** Live performance depends on external catalog reachability, Cloudflare edge location, and the state of existing records. Some titles, especially webnovels, are absent from available indexes; no API can guarantee every title or a cover. The rebuild cannot repair an incorrect Cloudflare domain route or broken D1 binding automatically. Live mediatok.org was not accessible for verification here.

## Deploy safely to the existing Worker

From the *extracted* v41 project folder, signed in to the **same** Cloudflare account as your current site:

1. Back up your existing D1 database. Recommended:

   `npx wrangler d1 export mediatok --remote --output mediatok-d1-backup.sql`

2. Apply the **new cache table only** (safe to re-run; no rows in existing tables are deleted):

   `npx wrangler d1 execute mediatok --remote --file migrations/0013_catalog_cache.sql`

3. Deploy Worker and public assets **together**:

   `npm install`

   `npx wrangler deploy`

4. Verify routes on your live domain in a private browser window:

   - `https://mediatok.org/api/health` must say `"version":"v41"`.
   - `https://mediatok.org/api/search/v41?type=anime&q=naruto` must return JSON with a `results` array and `version:"v41"`.
   - `https://mediatok.org/api/search/v41?type=manga&q=one%20piece` must return JSON, not the HTML homepage.
   - `https://mediatok.org/api/search/v41?type=game&q=elden%20ring` checks game coverage.
   - `https://mediatok.org/api/search/v41?type=webnovel&q=reverend%20insanity` checks web-fiction coverage.
   - Open the site and press Ctrl+Shift+R. Search and open a cover in both light and dark themes.

Do not create a second Worker, clear/reset D1, or run unrelated migrations. Keep existing DB bindings, Worker secrets, and Durable Object configuration. **Deploying only public/index.html does not deploy the new search service.**

## Troubleshooting intermittent failures

Inspect DevTools → Network with the failed request selected. Confirm that the request uses `/api/search/v41`, is JSON, and record the HTTP status plus any Cloudflare error response. If `/api/health` says v40 (or older), the new Worker did not deploy to the live domain. If the new endpoint returns `providerStatus:"offline"`, providers returned no results within the short timeout; repeat a popular query to check cached hits. Check Worker logs for provider 429/403/5xx warnings. If the endpoint says v41 but image requests fail, check `/api/search/v41/image?url=...` and inspect its status: 400 indicates an unsupported/invalid image domain, while 502/503 indicates unavailable upstream artwork.

## Local tests (simulated network, not proof of live provider uptime)

- `node tests/catalog-v41.mjs`
- `python tests/browser-catalog-v41.py` (requires Playwright and Chromium)

The tests cover search across all major media types, fallback under simulated upstream failures, D1 cache reuse, secure image proxying, and the browser's no-results/offline behavior.
