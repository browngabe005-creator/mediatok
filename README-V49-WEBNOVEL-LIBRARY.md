# MediaTok v49 — expandable Webnovel Library

v48's 101 hardcoded novels were not enough. v49 replaces the hard ceiling with a **paginated, searchable catalog**. Search, homepage artwork, leaderboard scoring, chat, accounts, and D1 database remain unchanged outside the webnovel category. No database migration is necessary.

## What changes

- The Webnovels tab shows the *actual* number of loaded titles; it never pretends a small offline fallback contains thousands.
- Browse 36 entries at a time, with Load More for arbitrarily large offsets (tested past 12,000).
- Filter by title or author within the directory; ordinary MediaTok webnovel search also matches the larger directory.
- Each entry may include a title, author, and original source cover when available. No generic invented poster images.
- Upstream snapshot fetches are cached for a day within the Worker; simultaneous searches share one request.
- The existing 101 offline starter titles remain available if the catalog is unreachable.
- The Worker serves a built copy of the catalog from its own static assets when one exists, so it need not contact third-party sites after deployment.

## Production install (recommended)

From the extracted project root, run:

```bash
npm install
npm run deploy
```

`npm run deploy` invokes the predeploy sync script, downloads a static snapshot, converts it to a compact `public/webnovels/catalog.json`, then deploys the entire Worker with the assets. **Do not deploy just `public/index.html`.** This step can increase the available catalog from 101 entries into the thousands, depending on the third-party snapshot's actual contents. If the download fails, the deploy continues, and the backend can try loading that public snapshot at runtime; the original 101-title fallback remains.

To require a successful catalog sync before deployment (recommended for important deployments):

```bash
npm run webnovels:sync
npx wrangler deploy
```

The strict sync aborts if the source has fewer than 500 valid unique titles. It prints the **actual** imported count. The site exposes the loaded count at `/api/webnovels/browse?limit=1`, including a `source` field. You can confirm thousands are available without browser developer tools.

If you have a more comprehensive **licensed** webnovel catalog, you can import its JSON by running:

```bash
node scripts/sync-webnovels.mjs --strict --file=/path/to/authorized-catalog.json
npx wrangler deploy
```

Expected shape: `{ "books": [{ "title": "Example", "id": "123", "author": "Author", "cover": "https://..." }] }`. Also accepts the compact snapshot's `n` and `i` fields. The importer deduplicates titles and prevents an incomplete dataset from replacing a larger valid one.

## Provenance, limitations, and rights

The default optional source is an **unofficial, periodically refreshed WebNovel catalog snapshot**, maintained by the independent MIT-licensed [WebNovel Advanced Search project](https://github.com/Varun-Patkar/webnovel-advanced-search). Its authors say the snapshot is partial, has no guaranteed refresh schedule, and is unaffiliated with the publishing platform. **The MIT license applies to that project's code and does not grant rights to all underlying third-party covers or metadata.** Check permission and source terms for commercial use, and respect removal requests. The installer stores listing metadata only, not chapters, text or authentication tokens. Runtime cover URLs point to source hosts and may sometimes be blocked by hotlink protection.

A separately published [NovelUpdates-based dataset](https://github.com/shaido987/novel-dataset) reports 24,639 translated novels as of August 21, 2025, but **it is not bundled or claimed as imported**: redistribution permissions have not been established. This shows why v48's 101 entries did not represent the universe of web fiction. MediaTok's import format can ingest authorized exports from other sources as you expand beyond WebNovel.

## Smoke tests

```bash
npm run test:v49
python tests/browser-v49.py
node tests/v48-webnovels.mjs
node tests/leaderboard-story-games-v47.mjs
```

Tests mock a 12,501-title catalog to verify pagination and search. The source file cannot be downloaded in the assistant's isolated test environment, so the tests do **not** certify the live provider's current count, field format, or the live website's deployed behavior. Verify `/api/webnovels/browse?limit=1` after the actual deployment.
