# MediaTok social features — deployment notes

This package combines the username + rotating niche recommendations build with follower/following support, notifications, and Global Recents / Following Recents.

## Important: apply the additive database migration first

The feature uses two new tables and does not delete or reset existing data. From this folder, run:

```powershell
npx wrangler d1 execute mediatok --remote --file migrations/0009_social_features.sql
npx wrangler deploy
```

If the migration command reports an error, stop and inspect the output rather than deleting/recreating the database. The migration is additive and uses `IF NOT EXISTS` for tables/indexes.

## Included

- Email signup asks for a public username; the email address is not used as the visible username.
- Rotating niche recommendations across supported media types.
- Follow/unfollow from member profiles and follower/following counts.
- Notifications for new followers, with a notification page.
- Global Recents and Following Recents switch in the community feed.
- Newly registered email accounts automatically follow the account whose role is `owner`, when one is present. They can unfollow it from that profile.
- Existing users and media logs are retained.

Notes: Following Recents requires a signed-in account. Owner auto-follow only applies at signup; existing accounts are not silently changed.
