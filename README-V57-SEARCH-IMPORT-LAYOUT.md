# MediaTok v57 — imports, broad books, and navigation polish

Based on v56, without replacing the working multi-provider media search, user accounts, profiles, D1 database, forum chat, or leaderboard rules.

## Import location
Goodreads (official Library Export CSV) and Passport Dex (compatible CSV or JSON export) have been moved from separate Settings panels to **Customize Profile → Accounts**, beside AniList, MAL, and Letterboxd. They use the same integration-card layout and reuse the v54 preview and duplicate-safe authenticated batch import. Neither requires OAuth or a direct provider connection. The Passport Dex native export format has not been independently verified, so only files with compatible fields are supported.

## Book search
The Books category now tries a paginated multi-source `/api/books/browse?q=...&offset=...` route ahead of older catalog endpoints. It queries Open Library's full-text bibliographic search (titles, authors, subjects) and Google Books' general volumes search, merges deduplicated results, uses a short cache, and retains the original search routes when providers fail. A Load more books button lets visitors browse later pages. These catalogs are extensive but do NOT cover every book ever published; a specific niche title may still be missing from both.

## Search and layout
The formerly decorative Discover input is now a functional search form synchronized with the global header search. The signed-in username/avatar control has moved from the top right to a compact account dock at the bottom of the left sidebar, in a Discord-inspired layout; notification bell stays in the header. Profile image fallback accepts uploaded AVIF avatars. Hover animations affect the poster/artwork, not titles or the entire card.

## Deployment
Run `npm install` and `npx wrangler deploy` from this extracted project, keeping the existing D1 binding and secrets. NO database migration is required. Existing users and media logs are preserved. Verify `/api/health` says `v57`. Refresh browser assets with Ctrl+Shift+R.

## Local validation
- `python tests/browser-v57.py` — integration-card imports, previews, search field synchronization, hover
- `python tests/browser-v57-books.py` — book search and Load More user flow
- `node tests/v57-books.mjs` — Open Library + Google Books and server-side cache
- `node tests/v44-offline-search.mjs` — offline search regression
- `node tests/v49-webnovels.mjs` — existing webnovel directory regression
- `python tests/browser-v56-theme-showcase.py` — Light/Dark/Pink and Showcase regression
- `node tests/release-alerts-v38.mjs` — notifications regression

The production Cloudflare deployment and real external catalog availability have not been verified by these local tests.
