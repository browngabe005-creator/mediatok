# MediaTok v36 — faster progressive catalog search and cover recovery

This package replaces v35's search and image handling while retaining the **same** MediaTok Cloudflare Worker project, D1 database configuration, user accounts, authentication routes, existing media logging, and other features. There are **no database migrations** for this update.

## Changes

- `/api/search/catalog?type=anime&q=naruto&stream=1` now responds with newline-delimited JSON events. The browser adds each provider's usable matches immediately rather than waiting for slow providers to finish. The original `/api/search/catalog?type=anime&q=naruto` still returns JSON for older clients. All-Media streaming is preserved.
- Scoped search waits at most ~1.55 seconds server-side for uncached provider results and starts showing each batch as soon as it arrives. A short grace period lets subsequent providers contribute more cover choices. All-Media aggregation is capped at ~2.3 seconds. These are backend deadlines **not** guarantees of browser or network round-trip time.
- Browser input debounce is reduced from 350 ms to 190 ms for queries of at least two characters. Successful search results are stored for 30 minutes in the **current browser tab** (`sessionStorage`) for rapid repeat searches, as well as in an in-memory cache.
- A new cached `/api/search/cover?type=manga&q=One%20Piece` endpoint looks for exact-title image alternatives in Jikan, Kitsu, Open Library, VNDB, or Steam, as appropriate. Only broken/missing artwork triggers this background fallback; cover repairs do **not** block text search.
- Steam's supplied search thumbnail is used first because the guessed `library_600x900.jpg` poster is not available for every title. Higher-resolution poster and header paths remain fallbacks. AniList/Jikan/Kitsu mappings retain alternate image URLs.
- Direct image variants are tried before the existing allowlisted `/api/catalog-image` Worker proxy. If no real image works, the result stays clickable and displays its title **without a misleading replacement icon**.
- Redundant homepage cover searches are removed, concurrent decorative cover lookups are capped, and the PWA service-worker cache is versioned to v36.

## Deploy

1. Back up your currently working v35 full project, and make sure Wrangler is connected to the Cloudflare account owning the existing `mediatok` Worker and D1 database.
2. Unzip this full package and run inside the extracted project directory:

   ```powershell
   npm install
   npx wrangler deploy
   ```

3. Do **not** deploy just `public/`, create a new Worker, reset/change D1, or run migrations for this update. Keep existing dashboard secrets and variables. The project's existing `wrangler.jsonc` has the original D1 database ID and `keep_vars` setting.
4. Open `https://mediatok.org/api/health`: it must return JSON containing `"version":"v36"`. Reload the website with Ctrl+Shift+R, or close and reopen the installed app, to pick up the new service worker.
5. Search in Anime: `Naruto`; Manga: `One Piece`; Webnovels: `Reverend Insanity`; Novels: `Dune`; Games: `Elden Ring`; Films/TV: `The Mentalist`. Test All Media too. Search results should start appearing *before* slow providers finish.
6. If art is missing, open `https://mediatok.org/api/search/cover?type=manga&q=One%20Piece` and check its `cover` and `alternates` fields. For a slow search open DevTools → Network and inspect the `api/search/catalog?...&stream=1` request (should be `application/x-ndjson`) and whether artwork is failing with 403/404/429 or a blocked remote domain.

## Tests performed

- Node syntax checks for the Worker and the HTML's inline scripts.
- Local simulated API tests for anime, manga, game, TV, film, novel, webnovel, and visual novel routes, including AniList outage behavior, the scoped streaming response, exact-match cover alternatives, and a failed cover in the browser.
- Browser-DOM rendering tests in Chromium with stubbed API responses. These are not tests of deployed provider infrastructure.
- ZIP archive integrity validation.

**Not live-verified:** This environment could not resolve/access mediatok.org or the real provider URLs. Search response time and image availability on your actual Worker are dependent on third-party throttling, user connection, and Cloudflare edge behavior. No provider can guarantee an image exists for every record.

## Rollback

If the update causes a regression, redeploy the complete v35 ZIP to the **same** existing Worker. D1 does not need to be rolled back.
