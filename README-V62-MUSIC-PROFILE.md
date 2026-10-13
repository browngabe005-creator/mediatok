# MediaTok v62 — aligned desktop profile & Last.fm music showcase

## Changes

- The desktop Your Space navigation now starts and ends level with the two profile activity rails. Links were compacted to fit, with no hidden navigation items. On tablet and mobile the independent v60 layout remains.
- The profile now has a unified right-side grid: **Currently Watching** and **Global Activity** on top, with the **Music** section immediately underneath both. The Music area shows a maximum of four distinct recently listened artists when the user connects their own Last.fm username.
- A profile owner can choose **Edit** in Music to save their public Last.fm username or switch to **Favorite artists / songs** and manually select up to four choices. All visitors can view the saved selections.
- Song favorites include a performer field, and each Music item links to its Last.fm artist or song page. Existing search, logs, lists, imports, Showcase, leaderboards, session handling, and database bindings are preserved.

## Last.fm integration

The Worker uses `user.getrecenttracks` with the profile's public Last.fm username. Configure one of these Cloudflare Worker secrets if no Last.fm key is already present: `LASTFM_API_KEY` (preferred), `LAST_FM_API_KEY` or `LASTFM_KEY`. **Do not embed API keys in public HTML.**

Example, from the project directory:

```sh
npx wrangler secret put LASTFM_API_KEY
```

The Last.fm key is only used server-side, and no Last.fm password or OAuth tokens are required. The recent-artists result is cached in Worker memory for five minutes to reduce provider requests. If the Last.fm provider is unavailable, MediaTok displays a message or saved favorites instead. Available images are taken from recent track album art; Last.fm does not guarantee portraits for artists.

User selections are stored in the existing `users.socials` JSON column (`lastfm`, `musicMode`, `musicFavorites`), so **no new D1 migrations** are required. Ordinary profile edits now preserve these music fields rather than overwriting them. Favorites can be viewed without the Last.fm API.

- `GET /api/music/v62?profile=USERNAME` — public normalized music display, never exposes API keys.
- `POST /api/music/v62/preferences` — cookie-authenticated account owner only; validates four or fewer entries; keeps other social links.
- `GET /api/health` — should return `version: "v62"` after deployment.

## Deployment

```sh
npm install
npx wrangler deploy
```

Preserve existing Cloudflare Worker project, D1 database, bindings and secrets. Do not recreate the database or purge stored profile records. v62 includes a service-worker cache-version bump to refresh older cached pages.

## Local checks

```sh
node tests/v62-music-backend.mjs
python tests/v62-profile-browser.py
```

The browser checks validate four cards, the owner Edit dialog, sidebar and panel alignment at 1160 / 1440 / 1760 pixels, and no mobile overflow at 390 pixels. Existing mobile, episode-progress, webnovel, import, and release-notification checks were also run. External Last.fm and live Cloudflare deployment have not been tested from this environment.
