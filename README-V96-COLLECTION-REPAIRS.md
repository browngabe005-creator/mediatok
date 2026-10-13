# MediaTok v96 — Collection UI repairs

Based on v95. No database migration is required for these changes. Upload/deploy the full project: the Worker change is required to remove the 100-entry library limit. Preserve your existing Cloudflare bindings and database. See README-DEPLOY.md for the existing deployment process.

- Complete per-user library responses, with deterministic ordering; the general recent-logs response remains limited to 40 entries.
- Accurate Hub planning count, independent of its six-card preview; failed loads show a retry instead of misleading counts.
- Circle sidebar uses the signed-in user's following list, with sign-in, empty, and retry states.
- Independent layout and import controls in the Collection header and public profile, including mobile.
- CSV imports refresh the displayed library/profile after completion.
- Collection profile includes anime, games, and visual novels in addition to movies/TV and books.
- Fixed desktop navigation rail: 68px width, 52px rows, 24px icons, and 200ms opacity hover transition based on the public reference. Additional navigation is in More.
- Native hover title popups removed from Collection content, while accessible labels are preserved.
- Animated card-stack startup/library loader, with reduced-motion support.
- Updated service-worker cache and health version to v96.

Validation: SQLite test with a 137-title library; existing layout regression checks; inline/module syntax checks; local Chromium flows with fixture APIs for all counts, filtering, follows, CSV preview/import, refreshed counts, saved public profile layouts, independent site preferences, desktop rail dimensions, and mobile overflow. Tests use fixtures, not a production account. No deployment was performed.

Exact visual/interaction parity with all signed-in PassportDex pages is not verified: Hub and Discover redirect to sign-in. The public rail dimensions and hover-opacity behavior were inspected. Screenshots or screen recordings of the intended signed-in pages are needed for the remaining visual comparison.

Run checks:

    node tests/v96-library.mjs
    node --test tests/v89-profile-layouts.mjs tests/v94-site-layouts.mjs tests/v95-passport-experience.mjs

For browser checks, serve public/ on port 8765, then run `python tests/v96-collection-browser.py` with Playwright and Chromium installed.
