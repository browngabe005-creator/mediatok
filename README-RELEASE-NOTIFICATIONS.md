# MediaTok episode and season notifications

The Worker checks tracked anime with AniList and tracked TV shows with TVmaze on the configured Cloudflare Cron Trigger (hourly at minute 17). It creates in-app notifications for episodes airing in the next 24 hours and for detected upcoming season premieres. Notification state is stored in D1 to avoid repeated alerts.

## Deploy
1. Apply `0010_release_watch.sql` to the same D1 database configured in `wrangler.jsonc`: `npx wrangler d1 execute mediatok --remote --file=0010_release_watch.sql`.
2. Deploy the updated Worker and frontend as usual: `npx wrangler deploy`.
3. In Cloudflare Dashboard → Workers & Pages → mediatok → Settings → Triggers, confirm the Cron Trigger `17 * * * *` is present.
4. Confirm the Worker has the `DB` D1 binding and review Logs after a scheduled run.

The provider APIs are public; no extra API keys are needed. Anime episode/season data comes from AniList; TV episode and season data comes from TVmaze. Release dates and provider coverage can be incomplete, so notifications depend on those providers publishing reliable dates. The watcher checks at most 80 tracked title entries per hourly run to avoid API bursts; entries are checked again on later runs.
