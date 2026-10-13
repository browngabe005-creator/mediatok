# MediaTok v59 — Global avatars & non-scrolling Currently Watching

## What was fixed

- The Global Activity feed and profile's Global Recents rail now retrieve the member's uploaded `users.avatar_url` alongside their saved Discord avatar `users.avc`, and send both to the browser. The latter is used if the first image fails. Previously the feed returned only `avc`, unlike the already-correct leaderboard. The endpoint uses one joined query; it does not make a user lookup per activity card.
- Global Search member results and other shared account-avatar surfaces continue to use the same two-source browser fallback. Completely unavailable/missing images render readable initials rather than a broken-image icon.
- The profile's Currently Watching & Reading preview has no internal scrollbar. At large desktop widths, both the Currently panel and Global Activity panel use an identical bounded outer height. The preview displays up to four titles (three on short windows), with View All pinned to the bottom right. View All still opens all active titles and their media-category filters.
- No database migration. Works with older databases missing the custom-avatar column by falling back to Discord avatar.
- Working media search, imports, saved status/progress, accounts, role/leaderboard rules and live chat were not rewritten.

## Install

In this extracted project folder:

```
npm install
npx wrangler deploy
```

Deploy the Worker and static assets together, not only the public HTML. This update uses the existing `DB` binding and requires no schema migration. Never recreate D1 or delete user data to deploy.

After deploying, confirm `/api/health` returns `v59` and refresh the page with Ctrl+Shift+R. On a profile with active media, the two right panels should share a height on wide desktops, and View All opens the full list. Inspect Global Activity and member search to confirm uploaded pictures have the same fallback behavior as the leaderboard.

## Testing

- `node tests/v59-global-avatars.mjs` — custom and Discord image fields returned for global and following feeds, including legacy schema fallback.
- `python tests/v59-current-avatars-browser.py` — profile sidebars match heights; Currently preview is not scrollable; View All includes the full list; failed user images fall back in both Global Activity and Global Search.
- Existing offline catalog, webnovel pagination, progress endpoint, library import, book-search browser and release-alert tests passed locally.

External avatar CDN availability and the live deployment could not be verified from this environment. Members whose custom **and** Discord image URLs are both broken will display an initial instead of an empty/broken avatar.
