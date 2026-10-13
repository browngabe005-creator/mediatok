# MediaTok v89 — profile layout selector

## New setting

Open **Settings → Profile → Choose layout**, or **Customize profile → Layout**. Choose one of:

- **Original Theme** — retains the v88 restored MediaTok profile structure, including Planning below Showcase, original sidebar placement, and the existing media/status functionality.
- **Anime Theme** — AniList-inspired public profile: anime and manga list views, status filters, favorites, score breakdowns, statistical counters, recent personal activity, followers, and other media lists.
- **Future Theme** — Passport Dexx-inspired visual passport: "my stars", "next up", currently watching/reading, collection shortcuts, activity and stats, and a shared-media comparison when signed in.

Your choice is saved in the existing `users.socials` JSON as `profileLayout`, public through the existing profile endpoint. Old users default to `original`. Everyone visiting a user profile sees that account's chosen layout. No new database tables or migrations.

## Important distinctions

These are original MediaTok implementations inspired by AniList and Passport Dexx layout patterns. They are not embeds or copies of those websites. MediaTok's own media-detail modals, lists, ratings, follows, DMs, and data remain the source of truth. Features dependent on third-party accounts or proprietary service backends are not automatically available.

## Deployment

1. Keep your existing Worker/D1 configuration and do not recreate or erase the database.
2. Deploy the **entire project** with the existing Cloudflare setup, including `public/index.html`, `public/service-worker.js`, and `src/worker.js`.
3. Confirm `/api/health` reports `v89`.
4. Refresh after the service worker updates, and test all three layout choices through Profile Settings.

## Checks performed

- Syntax validation: Worker JS, frontend inline JS, service worker.
- Browser smoke test in Chromium: all three profile layouts render without page errors.
- Browser interactions: profile layout tab, layout preview, Anime list/status filtering, owner-only reset control, Future collection list, and Save Profile request containing the correct layout field.
- Existing v88 grouped-reset regression checks.

The actual live `mediatok.org` deployment and third-party visual pixel parity have **not** been verified in this environment.
