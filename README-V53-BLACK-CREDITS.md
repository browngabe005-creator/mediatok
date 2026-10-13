# MediaTok v53 — true black dark mode and fast media credits

## What changed

- The Dark theme is now near-black (#080808 background, #141414 cards), not midnight blue. The old Blue-black selection is now labeled **Charcoal** and also uses the black/charcoal palette. Light mode remains unchanged.
- The media details modal has explicit high-contrast styles for title, summary, author, director, studio, people, roles, input controls and action buttons. Several hard-coded legacy navy styles are neutralized.
- The details window paints **known creator, author, developer and studio credits immediately**, directly from the existing search/catalog result. No network wait or extra D1 read is needed for those fields.
- Optional cast/director/character enrichment is a **single, time-bounded request** to `/api/credits/v53` with isolated external-provider lookups, in-memory deduplication, and Cloudflare edge caching of successful lookups for up to six hours.
- Anime/manga: AniList staff and characters first, and Jikan direct-by-ID fallback for staff or manga authors. Film/TV: TMDB when configured; TV also falls back to TVmaze. Books: original catalog authors shown immediately; some Google Books records can be enriched.
- The server-side credits route **does not query D1**, to avoid repeating the free-tier row-read exhaustion that caused login failures.
- Account sessions, auth, leaderboard, search, live chat, media logs, existing user data and webnovel directory are left unchanged.

## Source limitations

No external API can guarantee truly instant cast credits on a cold lookup. The immediately displayed fields must exist in the search response; additional staff and cast information depends on source availability. Repeat lookups return from cache. A missing record is marked as unavailable, rather than left loading forever or fabricated.

**To show full film cast and directors**, configure the TMDB API key as a Cloudflare Worker secret if you have not already:

```bash
npx wrangler secret put TMDB_API_KEY
```

The TMDB key is optional and is not stored in the ZIP. Use your own properly registered key from TMDB, respecting its terms. Without it, some film credits simply aren't accessible from the available sources; this does **not** affect search or existing films.

## Deploy

From the extracted directory:

```bash
npm install
npx wrangler deploy
```

No D1 migration. Do not reset D1 or create another Worker. `GET /api/health` should return `version: v53`. Refresh with Ctrl+Shift+R if an old Service Worker is still showing the previous palette.

## Verification

```bash
node tests/v53-credits.mjs
python tests/browser-v53.py
python tests/browser-v52.py
```

Look for immediate authors in a novel's details, a dark near-black page and legible details modal, then for any slower provider-populated cast/staff after the modal opens. Local tests use mocked providers; the deployed external API credentials and availability remain unverified.
