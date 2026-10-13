# MediaTok v63 — Music connection repair

This is based on the v62 project and intentionally keeps the working search, webnovel importer, profiles, leaderboard, theme system, mobile layout, D1 bindings and Discord authentication unchanged.

## What changed

- The Music panel now explains the **specific reason** recent artists aren't loading: missing Last.fm API key, invalid Last.fm username, rejected API key, no recent scrobbles, or temporary provider failure.
- Added **Customize Profile → Accounts → Last.fm Music → Set up music** alongside the existing integrations. Editing from the Music panel still works.
- Connect a **Last.fm username** for each user. A site-wide Last.fm API key alone cannot identify which member's music to display.
- The Worker recognizes `LASTFM_API_KEY`, `LAST_FM_API_KEY`, `LASTFM_KEY`, `LAST_FM_KEY`, or `LASTFM_API` as existing key variable names.
- Hand-picked artists and songs work **without any external API key**, and remain visible when Last.fm is unavailable.
- The last four *distinct* recent artists are displayed once Last.fm has data. The recent-track response stays cached for five minutes in Worker memory.
- Uses new v63 endpoints, keeping the old v62 Music API paths operational. Updates the PWA cache version to avoid a stale HTML shell.

## Required Cloudflare setup for *recent listening*

First check whether the Last.fm API key already exists as a Worker secret or variable. **Do not share the key** in chat, screenshots, your HTML, or GitHub.

If it does not exist, add it from the MediaTok project directory on your trusted device:

```sh
npx wrangler secret put LASTFM_API_KEY
```

Paste the key in the local Wrangler prompt; it is not part of the ZIP. Alternatively, use the Cloudflare Dashboard → Workers & Pages → mediatok → Settings → Variables and Secrets.

After deploying, each MediaTok member opens their own profile and chooses **Music → Edit**, or **Customize Profile → Accounts → Last.fm Music → Set up music**, then enters their **Last.fm username** (not the API key). They should select **Recent artists** and save. If Last.fm hasn't received any of their listening data yet, there will be nothing to display; choose the **Favorites** mode as an alternative.

If a user sees “Last.fm API key missing” after deploying, check that the key is configured on the actual *mediatok* Worker and environment, not just in a local `.env` file or a different Cloudflare project.

## Safe deployment

```sh
npm install
npx wrangler deploy
```

No D1 migrations. Preserve `wrangler.jsonc`, existing Worker name, database, Durable Objects and secrets. Do not reset sessions or recreate accounts.

Verify `/api/health` returns `"version":"v63"`. For a known MediaTok user, the public endpoint `/api/music/v63?profile=USERNAME` gives a readable `source` and `message` (without revealing the API key). If no media appears, check the exact message.

## Local tests

- `node tests/v63-lastfm-status.mjs`: complete provider and preference failure matrix.
- `python tests/v63-music-setup-browser.py`: real browser status display, username field, editor button in Accounts.
- `node tests/v62-music-backend.mjs` and `python tests/v62-profile-browser.py`: existing music and responsive behavior.
- Offline media search, webnovel pagination and release-alert regression checks also passed.

No changes here can establish whether an external person accessed your computer or Cloudflare account. Independently secure Cloudflare and email with MFA, revoke unfamiliar sessions/tokens, and retain extortion evidence. The prior screenshots are not proof of root access.
