# MediaTok v50 — Anime artwork, leaderboard avatars and Global Search

Built on v49. This update does not change the offline-first search index, webnovel import and browsing code, leaderboard entry eligibility, accounts or database schema.

## Repairs

1. **Global Search navigation:** The header search now awaits the Discover page's rendering before beginning the request. Previously, submitting from Home could call `searchMedia()` before `#searchResults` existed, causing the request to exit without results.
2. **Missing anime artwork:** For anime without covers from the regular Worker artwork API, the browser now queries publicly available Jikan (MyAnimeList), Kitsu, and AniList artwork APIs in order, requires a matching title, and caches positive results. The same artwork lookup is used in global-search results, profile cards, homepage features and missing Global Recents posters. Artwork is loaded independently of text search; third-party availability is still not guaranteed. Existing Worker image-proxy retries remain available when direct images fail.
3. **Leaderboard avatars:** The server returns the custom `users.avatar_url` first and the legacy Discord `users.avc` as fallback. The leaderboard sidebar and full page automatically retry the fallback image, then show the member's initial if both fail. Older D1 schemas without `avatar_url` remain supported.
4. **Fresh client assets:** The service worker cache revision is `mediatok-v50-artwork-avatars`, and the health endpoint reports `v50`.

## Deployment

Extract this ZIP into your existing MediaTok project directory, preserving its connected Wrangler project, D1 binding, secrets and Durable Object. Deploy with `npm install` and `npx wrangler deploy` (or `npm run deploy`); do not create a replacement Worker or database. Existing v49 webnovel sync setup stays unchanged. There are **no new database migrations** for v50. Refresh the page once after deployment.

## Local verification

- `node tests/v50-leaderboard-avatars.mjs`
- `python tests/browser-v50.py`
- `node tests/leaderboard-story-games-v47.mjs`
- `node tests/v44-offline-search.mjs`
- `node tests/v49-webnovels.mjs`
- `python tests/browser-v49.py`
- `python tests/browser-home-cover-v47.py`
- `python tests/browser-shared-artwork-v46.py`

All browser/provider tests use deterministic mocked network responses; they **cannot establish** that the live APIs and deployment work from the tester's network. Test after deployment: search Naruto from Home via the header, check its image, then visit Leaderboard and inspect user avatars. If artwork is genuinely missing from providers, no substitute cover is fabricated.
