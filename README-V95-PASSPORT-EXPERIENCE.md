# MediaTok v95 — Passport-inspired site experience

**Source:** MediaTok v94 (including v93 shared foundation, Custom Lists, migrations 0016–0017). **Not deployed.**

## In v95

- Browser-local Passport site style remains separate from the user's public profile style. All Original, Anime and Future profile renderer code remains unchanged.
- Independent Hub layout with personal collection counts, high-rated logged media, Next Up, recent community picks, and original fallback recommendations. Data comes from existing `/api/logs?user=` and public feed, not fabricated account values.
- New `/people`-equivalent client view with member search using `/api/search/users`, plus personal-card navigation. It is a browser page rather than a new Worker route.
- Real client-only Taste Comparison overlay using existing public `/api/profile/:name` and owner `/api/logs?user=`. Estimates are suppressed unless both libraries have >=5 eligible works and >=3 exact media-type/title overlaps. Alternate edition matching remains approximate.
- Independent Passport media-detail sheet, with Overview, Community, and Similar tabs. Existing progress status, add/edit, media credits, similar-media, and Save to List functions are still used.
- Per-media share links (`?media=<type>&title=<title>`) and boot-time opening, without adding database state.
- Redesigned Custom Lists and list detail screens as visual stashes, preserving the existing public/unlisted/private API permissions, list reordering, notes, sharing, and deletion.
- Improved Library filter panel, medium pockets, sorting, and accessibility labels.
- Improved cover dealing, mouse-follow tilt, rail dragging, keyboard scrolling, modal entry, and reduced-motion support.
- Distinct desktop and mobile layouts; sidebar and collection rails on desktop, familiar MediaTok mobile navigation on phones.

## Modified/additional files

- `public/passport-v95.js` **new** — media detail sheet, hub personalization, people, real comparisons, stashes, share links, pointer rails.
- `public/passport-v95.css` **new** — independent visual styles and animations, strictly scoped away from profiles.
- `public/site-layouts-v94.js` — add People navigation, personalized hub insertion points, library sort/pocket integration.
- `public/index.html` — load new assets, handle Passport-only routes, use Passport detail modal, support shared media links. No existing public profile renderer changed.
- `public/lists-v93.js` — use visual list renderers only for Passport, retaining the existing secure backend.
- `public/service-worker.js` — new assets in v95 pre-cache.
- `src/worker.js` — **health version only** changed to v95; no API/DB logic changes.
- `tests/v95-passport-experience.mjs` — isolation and parity smoke tests.
- `tests/v94-site-layouts.mjs` and `tests/v89-profile-layouts.mjs` — version assertions updated for v95 without dropping feature checks.

## Not included — important limitations

**This is not an exact or complete clone of Passport Dexx.** MediaTok doesn't have their proprietary backend, music/Apple integration, connected-game platforms, advanced creator catalogs, physics-based multi-user comparison, or proprietary recommendations and slides. Current compatibility uses exact medium/title identities with an explicit confidence threshold. The two other site UI options (AniList and Letterboxd) remain first-pass UI styles from v93, not full reference parity. Fully matching every interaction and platform-specific feature still requires more functionality and reference-level testing.

No third-party logo or proprietary artwork is bundled; this is still MediaTok branding.

## Validation

- Worker/frontend/module syntax checks pass.
- Node tests for v70 import classification, v88 profile resets, v89 profile layouts, v93 list ownership/privacy, v94 skin routing and v95 component structure pass.
- Local desktop Chromium: Hub, personal shelves, member directory and search, Library with pocket counts, detail tabs, Lists route and return to Default passed without browser errors or horizontal overflow.
- Local mobile Chromium at 390px: same navigation/detail checks passed without browser errors or horizontal overflow.
- No production login, deployment, third-party service connections, or live D1 migration verification was performed.
- Browser screenshots use synthetic sample account data and generated placeholder artwork. Live account artwork is determined by your existing MediaTok catalog.

## Deployment

1. **Back up D1 and preserve the current Worker, bindings, and account database.**
2. If upgrading from v92 or earlier, apply the additive v93 migrations `0016_media_identity_events.sql` and `0017_custom_lists.sql` **only if they are not already applied**. Follow v93's migration checklist. No v95 migration is needed.
3. Deploy the entire project (both `src/worker.js` and the `public/` assets).
4. Verify `/api/health` reports `v95`; force refresh to update the service worker.
5. Open Settings → Appearance → Site UI Style → Passport Dexx Style.
6. Verify Hub, Discover/search, People/search/compare, Library filters, media details, edit/save logs, Stashes, forum, notifications, and return to Default.
7. Check all 3 original public profile layouts before rolling out to everyone.

**Rollback:** redeploy v94 project assets and Worker without touching your D1 tables. Your browser-selected site style can also be changed to Default.
