# MediaTok v38 — live chat, followers, and release notifications

This version builds on v37 and preserves the current Cloudflare Worker, existing SQLite-backed Durable Object namespace, D1 database, auth, media search, forums, and uploaded profile information. **Do not delete or recreate your D1 database or Durable Object namespace.**

## New forum live-chat features

- Reply to a message with a quoted preview and a jump-to-original action. Replies point to the message ID; if that original message expired or was removed before sending, the chat rejects the reply gracefully.
- Click chat avatars and usernames to visit public profiles. The server uses the current authenticated user's existing profile photo where available.
- Use the emoji picker in the composer, or react with 👍 ❤️ 😂 🔥 😮 😢 👏 💯. Reactions update in real time, are stored with the same temporary chat, and disappear on hourly reset.
- Tag an actual MediaTok member by typing `@username`. The composer suggests members already present in the chat, and the server verifies mentions against the user database. Tagged users who are connected to the chat receive an immediate ping; members with matching existing accounts also receive a persistent in-app mention notification, even if they are offline. No mass @everyone ping.
- Images, chat messages, quoted replies, and reactions continue to reset together at each UTC-hour boundary. Permanent forum threads remain unaffected.

## Profile and notifications

- Visible, clickable follower/following counters on profile headers. They query existing follow relationships and display a list with profile pictures.
- Bell button in the main header with an unread count, as well as the existing notification menu. The unread count refreshes when the tab gets focus and periodically while the page is visible.
- Release notifications now cover planned premieres for **anime and TV**, newly aired episodes (within the last 48 hours where provider data or stored schedule permits), and upcoming sequel episodes for tracked anime. Completed and in-progress titles continue to be eligible; planned titles are explicitly included.
- The existing hourly release watcher checks AniList and TVmaze. Release alerts are deduplicated in the existing D1 notifications table; they require the providers to supply accurate dates. These are **in-app notifications**, not operating-system push notifications. For future film, game, book and other media release alerts, separate reliable release-date providers would be needed.

## Deploy

1. Back up the existing Worker project and confirm the `DB` binding in `wrangler.jsonc` still references your **existing** D1 database.
2. Extract this entire ZIP. In the extracted directory:

   ```powershell
   npm install
   npx wrangler deploy
   ```

3. **Do not reset D1.** If you already deployed v37 with its chat and migrated social/notifications support, this update requires **no new migrations**. The Durable Object's chat tables are upgraded in place using SQLite `ALTER TABLE` when the existing room starts.
4. Confirm https://mediatok.org/api/health returns JSON containing `"version":"v38"`.
5. Confirm Cloudflare Cron Trigger `17 * * * *` is enabled and the existing D1 tables `follows`, `notifications`, and `release_watch_state` exist. If they were never created, review the provided `0009_social_features.sql` and `0010_release_watch.sql` and apply the missing migrations only after taking a backup.
6. Test chat from two signed-in accounts: reply, send `@otherusername`, react, and check that the mentioned account receives a bell alert. Verify the profile follower count changes after a follow/unfollow.
7. Test notifications with a planned anime or TV show whose provider has a confirmed scheduled date. Release alerts are processed by the hourly Cron Trigger, so they may not appear until the next check. No browser push notification is sent.

## Automated checks performed

- Worker and inline-browser JavaScript syntax check.
- Live-room local SQLite tests: message delivery, replies, reactions, mentions, image handling, and hourly expiration.
- Browser tests in headless Chromium at desktop and narrow mobile widths: replies, emoji picker, reactions, @mention suggestions, live messages, image flow.
- Release-watcher simulated AniList/TVmaze schedules: planned premieres, recent episode releases, sequel episodes, and duplicate-event prevention.
- Existing catalog/search regression suite.

These tests do not guarantee that the live Cloudflare environment or external catalogs are currently responding. There is no access to your Cloudflare account, so this ZIP has not been deployed to mediatok.org.
