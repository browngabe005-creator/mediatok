# MediaTok v67 — profile button alignment

This is a minimal patch to v66. On desktop (width >= 1021px), Edit Profile and Share stay right-aligned in the banner but now align vertically with the role/follower badge row, rather than the midpoint of the entire name stack. No changes to the lower profile layout, avatar, particles, other screens, APIs, or database.

## Deploy

```sh
npm install
npx wrangler deploy
```

The Worker `/api/health` returns `v67`. Refresh the browser (Ctrl+Shift+R). No D1 migration is needed.
