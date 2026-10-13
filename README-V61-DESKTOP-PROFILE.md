# MediaTok v61 — Desktop profile spacing and adaptive watching preview

This release is built on v60. It does not reset or modify user data, database bindings, login sessions, game leaderboard rules, webnovels, or the v60 mobile redesign.

## Changes

- Desktop profile: align left **Your Space** navigation, profile banner, Currently Watching, and Global Activity to the same top grid. All three profile columns stay beside one another on desktop widths (1021px and above), instead of stacking the rails unexpectedly.
- Banner: modestly increase desktop banner from 156px to 178px high.
- Media navigation: remove the surrounding white box/background/border from the profile media navigation while retaining individual, theme-aware category buttons.
- Profile media cards: no movement of the title, status, or entire card on hover. Only reveal the small media-type icon on the artwork, without a boxed overlay or a new View Details label. Artwork remains clickable.
- Currently Watching: render active titles into the preview until no additional *complete row* fits in the fixed-height rail; no internal scrolling. Keep View All accessible at the bottom right. The full collection still opens separately, with status/progress saved as before.
- Avatar/banner uploads: remove the 400 KB **selection** restriction. Larger PNG/JPEG/AVIF/WebP/GIF images are optimized to WebP in the browser before saving, while the server's bounded data-URL storage remains unchanged. This accepts much larger source files and dimensions without increasing D1 data usage. **Large animated GIFs will become static after optimization**; use a direct HTTPS image URL for large animation files. Cloudflare's HTTP, memory, and database constraints still apply, so this is not unlimited file *storage*.

## Deploy

Unzip the whole project and run:

```
npm install
npx wrangler deploy
```

The Worker health endpoint should return `v61`. No new D1 migration is needed. Hard refresh the site (Ctrl+Shift+R). If the installed PWA caches an older layout, close and reopen it.

## Verification

`python tests/v61-desktop-profile.py` checks 1160px / 1440px / 1760px layout, matching right rail heights, row-fitting, poster-only hover, and a 6 MB image compression case. `python tests/screenshot-v60-mobile.py` checks the prior mobile Home/Explore rendering. Other existing tests cover offline search, progress, imports, book search, webnovels, avatars, and notifications.

Local browser tests do not establish that the live site has been updated. Do not claim the deployment was completed until Cloudflare confirms it.
