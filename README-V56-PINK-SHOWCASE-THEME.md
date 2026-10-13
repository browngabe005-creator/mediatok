# MediaTok v56 — Pink theme and Showcase visual cleanup

This release changes the **website UI only**. It makes no database migrations or account changes and preserves existing media search, leaderboard, Showcase add/remove behavior, Goodreads and Passport Dex file imports, live chat, and notifications.

## Changes

1. **Showcase editor tiles now match the selected site theme:** white in Light, charcoal in Dark, and warm blush in Pink. Previously the editor had an invalid CSS fallback to `#171717` when a light-themed surface was intended, causing unreadable dark-on-black title text.
2. **Media-type icons float directly over the profile posters.** Removed their opaque white square and shadowed border while retaining an icon-only drop shadow for visibility. Hidden legacy "View details" hover boxes where present. Posters themselves remain clickable to open details.
3. **Pink (Blush Pink) theme**, available in **Settings → Appearance → Site theme**. The preference is saved on that browser. It uses deep berry colored body/label text on very pale pink cards with dark-on-light contrast in media details, profiles, forms, and imports.
4. Updated service worker cache namespace so existing clients can receive the revised styles after deployment.

## Deploy

From the extracted project directory:

```powershell
npm install
npx wrangler deploy
```

**No D1 migrations.** Do not delete/recreate the D1 database. Check `/api/health` for version `v56`, then hard refresh (Ctrl + Shift + R) if the old style is still cached.

## Local checks

- `python tests/browser-v56-theme-showcase.py`: profile icon without square; light/dark/pink editor surfaces; readable text in pink media details; plus/remove toggles still work; theme selector.
- `python tests/browser-v54.py`: Showcase editing and both file-based import previews.
- `python tests/browser-v53.py`: true black dark mode and readable media-detail credits.
- `node tests/v54-library-server.mjs`: import validations and duplicate handling.
- `node tests/v44-offline-search.mjs`: search unaffected.
- `node tests/v49-webnovels.mjs`: expanded webnovel pagination unaffected.
- `node tests/release-alerts-v38.mjs`: notifications unaffected.

Note: Some older tests that import the Worker as a `data:` module cannot resolve its newer relative `credits-v53.js` dependency. They were not used as pass/fail criteria for this CSS-focused release.

**The live Cloudflare deployment was not verified.**
