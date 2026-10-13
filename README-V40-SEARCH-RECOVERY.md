# MediaTok v40 — intermittent search and cover-image recovery

This package builds directly on **v39**. It keeps v39 profiles and followers, the v38 notification enhancements, and the forum live chat. No database migrations or resets are needed.

## Why some searches and icons would work, then stop

- Anime, manga, games, and other media depend on external catalog APIs and artwork hosts that can throttle, return 429/503, or temporarily fail.
- Prior image lookups cached an empty result for **30 minutes in the Cloudflare edge** and for **the entire browser tab session**. Temporary provider failures could therefore appear permanent.
- The scoped search stream reported an unsuccessful provider request as a `done` message without clearly propagating its failure to the browser, sometimes presenting an outage as “no matching media.”
- Rapid typing and decorative homepage-cover requests could produce many simultaneous upstream requests per visitor.

## v40 changes

1. `src/worker.js`: errors now propagate from scoped NDJSON search to the browser, triggering its fallback path. Successful catalog searches are still held for the stale-result safety net.
2. `src/worker.js`: shared rate-limit cooldown, best-effort via Cloudflare's edge Cache API, when a provider returns 429/503. If AniList throttles, alternatives such as Jikan/Kitsu can still answer; no single provider is required to be online.
3. `src/worker.js`: All Media results retain successful edge responses for 24 hours, but refresh after 10 minutes. During outages, cached results remain available as a fallback.
4. `src/worker.js`: empty cover lookup responses expire in 10 seconds, instead of 30 minutes. Successful covers remain cached for 24 hours. Cache key is updated to v40 to bypass old negative entries.
5. `public/index.html`: successful poster URLs cache for a day, but empty poster lookups retry after a short cooldown rather than staying empty indefinitely; recommendation cards make one controlled retry if the first cover lookup was empty. Broken images try direct, alternate, and the existing allowlisted image proxy, followed by one delayed retry rather than endlessly hammering APIs.
6. `public/index.html`: header search debounce increased to 360ms to reduce provider bursts without delaying an explicitly submitted search. Decorative cover lookups are staggered when the user isn't searching.
7. `public/service-worker.js`: cache version updated so existing visitors receive the new frontend after the service worker updates.
8. `/api/health`: now returns `"version":"v40"` to distinguish the backend from a frontend-only deployment.

## Deploy safely

From the extracted folder, sign into the Cloudflare account that currently owns MediaTok, then run:

```powershell
npm install
npx wrangler deploy
```

**Do not** create a new Worker, delete D1, modify the existing DB binding, or blindly reapply migrations. Dashboard-only deployment of static files is **not** enough; this fix includes Worker backend code. Confirm the target Worker is the existing `mediatok` project before deploying. Preserve Worker secrets and variables.

## Verify on the live site

1. Open `https://mediatok.org/api/health`. Confirm JSON containing `"ok":true` and `"version":"v40"`.
2. Open `https://mediatok.org/api/search/catalog?type=anime&q=naruto` and confirm JSON with a `results` array and titles, **not HTML or a Cloudflare challenge**.
3. Open `https://mediatok.org/api/search/catalog?type=manga&q=one%20piece&stream=1`. Confirm newline-separated JSON packets including `event:"results"` and `event:"done"`.
4. Test All Media for `Naruto`, Manga for `One Piece`, Game for `Elden Ring`, Webnovel for `Reverend Insanity`, TV for `The Mentalist` and Film for `Spirited Away`.
5. Navigate away and back; leave the page open for several minutes and try again. Confirm images load or recover rather than permanently disappearing after one failure.
6. If an endpoint returns **403/429/5xx** or **HTML**, check Cloudflare Worker logs, rules, routes, and the matching catalog provider status. Production network/provider access was not available in the development environment, so live performance is not claimed.

### Local verification

```bash
node --check src/worker.js
node tests/search-smoke.mjs
node tests/search-all-smoke.mjs
node tests/search-resilience-v34.mjs
node tests/search-latency-v35.mjs
node tests/stream-cover-v36.mjs
node tests/intermittent-recovery-v40.mjs
```

These use simulated network responses for predictable regression tests; they do not guarantee third-party API uptime.

## If search fails again after deploying v40

While reproducing the failure, press F12 → Network. Click the failing `/api/search/...` or `/api/search/cover?...` request and record its status code and whether the response is JSON, NDJSON, or HTML. Those two details distinguish provider throttling from a misrouted Worker/WAF/caching problem. If API responses contain working cover URLs but images remain blank, inspect the **image request** status separately; the source/CDN may be blocking requests.
