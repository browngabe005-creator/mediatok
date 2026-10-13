# MediaTok v47 — homepage artwork and leaderboard eligibility

This update is based on **v46**. The v44/v45 search system, working Global Recents cover recovery, profiles, live chat, notifications, and existing Cloudflare D1 storage are retained. No D1 migrations or database resets are required.

## Why homepage posters were blank

Global Recents displays artwork from actual logged-media records, while the homepage was almost entirely dependent on hard-coded niche recommendations and dozens of fresh, often throttled external image lookups. Media type previews stayed empty until several remote images had been located and tested. The homepage failed even when the same saved artwork worked in the sidebar.

## v47 frontend change

- **Homepage featured grid:** Displays recently logged media with valid saved or previously verified cover URLs first, then fills unused spots with editorial niche picks. Cover-image recovery remains separate from search and does not block it.
- **Explore by medium tiles:** Immediately populate from logged-media covers already available in the Global Recents feed; only request other titles when insufficient usable covers exist. Additional covers appear progressively rather than leaving the whole tile empty.
- **Unified verified artwork cache:** Artwork confirmed to load in search or Global Recents can populate homepage slots when it becomes available. Guards prevent repeated identical image-load events from causing a refresh loop.
- **Shared cover URLs and failure handling:** Existing site image proxy and fallbacks retained. Browser only contacts artwork providers for uncovered titles.
- **No changes to search or Global Recents:** The working search API/client and sidebar image recovery code are preserved.

## Leaderboard scoring

- As before, only **Completed** entries count; Planning and other statuses do not.
- Completed anime, manga, TV, films, novels, comics, and other non-game media count normally.
- **Multiplayer-focused and non-story games do not count.** Because current media log records store only a title, not structured genres/multiplayer flags, game eligibility is conservative: only titles in `LEADERBOARD_STORY_GAMES` in `src/worker.js` count. Unknown games do not count until reviewed. That list can be expanded without touching a user’s logs.
- Ranking results are computed server-side from all members, so the top-ten page and sidebar use the same totals. No media entries are deleted; excluded games stay visible on profiles and can still be logged and searched.

## Tests performed locally

- `python tests/browser-home-cover-v47.py`: homepage uses stored media artwork across six media types, four categories render, Global Recents still loads, zero fresh image API requests needed for those covers.
- `python tests/browser-shared-artwork-v46.py`: search-to-home, recovered Global Recents artwork, broken-cover fallback, Explore-by-medium, and feed still pass.
- `node tests/leaderboard-story-games-v47.mjs`: completed narrative games count; online/non-story/unknown games do not; other Completed media still count.
- `node tests/v44-offline-search.mjs`, `node tests/v45-artwork.mjs`, and `node tests/release-alerts-v38.mjs`: regression tests pass.
- Both frontend inline script and Worker syntax checked.

All these tests use mocks or local test data. The live `mediatok.org` deployment and production image hosts cannot be verified here.

## Deploy to your existing Cloudflare Worker

1. Extract the ZIP, preserving folder structure.
2. Confirm `wrangler.jsonc` targets the existing Worker and `DB` binding.
3. From the extracted folder:

   ```powershell
   npm install
   npx wrangler deploy
   ```

4. Check `https://mediatok.org/api/health` returns `"version":"v47"`.
5. Hard-refresh or open a private window. Visit the homepage and Global Recents and confirm logged titles use their same covers.

**Do not reset, recreate or delete the database, run migrations for this update, or upload only the public folder.**
