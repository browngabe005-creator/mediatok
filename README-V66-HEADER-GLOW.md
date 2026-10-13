# MediaTok v66 — Profile header and Alice particle-glow correction

Base: MediaTok v65. This is a deliberately narrow update; it leaves the new desktop content columns, mobile redesign, music opt-in, existing media features, database and authentication code as they were in v65.

## Changes

1. **Original header restored:** removes v64's conflicting CSS that centered the portrait, identity and roles inside the banner. On desktop, avatar and name/roles/followers remain grouped at the banner's lower **left**; Edit Profile and Share are aligned on the **right** of that same row. Media categories, Showcase, Planning, Currently Watching, Global Activity, Music, and mobile layout are unchanged.
2. **Alice-inspired particle glow:** keeps v65's original upward particles, mouse repulsion, and click ripples/sparks. Adds an opt-in pointer-following soft glow and an actual glow over the profile banner, above its background but **behind its avatar/text/buttons**. The chosen particle color controls the glow. Profile effect remains disabled by default, is pointer-transparent, and respects reduced-motion settings.
3. Changes the service-worker cache version and `/api/health` value to `v66` so a deployed page can be distinguished from stale builds.

## Deployment

From the extracted project directory:

```powershell
npm install
npx wrangler deploy
```

No database migrations. Do not replace or reset the existing D1 database, the Worker, or Cloudflare secrets. If the live site still displays the old centered header, verify `https://mediatok.org/api/health` says `v66`, then fully close and re-open the tab and hard-refresh (Ctrl+Shift+R) to replace an old cached frontend.

## Local tests

- `python tests/v66-header-glow-browser.py` — left-aligned header, actions, responsive desktop/mobile, conditional effect and pixel-visible glow.
- `python tests/v65-profile-layout-browser.py` — profile columns and particle canvas.
- `node tests/v64-profile-settings-route.mjs` — saves and restores settings without affecting Last.fm.
- `node tests/v62-music-backend.mjs`, `node tests/v58-progress-route.mjs`, `node tests/v44-offline-search.mjs`, `node tests/v49-webnovels.mjs` — smoke/regression.

Local tests are not a verification of production Cloudflare deployment or the presence of a configured Last.fm key.
