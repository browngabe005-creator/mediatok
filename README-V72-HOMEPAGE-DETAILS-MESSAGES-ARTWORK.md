# MediaTok v72 polish

This build continues v71 and keeps the existing themes, fonts, database, imports, and social features.

## Changes
- Removed the oversized always-visible **Remove log** controls from profile posters and media-detail actions.
- Existing entries now expose **Remove from my list** inside the same Status dropdown as Completed, In progress, Planning, On hold, and Dropped.
- Homepage recommendations now show up to 36 curated titles across media types, reshuffle on every page load, and do not use Recent Global Activity as a recommendation source.
- Increased title-matched artwork recovery concurrency for missing imported covers.
- Added a lightweight private-message toast that polls unread DM state and animates in without blocking the page.
- Redesigned media details with cleaner spacing/cards and added a Similar media rail.
- Staff/creator/director/author cards render an immediate local placeholder while portrait artwork loads, avoiding blank slow-loading circles.

## Deploy
Deploy this package over the existing Cloudflare Worker/Pages project. Keep the existing D1 database. v72 adds no new database migration.
