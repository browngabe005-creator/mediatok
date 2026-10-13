# MediaTok v94 — Passport-inspired site-wide browsing UI (first pass)

**Baseline:** MediaTok v93, preserving its Custom Lists and additive migrations 0016–0017. This is a complete Worker project archive, not a deployed website.

## What actually changed

Selecting **Settings → Appearance → Site UI Style → Passport Dexx Style** now uses **distinct page renderers**, not just recoloring MediaTok's original UI:

- Site navigation uses an independent black left icon rail, a large rounded taupe main workspace, and a right-hand member circle on wide screens.
- Home/Hub is a new page with a hero, horizontally swipeable media-cover rails, links to the Library and community, and staggered entry animations.
- Discover/Search is a separate layout with an immersive heading, inline cross-medium search, medium chips, poster wall, and existing media/member search handlers.
- The Library is a new cross-medium cover grid populated by **the signed-in user's existing `/api/logs?user=` response**, with text, medium and status filters. Opening any tile uses MediaTok's existing details modal.
- Custom Lists, Community, Forum, Leaderboard, and Settings use the new site shell and passport-framed sections, while retaining their underlying working components and server routes.
- Media cards and covers get CSS lift/scale/deal effects and RAF-throttled pointer rotation/glare on supported devices. `prefers-reduced-motion` is supported.
- On mobile the icon rail is hidden and the existing working bottom navigation is kept.

No Passport Dexx or AniList logo is imported. The app remains MediaTok.

## What has NOT been completed

**This is not a full or exact clone of Passport Dexx.** Specialized compare physics/stories, creator pages, community recommendation engine, complete detail-sheet parity, stash collaboration, and all external-platform features require separate milestones, data, permissions and testing. AniList and Letterboxd remain v93's initial visual foundations, not complete page-by-page rebuilds. Those should be built after approving the Passport browsing reference.

## Primary changed files

- `public/site-layouts-v94.js`: standalone Passport browser page components (hub, discover, library, client-only shell, share, filters)
- `public/site-layouts-v94.css`: dedicated Passport layout and responsive/motion styles
- `public/index.html`: routes to the Passport components when the Passport site style is selected; existing default and public profile renderers preserved
- `public/site-skins-v93.js`: hover targets expanded to cover the new poster components
- `public/service-worker.js`: cache version v94 and pre-cache two new assets
- `src/worker.js`: health version v94 only
- `tests/v94-site-layouts.mjs`: static isolation/regression assertions

**There are no new D1 migrations in v94.** The project still needs v93's 0016 and 0017 migrations if you have not already applied them, and those must be applied after backing up production D1. Do not drop/reset existing tables or create a new D1 database.

## QA performed

- Chromium local in-memory rendering produced desktop screenshots for Passport Hub, Discover and Library, and a mobile screenshot for Hub.
- Desktop and mobile layout rendering checks found the new pages and no horizontal overflow in the mobile Hub run.
- Browser navigation/screenshot runs were unstable or timed out on some repetitions in the sandbox; complete live Cloudflare/browser E2E confirmation remains **pending**.
- `node --check` passed on Worker, site-layouts, site-skins and the main inline script.
- Existing v93 Custom Lists REST/security tests passed.
- Original, Anime and Future profile renderer spans compared byte-for-byte with the v93 baseline and were identical.
- No production database or Worker was touched.

## Safe deployment

1. Back up existing production D1 and identify the existing Worker binding; preserve both.
2. Review the v93 Custom Lists migrations (`0016`, `0017`) and apply them **only if not already applied**.
3. Deploy the entire v94 Worker project and its public assets (do not deploy only `index.html`).
4. Check `/api/health` reports `v94`; hard-refresh; select Passport style in Settings.
5. Test with a real logged-in account: Hub, medium tabs, query search, details/logging, filters in Library, list create/edit/save, forum activity, notifications, and return to default UI.
6. Test all three public profile layouts and both desktop and mobile widths before rolling out to everyone.

To roll back: redeploy the v93 Worker/assets without deleting migrations or data. Switch site style to Default in browser settings if needed. This visual style uses only the existing `mt_site_skin` local preference.
