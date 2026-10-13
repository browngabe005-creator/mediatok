# MediaTok v70 — Auto Sync, DMs, Light Novels, and Artwork Fallbacks

## What changed

### Linked-list auto updates
MediaTok can now pull changes from linked AniList, MyAnimeList, VNDB, and Letterboxd accounts into MediaTok. Auto sync is enabled per linked service and runs opportunistically while a signed-in member uses the site plus in the existing hourly Worker scheduled task. Provider pulls are throttled so the site does not hammer third-party APIs.

This is one-way synchronization **into MediaTok**. It does not edit a member's AniList, MAL, VNDB, or Letterboxd account.

- AniList: anime, manga, and AniList `NOVEL` entries.
- MyAnimeList: anime, manga, and entries classified by MAL/Jikan as Light Novel/Novel.
- VNDB: public visual-novel user lists.
- Letterboxd: recent public diary activity via its public RSS feed.
- Goodreads and Passport Dex remain file imports because MediaTok does not have a verified live-account API for them.

### Light Novels are separate from Manga and Visual Novels
AniList reports light novels as manga-type media with the `NOVEL` format. v70 preserves that format during import and stores those entries as `light-novel` instead of `manga`.

When a linked AniList account is synced, older MediaTok entries imported from AniList are reclassified when their AniList media ID identifies them as a Novel. Visual novels remain `visual-novel` and are never merged into Light Novels.

A paginated Light Novel directory now queries the AniList `NOVEL` catalog and has a local fallback that includes Oregairu.

### VNDB imports
Customize Profile → Accounts now includes VNDB with the same integration-card design as the other services. A public VNDB username can be linked and synced. Public list entries are saved as Visual Novels.

### Profile sorting
Inside a profile media tab, the top-right Sort control supports:
- Recent
- Ranking

### Private messages
Profiles now have a Message button. It opens Forum → Private messages. Threads are visible only to their two participants. New messages also create MediaTok notifications.

This feature needs migration `0014_private_messages.sql`.

### Artwork/icon recovery
Missing cover images no longer leave blank cards. MediaTok keeps the existing artwork recovery system and, when every cover source fails, renders the correct media-type icon as a fallback across search/results and directory cards.

### Remove logs everywhere
The v68/v69 owner-only log-removal system is preserved. Members can remove their own entries from media details, edit-entry dialogs, and their profile posters. Deleting one log does not affect another member's list.

## Deploy

Make a database backup first:

```powershell
npx wrangler d1 export mediatok --remote --output mediatok-v70-backup.sql
```

Apply the additive DM migration:

```powershell
npx wrangler d1 migrations apply mediatok --remote
```

Then deploy the complete Worker project:

```powershell
npm install
npx wrangler deploy
```

No existing tables are dropped or reset. Accounts, media logs, profiles, Showcase, forums, and existing settings remain in the same D1 database.

After deployment, `/api/health` should report `v70`.

## Notes

- External providers can still rate-limit or become temporarily unavailable. Local/cache fallbacks remain enabled.
- The Light Novel directory is paginated instead of trying to ship an entire third-party catalog to the browser in one request.
- Auto sync is deliberately throttled. It is intended to keep MediaTok current without creating unnecessary D1 or provider traffic.
