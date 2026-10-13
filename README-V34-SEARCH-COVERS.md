# MediaTok v34 — search reliability and artwork fallback

This is a **full Worker + frontend** update based on the v33 project. It preserves the existing Cloudflare Worker name, custom domain, database binding and migrations. It does not erase or recreate D1 data. **Nothing is deployed automatically by this ZIP.**

## Changes

- The header Search/Enter button searches **all media** through `GET /api/search/all?q=...`. Media-specific tabs continue to use `GET /api/search/catalog?type=...&q=...`.
- All-media discovery draws on AniList, Jikan (MyAnimeList), Kitsu, Steam, TVmaze, iTunes, Open Library, Google Books and VNDB. A failed provider is isolated from the others. A cached successful result can be used when available.
- If the all-media Worker API fails, the frontend can attempt independent browser-accessible providers for several media categories; these remain subject to browser CORS and upstream availability.
- Public member search (`/api/search/users`) stays separate from media search and now tolerates older D1 schemas lacking the `avatar_url` column.
- Search responses are sorted by title relevance. When a provider is unavailable, the UI shows an error/retry state rather than silently reporting zero results.
- **Discovery no longer starts 50 recommendation-cover requests while a user searches.** Initial recommendations are limited to six, with fewer background cover lookups to reduce provider rate limiting.
- Steam game searches prefer poster-sized artwork, falling back to thumbnails and headers when unavailable. The media results grid and media details modal retry alternate cover URLs.
- The `/api/catalog-image` endpoint permits a small set of known image hosts, with strict HTTPS and host validation. It is not an open proxy.
- The service-worker cache version is bumped to `mediatok-v34-search-covers` to avoid showing previous assets after an update.
- Health requests now report `"version":"v34"`, making incorrect or partial deployments easy to identify.

## Deploy **the whole Worker**, not only the website files

1. Back up your current site project and Cloudflare D1 data, and extract this ZIP.
2. Confirm the `wrangler.jsonc` Worker name (`mediatok`), existing `DB` binding, route, and Cloudflare account match the running production project.
3. Open a terminal **inside the extracted folder** and run:

   ```powershell
   npm install
   npx wrangler deploy
   ```

4. Do not create a new Worker or database, delete D1 data, or run migrations just for this release. Preserve existing secrets.
5. If you have been uploading **only** `public/` in the Cloudflare dashboard, that does **not** update `src/worker.js`. Search may remain broken even if the frontend appearance changes. Deploy this full project using Wrangler.
6. Hard-refresh the site (Ctrl+Shift+R on Windows). If an older installed PWA remains outdated, close the installed app and reload or unregister the old service worker via DevTools → Application → Service workers.

## Verify **after** deploying

- `https://mediatok.org/api/health` should return JSON containing `"ok":true` and `"version":"v34"`. If you see an HTML page, an older version, a 404, or a Cloudflare error, the Worker/route has not been deployed correctly.
- `https://mediatok.org/api/search/all?q=naruto` should return a JSON object with `results` and `providerStatus`. If the `results` array is empty, look at `providerStatus` and Worker logs to determine if all providers are unavailable.
- `https://mediatok.org/api/search/catalog?type=game&q=elden%20ring` should return game results.
- `https://mediatok.org/api/search/catalog?type=webnovel&q=Reverend%20Insanity` should return a results array (availability depends on third-party catalog coverage).
- On desktop and phone: search **Naruto**, **One Piece**, **Elden Ring**, **Dune** and **The Mentalist**. Switch media tabs, open a result's details, and check images. Search for an actual username to test member lookup.
- If a cover still shows an icon, inspect its failed original and `/api/catalog-image` requests in browser DevTools → Network. Some providers do not publish artwork for every title, and external sites can block image requests.

## What was and wasn't tested

**Passed locally**: `node --check src/worker.js`; inline JavaScript syntax checks; simulated Worker catalog searches for anime, manga, webnovels, games, movies, TV, books and visual novels; simulated `GET /api/search/all` mixed results; AniList outage with Jikan fallback; legacy member-search schema fallback; image-proxy host filtering.

**Not verified**: a production Cloudflare deployment, live third-party API requests, or live image CDN behavior. The testing environment blocks access to mediatok.org, and browser navigation to a local server is restricted. Please perform the deployment checks above on your own site.
