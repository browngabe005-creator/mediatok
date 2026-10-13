# MediaTok v90 — Reference-accurate profile layouts

## What changed

The **Layout** setting in Customize Profile retains three account-specific choices:

- **Original Theme:** The existing MediaTok profile renderer is unchanged.
- **Anime Theme:** Rebuilt to follow the supplied AniList screenshots: full-width slate navigation/header, full-width user banner with overlapping square avatar, horizontal Overview / Anime List / Manga List / Favorites / Stats / Social / Reviews / Submissions tabs; light neutral background; left activity history/heatmap, genres, anime and manga poster sections; right statistics, progress meters, and actual MediaTok media activity. Lists and status filters remain functional.
- **Future Theme:** Rebuilt to follow the supplied Passport Dexx screenshot: dark backdrop and small left icon rail, centered rounded taupe passport card, identity/status and share/editor controls, asymmetrical My Stars cover grid, Next Up row, right-hand Movies & TV, Music, and Books groups, and separate Your Circle. Poster clicks open MediaTok details; category labels open media lists.

A saved layout appears to other visitors to the profile. Profile pictures, banners, posters, ratings and media lists come from real MediaTok account data. The screenshot-based desktop composition is matched at the layout level; **external sites' proprietary backends and their complete interactive features are not copied**. Missing metadata is not fabricated: genre counts appear only if genres exist in logged data, and displayed Watch Days are explicitly estimated from progress (24 minutes per episode). Activity heatmap uses the last updated date of MediaTok entries; it is not a complete historical AniList activity ledger.

Your Circle displays the profile's actual followers via `/api/profile/<name>/followers`. It progressively computes shared-title percentages from public media libraries (Jaccard similarity). Missing/unavailable comparisons never get invented ratings.

## Verification

- Frontend JavaScript and Worker syntax validated with `node --check`.
- Chromium static browser checks using illustrative test data: desktop screenshots at 1809 × 864; Anime → Manga List; Future → Movies & TV list; alternate-layout rendering without page JavaScript errors.
- Mobile checks at 390 × 844: no horizontal document overflow for Anime, Future or Original.
- **No live deployment or production API round-trip was performed.** Real production image hosts, follower connections, and per-account save behavior must still be verified on your Cloudflare deployment.

## Deployment

1. Back up the existing Cloudflare Worker and D1 database.
2. Deploy the complete project to the **same existing Worker** with the same D1 binding. Do not delete or recreate the database.
3. No D1 schema migration is required for this change (the chosen profile layout is stored in `socials.profileLayout`, as introduced in v89).
4. Confirm `/api/health` reports `v90`, then hard-refresh once so the `mediatok-v90-reference-layouts` service worker cache takes effect.
5. Visit **Customize Profile → Layout** to switch between Original, Anime, and Future and test each layout with your own account.
