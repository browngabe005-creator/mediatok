# MediaTok deployment and Discord login repair

## What was fixed

The site uses `not_found_handling: "single-page-application"`. Without `run_worker_first`, Cloudflare can serve `public/index.html` for missing `/auth/discord` and `/api/*` paths before the Worker gets a chance to handle them. That makes the Discord login look like it merely reloads the page. The asset config now routes `/auth/*` and `/api/*` through the Worker first.

A lightweight `/api/health` endpoint was also added so the Worker route can be checked without reading or changing database contents.

## Deploy

1. Extract this ZIP. Open a terminal in the extracted `mediatok-v2` folder.
2. Deploy the Worker and assets:

   ```powershell
   npx wrangler deploy
   ```

3. In Cloudflare Workers & Pages → `mediatok` → Settings → Variables and Secrets, verify the secrets `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` exist. Add them there if missing; never put the client secret in this project or send it in chat.
4. In Discord Developer Portal → OAuth2, make sure the redirect URI is exactly:

   `https://mediatok.org/auth/discord/callback`

5. After deployment, open `https://mediatok.org/api/health`. A working Worker route should return JSON containing `"ok":true` and `"service":"mediatok-worker"`. Then test `https://mediatok.org/auth/discord`; it should redirect to `discord.com/oauth2/authorize`.

## Database safety

This repair does not reset, delete, or recreate the D1 database. Do not run `wrangler d1 delete`, do not reset the database, and do not apply migrations blindly to an already-migrated database.


## Latest catalog changes
- Game search now only accepts catalog results categorized as Games and excludes common social/media apps.
- The old 18+/mature-mode setting has been removed from the UI and client state. Media search no longer exposes a mature-content toggle.
- Existing D1 database and migrations are unchanged.

## Mobile / installable app

The site now includes responsive mobile layout adjustments and PWA files (`public/manifest.webmanifest`, `public/service-worker.js`, and `public/icons/`). Deploy the complete project with `npx wrangler deploy` over HTTPS. On supported Android/desktop browsers, use the browser Install app prompt; on iPhone/iPad, use Share → Add to Home Screen. This makes an installable web app; publishing a separate native app-store binary is a later step.
