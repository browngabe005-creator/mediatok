# MediaTok v93 — Lists + separate site UI foundations

## What's included

- Safe, additive canonical media identity and activity-event **foundation** (`0016`). Known-provider identities are not automatically merged and no prior imported watch dates are invented.
- Custom Public Lists (`0017`) with up to 40 lists/account and 150 titles/list; public/unlisted/private visibility, ranking, ordering, editing, notes, share links, owner enforcement. Public browse in **Lists** navigation, Save to List on media detail modal.
- Browser-local site style picker in **Settings → Appearance → Site UI Style**, independently of users' public profile layout. Four style foundations: MediaTok Default, AniList, Passport Dexx, Letterboxd. Passport gets mouse-follow poster tilt/lift; touch/reduced motion disabled.
- No changes to the three existing public profile renderers.

**Not included yet:** full pixel-identical page parity, proprietary external features, DNA, Wrapped, Achievements, Taste Twins. The spec explains phases and exact later work.

## Deployment (Cloudflare Worker + D1)

1. **Back up the existing D1** and confirm the target Worker/database in `wrangler.jsonc`. This ZIP is a full project; do not create a new Worker or new database.
2. Apply migrations **0016 and 0017** in order. With Wrangler from the project directory: `npx wrangler d1 migrations apply mediatok --remote` (applies only pending migrations).
3. Upload/deploy the **whole project**, including `src/lists-v93.js`, `src/activity-v93.js`, `public/lists-v93.js`, `public/lists-v93.css`, `public/site-skins-v93.js`, `public/site-skins-v93.css` and service-worker assets.
4. Check `/api/health` returns `"version":"v93"`. Hard-refresh or let the new service worker activate.
5. Check Lists public browse, signed-in create/edit/reorder, logged-out public share, unlisted token access, private visibility, Save to List from View Details.
6. Check switching site styles on Home/Discover/Lists, then open each profile theme (Original/Anime/Future) and confirm it is unchanged. Verify on narrow mobile screens as well.

## Local validation

- `node tests/v93-lists.mjs` — real SQLite schema and list-route assertions (using Node 22 `node:sqlite`).
- `node --check src/worker.js && node --check src/lists-v93.js && node --check public/lists-v93.js && node --check public/site-skins-v93.js`.
- Revalidate all inline scripts from `public/index.html` after any HTML edits.
- SQLite migrations 0001–0017 applied successfully in a fresh local database. **Production migration and interactive browser validation remain outstanding**.

See `docs/IMPLEMENTATION-SPEC-V93.md` for exact routes, schema design, file changes, parity matrix, acceptance tests, rollback guidance and next releases.
