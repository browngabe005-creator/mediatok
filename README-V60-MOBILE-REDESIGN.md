# MediaTok v60 — separate mobile experience

This release redesigns **only screens up to 760 px**; desktop keeps its existing layout and routes.

## Phone changes

- Five-tab fixed bottom navigation: **Home, Explore, My list, Community, More**. My list opens the authenticated member's profile; if signed out, it prompts sign-in. Community opens the forum. More opens a full-width bottom sheet containing the other existing destinations (including films, books, recent activity, leaderboard, notifications, profile editing, and settings).
- Compact mobile top bar: MediaTok branding, search shortcut, notifications, and member avatar. The desktop search form is hidden only on phones; Explore retains its working search field and the shortcut focuses it.
- A completely separate mobile Home screen with **Continue tracking** from existing In progress logs, horizontally swipeable category chips and poster rails, personal collection counts, and quick links to forum and leaderboard. This reads existing `/api/profile/<name>` and `/api/feed` data. It never creates a new media list or changes account records. If media is unavailable, a clear empty state appears.
- Phone-specific, single-column Explore, profiles, media cards, settings, forum, and modals with touch-sized controls. Sections formerly spread across desktop sidebars are accessed using More.
- Dark, light, and pink themes all inherit the current theme variables. Honors system reduced-motion preference.
- Continue and community posters still open the existing MediaTok details dialog. All existing imports, user profiles, saved progress and searches are reused.

## What stays intact

Desktop homepage, desktop top/sidebar navigation, Discord login, D1 database, live chat, user profiles, art lookup, webnovel directory, search providers, leaderboard scoring, and imports are not rewritten. There is **no database migration**.

## Deployment

Deploy the whole project from the extracted folder (including `public/mobile-v60.css`), not only `public/index.html`.

```bash
npm install
npx wrangler deploy
```

The Worker health endpoint reports `v60`. The service-worker cache changes to `mediatok-v60-mobile-native-layout` and precaches the new stylesheet to help old PWA sessions update.

## Validation

- Browser-tested at widths 375, 390, 428, 760, and desktop 1440 px (Chromium): phone layout and navigation, no horizontal page overflow, real Explore field, mobile profile, More navigation sheet, poster click-through, themes, desktop preserved.
- Backend regressions passing: offline search, large webnovel pagination, episode/chapter progress, global profile-picture fallback, library imports and scheduled release notifications.
- Production Cloudflare deployment, real-device Safari/Android behavior, and external image availability **have not been verified**.

## Follow-up recommendation

Test deployed mobile site on iPhone Safari and Android Chrome. A packaged Capacitor native app needs its own authentication/session integration and is **not** created by this web redesign.
