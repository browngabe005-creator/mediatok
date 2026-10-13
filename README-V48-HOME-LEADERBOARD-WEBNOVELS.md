# MediaTok v48 — homepage covers, leaderboard scoring and webnovel browsing

This version **builds on v47**. It does not replace or remove the working v44/v45 search system, Global Recents recovery, user logs, sessions, database, forum, profiles, live chat or notifications. Do not reset or recreate the D1 database.

## Homepage artwork

* A recently logged title still becomes a homepage featured candidate if its saved cover field is blank. Its poster is resolved through MediaTok's existing title-based cover lookup, exactly like the Global Recents sidebar.
* Verified artwork wins over stale cover URLs when filling the homepage's featured cards and four media-category tiles.
* Once Global Recents recovers a real cover, the homepage updates those featured areas rather than keeping previously allocated but broken candidate slots.
* The same images appear in search, home and Global Recents wherever the underlying provider actually has artwork; titles without legitimate artwork may still have no poster. No fabricated cover art.

## Leaderboard: completed story-focused games only

* The leaderboard's server-side totals are based on **Completed** logs. Planning, In progress, On hold and Dropped never count.
* Completed entries from supported non-game media categories count normally.
* `game`, `Game`, `games`, `video-game`, `video_game` and related spellings are normalized and always treated as games, not accidentally counted by the non-game SQL total.
* **Only games on the reviewed narrative game allowlist** increase leaderboard entries. Multiplayer-focused games such as Fortnite, Valorant and League of Legends, non-story games such as Tetris, and unknown/unclassified titles do not count. Multiplayer modes inside a story-based game are not separately tracked by the current log schema.
* The leaderboard page and sidebar consume the same `/api/leaderboard` response; leaderboard requests avoid stale cached totals. User-owned logs stay untouched.

## Webnovels

* The local web fiction directory has been increased from **7 to 101 unique titles**, ranging from Reverend Insanity and Lord of the Mysteries to Worm, The Wandering Inn, Shadow Slave and many other works.
* `GET /api/webnovels/browse?offset=0&limit=36` serves the directory, including pagination and `hasMore`.
* When the Webnovels category is selected on Discover or Books & Comics, the page offers a browsable directory with Load More, rather than defaulting to unrelated anime recommendations.
* All 101 included titles are searchable offline. MediaTok still searches outside catalogs and allows manual logging for titles not in its directory. **This is not a comprehensive list of every webnovel.** External services do not provide a complete common catalog.

## Deployment

1. Extract the ZIP to a new folder.
2. In that folder, run `npm install` and `npx wrangler deploy`.
3. The full Worker **and** the `public` assets need to be deployed together, not only the frontend.
4. Check `https://mediatok.org/api/health` returns `"version":"v48"`, and try the homepage, the leaderboard and the Webnovels tab.
5. Use Ctrl+Shift+R if the previous service worker is still active.

There are no new D1 migrations. Keep the same Worker name, existing D1 binding, Durable Object and Cloudflare secrets. This package has not been deployed to, or tested against, mediatok.org production by ChatGPT.

## Local verification

* `node tests/v48-webnovels.mjs` — 101-title index, pagination, Worker API routing, offline searches.
* `node tests/leaderboard-story-games-v47.mjs` — story allowlist and multiplayer exclusions.
* `python tests/leaderboard-sql-v48.py` — executes actual leaderboard SQL on SQLite with mixed game types/statuses.
* `python tests/browser-v48.py` — Playwright homepage with six missing poster URLs, the four medium tiles and webnovel Load More.
* `python tests/browser-home-cover-v47.py` and `python tests/browser-shared-artwork-v46.py` — preserve prior working image flows.
* `node tests/v44-offline-search.mjs`, `node tests/v45-artwork.mjs`, `node tests/release-alerts-v38.mjs` — preserve search/artwork/notifications behavior.

Mocked provider/browser tests cannot guarantee production API access or cover availability.
