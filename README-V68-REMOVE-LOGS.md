# MediaTok v68 — Remove logs anywhere

MediaTok now shows **Remove from my list** for entries already owned by the signed-in member when opened from search, homepage, profiles, and activity. Profile media cards also display a small removal control for their owner. Entry-edit dialogs have the same action. The original feed Remove action remains.

Deletion always asks for confirmation and deletes one media log, including its progress, rating, and notes. Only the account that owns an entry can delete it. Existing D1 schema, auth, search, imports, live chat, themes, and other users remain unchanged. Showcase/panel entries disappear when a log is deleted. Existing **Delete all my logs** remains separately available under Settings.

## Deployment

```sh
npm install
npx wrangler deploy
```

No D1 migration. Verify `/api/health` returns `v68` and hard-refresh the site. If you have never deployed the existing D1 migrations, use your usual migration workflow separately; this update does not add one.
