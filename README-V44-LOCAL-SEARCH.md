# MediaTok v44 — offline-first search reliability

## What changed

The site retains its existing third-party catalog search and image fallbacks, but now has an **independent local title index**. The Worker searches existing community `media_logs` records and 165 curated starter titles before relying on external catalogs. This means known titles return even if AniList, Jikan, Steam, or a browser-side catalog is unavailable. Results sourced only from MediaTok do not invent covers or years. Outside catalog enrichment runs in the background and may add genuine covers to subsequent searches.

The browser now provides an **Add manually** action for searches with no verified results, allowing users to log an otherwise missing title under the correct media category. Saved member covers can also appear with locally indexed results. Game search prioritizes the image URL returned by Steam, rather than assuming a generated library-cover URL exists. No database tables are created, dropped, or altered.

## Important limits

- This is an **offline-first starter index**, not a downloadable copy of AniList, Steam, or every medium database. Unseen titles still need live catalogs or manual entry.
- Genuine third-party cover artwork cannot be guaranteed when an image host is down, blocked, or has no matching cover. Missing images are not replaced with fabricated cover art.
- Local/simulated tests do **not** prove that Cloudflare or third-party API access works on mediatok.org. Production deployment has not been performed here.

## Deployment

1. Back up your current Worker project and D1 data. Deploy to the **existing** `mediatok` project in the same Cloudflare account. Do not create a second Worker or D1 database.
2. Extract this complete ZIP. From the project root, run `npm install` and `npx wrangler deploy` (or `npm run deploy`). Do not upload only the `public/` directory.
3. Hard refresh (Ctrl+Shift+R). Check `/api/health` reports `v44`.
4. Search Naruto, One Piece, Reverend Insanity, Elden Ring, and a custom title that is not in any provider. Confirm local matches, a manual-add action, and that any covers are actual loaded images.

No D1 migration is required. Existing accounts, chat, profile pictures, follower badge, and notifications are unchanged.

## Tests performed

- `node tests/v44-offline-search.mjs` — local index, D1-logged media, all-media matches, and provider-offline operation.
- JavaScript syntax checks for both Worker modules and frontend inline scripts.
- SQLite syntax validation for the bounded, read-only local-search query.
- Existing release notification test.

A full browser/live endpoint test could not be completed in this environment due to navigation restrictions; it is not claimed as passing.
