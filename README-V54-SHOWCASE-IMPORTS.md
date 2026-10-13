# MediaTok v54 — Showcase editing, poster hover, library imports

Based on v53. Existing Cloudflare Worker name, D1 binding, Durable Objects, credentials, account/session tables, search, cover recovery, credits, webnovel directory, and leaderboard scoring are preserved.

## Showcase control repair

The old Edit Showcase view nested a clickable media poster inside a selection button. The inner poster intercepted the click and opened media details instead of changing the selection. In v54:
- Click the **+** icon at the upper-right of the poster to add it to Showcase.
- Click the **check** icon to remove it.
- Click the poster itself for media details.
- The order and selection are committed by **Save profile**. Cancel leaves your saved Showcase unchanged.
- Existing five-item capacity and fallback-to-top-rated behavior are maintained.

Hover polish adds a slightly lifted cover, subtle image zoom and shadow across posters, results, featured artwork, and Global Recents. Motion is disabled for visitors using the reduced-motion accessibility preference.

## Goodreads imports

1. Visit https://www.goodreads.com/review/import, then download the **Export Library** CSV.
2. On MediaTok, open **Settings > Media imports > Goodreads**, choose the CSV and press **Preview Goodreads**.
3. Check the sample titles, then press **Import**.

This maps `Title`, `Author`, `Exclusive Shelf`, `My Rating`, and publication year. Goodreads `read` → Completed; `currently-reading` → In progress; `to-read` → Planning; DNF → Dropped. Five-star ratings are multiplied by two to fit the MediaTok 0–10 scale; rating 0 is unrated.

## Passport Dex imports

Go to **Settings > Media imports > Passport Dex**, choose a CSV or JSON file containing your collection, preview, and confirm.

The importer supports common fields: `Type`/`Category`/`Medium`, `Title`/`Name`, `Status`, `Rating`, `Year`, `Author`, and an optional HTTPS `Cover` URL, or JSON arrays organized into `games`, `movies`, `tv`, `books`, `anime`, `manga`, etc. A sample template is in `examples/passportdex-import-template.csv`. Unsupported types (such as music/albums, which this MediaTok version does not support) are skipped and counted in the preview.

**Caveat:** We have not verified an official Passport Dex native *export* schema or direct integration API, so this is a compatible CSV/JSON file importer, not an authenticated Passport Dex live sync. If an actual export has different field names or nesting, the importer may need mapping updates. No credentials are requested.

## Safe import semantics

- The file is parsed and previewed in the browser; MediaTok receives only the normalized media entries when you confirm.
- Each authenticated request sends up to 40 entries (server enforces max 50).
- Before inserting, the Worker checks titles and types already in that member's logs; existing entries are skipped, never overwritten or removed.
- No new D1 tables or migrations are needed. Imports add records only in `media_logs`.
- Import results show inserted vs skipped counts; you may safely retry.
- For large files, keep an eye on D1 billing: imports inherently write records and read existing entries for duplicate checks.

## Deployment

```
npm install
npx wrangler deploy
```

Check `/api/health` -> `version: v54`, then refresh (Ctrl+Shift+R). Deploy the **whole Worker package**, not just the static HTML, because `/api/import/library` must be running.

## Local checks

```
node --check src/worker.js
python tests/browser-v54.py
node tests/v54-library-server.mjs
python tests/browser-v52.py
python tests/browser-v53.py
node tests/v53-credits.mjs
node tests/v49-webnovels.mjs
```

Live production has not been verified here. No account deletion, role, sign-in, or database-reset operations were made.
