# MediaTok v58 — Currently Watching / Reading / Playing

Built from v57. No database migration, D1 reset, login changes, or new secrets.

## Public profile

When the viewed profile has entries whose saved status is **In progress**, the profile displays a compact **Currently watching & reading** panel between the main profile and Global Recent Activity. Global Activity moves farther right on wide screens. On narrower screens these panels stack responsively so the profile remains readable. On profiles with no active entries, the prior layout remains unchanged.

The preview displays the six most recently updated active entries, with title, media type, and episode/chapter/page/hour/minute progress. The bottom-right **View all** control opens a scrollable dialog containing *every* in-progress entry and media-type filters. People can see their own and others' public in-progress entries. Clicking an entry opens its details.

In each profile medium tab, an active-media strip appears above the regular list **only when that member has in-progress entries in that medium**. Regular completed/planning lists remain available.

## Progress in View Details

Signed-in members have a **Your progress** form directly inside View Details to set progress and status. The controls use an appropriate progress label for each medium:

- anime / TV: Episode
- manga / comic / light novel / webnovel: Chapter
- books: Page
- games / visual novels: Hour
- films: Minute

The new `/api/logs/progress` GET and POST paths use the existing `media_logs.status` and `media_logs.progress` columns. Data is authenticated, integer-validated, and limited to the user's own entries. The lookup recognizes an imported title even when the entry has a source-specific media key, preserving existing ratings and notes. There is **no new D1 migration**.

Entries imported from AniList, MyAnimeList, and CSV/JSON importers whose status is Watching, Reading, Playing, Currently Reading, or equivalent already map into `In progress` and will therefore appear automatically. Planning and Completed entries do not appear in Currently.

## Checks

- `node tests/v58-progress-route.mjs`
- `python tests/v58-currently-browser.py`
- `python tests/browser-v56-theme-showcase.py`
- `python tests/browser-v57.py`
- `python tests/browser-v57-books.py`
- `node tests/v54-library-server.mjs`
- `node tests/v44-offline-search.mjs`
- `node tests/v49-webnovels.mjs`
- `node tests/release-alerts-v38.mjs`

A legacy browser-v54.py script expects import controls on the now-removed Settings panel; use browser-v57.py for the current layout. The older story-game leaderboard test imports the Worker from a data URL and fails to resolve the newer module imports; it does not indicate a newly introduced leaderboard error.

## Deploy

From the extracted folder:

```
npm install
npx wrangler deploy
```

Preserves the existing Worker, D1, accounts, session cookies, imports, catalog, follower system, and Durable Object binding. Refresh the page after deploying. `/api/health` should report `v58`.
