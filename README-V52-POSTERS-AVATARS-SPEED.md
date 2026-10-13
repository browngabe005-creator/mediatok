# MediaTok v52 — Clickable Artwork, Global Search Avatars & Homepage Responsiveness

Built from the full v50 project, retaining the search engine, webnovel directory, account/session infrastructure, global feed, forum and leaderboard scoring unchanged.

## Repairs

- **Global Search member photos:** `/api/search/users` now supplies both the custom profile `avatar_url` and original Discord `avc` fallback. The user-result renderer uses the same progressive avatar component that fixed leaderboard photos, including recovery on HTTP/image load failure. Legacy schemas without `avatar_url` remain supported.
- **Profile Showcase and Planning:** deleted the intrusive “View details” hover overlay. The entire poster remains a keyboard-accessible, clickable target.
- **One-click details across the site:** search results are clickable without an extra details button; homepage featured posters, discovery recommendation posters, Global Recents covers, and individual Explore-by-medium covers now open the media details dialog directly. Search and logging actions remain available.
- **Animated media dialog:** short scale/slide/fade and backdrop blur animations, Escape-to-dismiss, mobile support, and `prefers-reduced-motion` handling.
- **Home artwork load:** known images are displayed directly. The category fallback no longer waits for three sequential proxy image preflight attempts, and categories populate independently. Activity-loaded artwork no longer forces redundant immediate page rerenders; refresh is debounced. Artwork fallback is retained on actual image failures.
- **Profile URLs/preview branding:** browser profile titles and Open Graph link preview metadata use MediaTok, not styling-inspiration branding. Existing external social apps may cache older link previews.
- **Service Worker:** version changed to `mediatok-v52-poster-media` for a fresh frontend.

## Install

Use the whole extracted folder:

```sh
npm install
npx wrangler deploy
```

No new D1 migration is required. Keep your current Cloudflare Worker name, database binding, secret environment variables and Durable Objects. DO NOT delete/replace the existing D1 database. Remember that the project's existing `predeploy` sync may fetch webnovel data.

Check `/api/health` reports `v52`, then hard-refresh with Ctrl + Shift + R. Verify member avatars in Global Search, fast homepage covers, poster clicks on profile Showcase and Planning, and profile-link previews. Profile preview metadata from Discord or other social sites may remain stale until their caches expire.

## Local verification

- Browser: `python tests/browser-v52.py`
- Browser: `python tests/browser-home-cover-v47.py`
- Browser: `python tests/browser-v50.py`
- Existing catalog and leaderboard tests in `tests/`.

No production Cloudflare deployment or live external image-provider verification was performed from this environment. Some third-party image URLs may be unavailable, expired or rate-limited; do not claim that every poster will always have artwork.
