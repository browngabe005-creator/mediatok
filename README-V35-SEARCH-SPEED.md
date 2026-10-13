# MediaTok v35 — fast, progressive search

This is a targeted speed update built on the complete MediaTok v34 Worker and UI. It does not create a new Cloudflare project, alter account data, change D1 bindings, apply migrations, or remove prior cover fallbacks.

## Why search was slow

The previous anime, manga, novels, games, and related catalog searches waited for all external catalog requests to finish before showing any result. A stalled AniList/Jikan/Kitsu or book catalog could therefore hold up healthy results. The All Media search made eleven outbound requests and waited for all of them, sometimes followed by another lengthy client-side fallback. On the homepage, multiple recommendation-cover fetches also competed for external API capacity.

## Changes in v35

- **All Media:** `/api/search/all?q=naruto&stream=1` sends newline-delimited JSON result batches as individual providers finish; the browser displays each batch immediately and appends later results without rebuilding already-loaded cover images. A fixed ~3.2-second server deadline caps the aggregation even if a network intermediary buffers streaming. The original `/api/search/all?q=naruto` JSON endpoint remains supported.
- **Specific media tabs:** `/api/search/catalog?type=anime&q=naruto` and the other media types return the first usable catalog response (plus a 120 ms grace period for other successes), rather than waiting for all sources to time out. A 2.55-second maximum handles slow/no-result searches. Film/TV providers retain their existing flow.
- **Load control:** All Media search limits concurrent outgoing catalog requests to six; scoped searches cancel outstanding loser requests when a usable result is selected. Old searches can be aborted when the user types again. Recommendation cover lookup concurrency is reduced from 10 to 3 and stops starting new lookups while the user searches.
- **Fallback:** Browser-side catalog fallback now runs only when the Worker fails or the providers are offline, not on every ordinary zero-result search; it has a shorter maximum wait.
- **Compatibility:** Member search and cover/image retry behavior are retained. Existing cached results are versioned separately from v34. No new database migrations or secrets are required.

## Deploy the complete Worker + frontend

1. Back up the currently deployed v34 project and make sure you are authenticated to the Cloudflare account that already hosts `mediatok.org` and the existing D1 database.
2. Extract this ZIP to a new folder. Open a terminal **inside that folder** and run:

   ```powershell
   npm install
   npx wrangler deploy
   ```

3. Do **not** upload only `public/`, create another Worker, replace database IDs, or run database migrations for v35.
4. Confirm `https://mediatok.org/api/health` returns JSON including `"version":"v35"` (not HTML). This is important: if health still shows v34, the actual Worker did not get deployed.
5. On your site search for Naruto in **All Media**, then choose **Anime** and **Manga**. Also test `Reverend Insanity` under Webnovel, `Dune` under Novel, `Elden Ring` under Game, and `The Mentalist` under TV. Compare how quickly the first result appears. Use Ctrl+Shift+R to reload assets if your browser retained an older page.
6. In the browser Network panel, the request `/api/search/all?q=...&stream=1` should return `application/x-ndjson`; scoped searches should return JSON. Check Cloudflare Worker logs for persistent 429/503 upstream statuses.

## Local tests performed

`node --check src/worker.js` and browser script syntax parsing succeeded. Existing search route, provider outage, member lookup, and artwork-proxy tests pass. The new `tests/search-latency-v35.mjs` deliberately delays AniList 1.7 seconds while Jikan replies sooner: the test observed first streamed All Media results in roughly 145 ms and scoped Anime results in roughly 240 ms. The isolated DOM test `tests/browser-search-v35.py` verifies search result rendering for All Media and Anime with mocked data.

**These are simulated-network and isolated-browser tests, not measurements of live mediatok.org.** No Cloudflare deploy or production API test was possible from this environment. External API throttling, browser intermediaries, and titles absent from available indexes can still affect searches. Since this is a fast-first design, results from a later provider may not make the initial scoped-result response; select another catalog category or retry if a particular title is missing. The site does not promise an exhaustive list of every webnovel.

## Rollback

If production behavior regresses, deploy the prior v34 full project ZIP to the **same** existing Worker without changing D1 bindings. No v35 database rollback is necessary.
