# MediaTok v45 — artwork restoration (built on v44)

**Search remains v44 offline-first.** This is a focused cover-art repair, not a catalog/search rewrite. It does not touch user profiles, messages, follows, release notifications, account data, or migrations.

## Why v44 searches worked but posters were missing

MediaTok's 165-title offline starter index deliberately contains media titles but no verified cover URLs. The search-result renderer skipped drawing an image whenever `cover` was empty. Therefore Naruto, One Piece, Elden Ring, and other successful local results could appear with no artwork. The same gap affected some profile entries and detail views. Separately, some Open Library image URLs redirect to Internet Archive; the Worker image proxy formerly rejected those redirects.

## Changes

- Search result cards with missing covers now request artwork *after* displaying the title. Cover loading never holds up search results. Changes apply to anime, manga, films, TV, webnovels, light novels, books, comics, games, and visual novels.
- Provider choice depends on media type: Jikan (MyAnimeList), AniList, Kitsu, Steam, Open Library, Google Books, VNDB, iTunes, TVmaze (and previously configured sources). Lookup checks title equivalence to avoid assigning a cover for an unrelated item. Steam game matches prefer portrait artwork where available, with header and supplied thumbnail fallbacks.
- **Rate-limit protection:** missing-cover lookups are limited to three simultaneous browser jobs, two shared frontend lookups in the cover helper, and providers are tried in sequence until a matching cover is found. Failed providers do not block search.
- Correct artwork is reused through the browser, Cloudflare edge cache, and optional existing D1 `media_catalog_cache` table (if migration 0013 already exists). Successful covers are cached; unsuccessful lookups are not permanently stored.
- Broken cover URLs retry available alternatives. Open Library `?default=false` prevents treating its blank placeholder as valid artwork; the Worker image proxy securely follows verified Open Library redirects to Internet Archive cover shards. Untrusted redirect hosts remain blocked.
- Profile entries without cover URLs now try all supported media categories, not only animanga; media detail modals can also fetch missing covers. The service-worker cache key was bumped to prevent stale HTML from remaining in the previous offline shell.

## Installation

1. Keep the existing Cloudflare `mediatok` Worker, D1 database binding, secrets, and Durable Object configuration. Back up the current project first.
2. Extract the ZIP into a new folder and run `npm install` followed by `npx wrangler deploy` in that directory. Deploy the **entire** Worker and `public` assets together.
3. Visit `https://mediatok.org/api/health`: the returned JSON should say `"version":"v45"`.
4. Hard-refresh the site (Ctrl+Shift+R). Search Naruto (anime), One Piece (manga), Elden Ring (games), Dune (books), and Reverend Insanity (webnovels). The title should show immediately; if an artwork provider has a genuine cover and responds successfully, the corresponding image should load after the title.

**No new database migrations.** Optional persistent artwork caching reuses the v41 table; the site remains functional if that table is absent. Do not recreate or reset the database.

## Validation performed

- `node tests/v45-artwork.mjs`: mock-provider success across eight media types; missing provider + rate-limit fallback; positive cover caching; original offline results unchanged; safe redirected Open Library cover proxy.
- `python tests/browser-artwork-v45.py`: Chromium renders a previously blank local result with a retrieved cover without replacing the title/actions; games without saved covers can resolve in profiles.
- `node tests/v44-offline-search.mjs`: unchanged v44 offline search cases.
- `node tests/release-alerts-v38.mjs` and `node tests/live-room-v37.cjs`: notification and live-chat regression cases.
- JavaScript syntax validation of Worker modules and inline frontend scripts; ZIP integrity.

The tests above simulate external providers. **This project has not been deployed to mediatok.org and its live artwork hosts have not been verified here.** A missing real cover or upstream outage can still prevent an individual image from loading; no fake cover is substituted.
