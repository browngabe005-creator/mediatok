# MediaTok v42 — bounded search and production diagnostics

This is a repair of v41, not a new website. The existing Worker, D1 binding,
accounts, profiles, followers, notifications, and live forum chat are retained.

## Changes

- All Media now starts **at most five catalog sources**. Only if those
  categories fail to produce any results does it search the remaining types.
  No longer launches all category fallbacks on every keystroke.
- Category-specific search still has independent primary/backup sources.
- Browser catalog requests have a seven-second deadline, to avoid falsely
  canceling valid Worker responses just before they finish. Most responses
  should arrive earlier; no guarantee is possible during provider outages.
- Media posters try their publisher's HTTPS image URL first, then MediaTok's
  same-origin proxy, then their remaining supplied alternatives.
- D1 result cache from v41 is REUSED, not reset. No new database migration
  is required beyond `0013_catalog_cache.sql` from v41.
- Diagnostic endpoint on the live Worker:
  `/api/search/v42/diagnostics?type=anime` (or manga, game, novel, webnovel, etc.)
  It returns JSON with the Worker version, catalog-cache availability,
  provider status, and actual timing. It does not expose login data or secrets.

## Deploy

1. Extract this ZIP; do not upload only `public/` or `index.html`.
2. Back up the existing project and existing database first, and verify
   `wrangler.jsonc` uses your original Worker `mediatok` and D1 binding.
3. Run `npm install` and then `npx wrangler deploy` from the extracted folder.
4. Confirm `https://mediatok.org/api/health` says `version: v42`.
   If it says an older version or returns HTML, the new Worker did **not**
   reach your production domain. Stop editing catalog providers and fix the
   deployment route/configuration first.
5. Test `https://mediatok.org/api/search/v42?type=anime&q=naruto`,
   `https://mediatok.org/api/search/v42?type=game&q=elden%20ring` and
   `https://mediatok.org/api/search/v42?type=webnovel&q=reverend%20insanity`.
   These must return JSON. Some unusual titles may be missing from sources.
6. Hard refresh with Ctrl+Shift+R to load the newest frontend/service worker.

If search still fails **after** health reports v42, open:

`https://mediatok.org/api/search/v42/diagnostics?type=anime`

The response tells whether the catalog cache exists and whether the primary
and backup APIs are responding, rate-limiting, or timing out. Re-run with
`?type=manga` or `?type=game` to isolate the broken category. In the browser
Network tab, note the failed URL, HTTP status, and response type (JSON/HTML).
You can share that diagnostic JSON; do NOT share cookies, authentication
headers, API secrets, or account tokens.

If the endpoint returns 500, inspect Worker runtime logs via
`npx wrangler tail mediatok` from a terminal with the correct Cloudflare login.
A failure that is ONLY on the live Cloudflare environment cannot be fully
reproduced or ruled out by the bundled offline tests.

## Validation performed locally

- `node --check src/catalog-v41.js`
- `node --check src/worker.js`
- `node tests/catalog-v41.mjs`
- `node tests/v42-diagnostics.mjs`
- `python tests/browser-catalog-v41.py` (Chromium/Playwright)

These run with simulated external APIs. They do not prove that mediatok.org,
Cloudflare D1, or live upstream catalogs are currently reachable.
