# MediaTok v33 — search reliability and design consistency

This is a complete update of the existing MediaTok Cloudflare Worker and static frontend based on the v32 multi-provider search project. **It is not a new Cloudflare project.** Keep your existing Worker, domain, D1 database, and Cloudflare secrets.

## Search changes

- A functional global search input appears in the header. Press Search/Enter from anywhere to open the Discover results page. On media pages it also searches as you type (350 ms debounce).
- The existing catalog picker tabs still select which medium is being searched: anime, manga, films, TV, novels, light novels, webnovels, comics, games and visual novels. The same search input also looks up members in parallel.
- New `/api/search/users?q=...` public member endpoint searches account names/display names with bound SQL parameters, hides banned members, returns limited public fields, and has no dependency on media services. Requires the existing users table and profile-image column from the project's previously released migrations; no new migration is added here.
- Catalog search keeps the multi-provider setup and isolates individual failures. Provider requests have bounded timeouts, reducing hung requests. Search hits are ranked by title relevance; temporary upstream outages can still use edge-cached results from successful earlier searches.
- A separate browser-provider fallback is retained for media if the Worker route fails or yields no results. Catalogs are third-party services, so availability and completeness cannot be guaranteed.
- More useful loading/error messages and a simple retry path. The site service-worker cache version is increased so returning visitors receive new assets.

## Design changes

- Site-wide IBM Plex Sans typography with neutral system fallback, restrained heading weights, and less aggressive letter spacing.
- Consolidated sizes for cards, controls, input fields, rounded corners and shared spacing tokens.
- More consistent three-column layouts on large screens, compact responsive layouts on phones/tablets, aligned profile sections, grid poster ratios and readable media results.
- Simplified search UI: one header search bar rather than duplicate fields. Media tabs remain available to switch the catalog.
- Additional dark/blue-black theme contrast, focus visibility and reduced-motion styling. Phone header and horizontal tab navigation checked for viewport fit.

## Local validation performed

- `node --check src/worker.js`: PASS.
- All inline frontend JavaScript blocks: `node --check`: PASS.
- D1-compatible member lookup syntax tested against an in-memory SQLite users table: PASS.
- `node tests/search-smoke.mjs`: PASS for simulated Naruto anime; Reverend Insanity webnovel; Dune novel; Spirited Away film; The Mentalist TV; Elden Ring game; Steins;Gate visual novel; public member search; Worker health.
- Automated headless Chromium client UI smoke run with simulated responses at 1440px and 390px widths: media/member result rendering PASS; no uncaught browser script errors and no page-wide horizontal overflow.
- **The tests above used mocked API responses. The Cloudflare production deployment and live third-party catalog availability were not verified**, and no claim is made that the live website was modified.

## Deploy to your existing Worker

1. Make a backup of this project and export/back up your existing Cloudflare D1 database before production deployment.
2. Check `wrangler.jsonc`. Confirm Worker name `mediatok`, custom domain `mediatok.org`, and D1 `DB` binding still match your existing Worker. This archive retains the original config.
3. In the project folder run:
   ```powershell
   npm install
   npx wrangler deploy
   ```
4. **Do not** create a new Worker or database. **Do not** run D1 resets or apply migrations solely for this update. It contains no new SQL migration.
5. In Cloudflare Worker settings make sure the existing required secrets remain configured; this release does not add a secret.

## After deployment: verify these URLs

- `https://mediatok.org/api/health` — must return JSON with `"ok": true`, not HTML.
- `https://mediatok.org/api/search/catalog?type=anime&q=naruto` — `results` JSON array.
- `https://mediatok.org/api/search/catalog?type=webnovel&q=Reverend%20Insanity` — `results` JSON array.
- `https://mediatok.org/api/search/catalog?type=novel&q=Dune` — `results` JSON array.
- `https://mediatok.org/api/search/users?q=gab` — `results` JSON array, may be empty if no matching users exist.

Also test manga One Piece, TV The Mentalist, film Spirited Away and game Elden Ring on Discover. Click a result's View details; if signed in, try adding a title to your collection. Confirm the profile, leaderboard, mobile menu, dark mode, Discord login and email login. On mobile, refresh once to activate the updated service worker. If any API route returns HTML, review `assets.run_worker_first` and the Worker routes in `wrangler.jsonc`.

If a live search still fails, check **Cloudflare Workers → mediatok → Observability/Logs**, then inspect the failing `/api/search/catalog?...` response in the browser's Network panel. Never disclose Worker secrets or database IDs in screenshots you share publicly.
