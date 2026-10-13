# MediaTok v37 — Forum live chat

This is the full v36 search/artwork website with **live chat integrated above the existing forum threads**. The site remains a Cloudflare Worker with its existing D1 database, authentication, profile, social features, and search.

## How the chat works

- **Actual WebSockets** through a new Cloudflare **SQLite-backed Durable Object** (`ForumLiveRoom`) with WebSocket hibernation. New messages are broadcast to everyone in the room, without a polling loop. No external chat service or API keys are needed.
- A single **#general** chat in the Forum. Logged-out visitors can read the live room; only signed-in MediaTok users can post. Profile names, avatars (when suitably small), staff badges and an online count are shown.
- **Every UTC hour, on the hour (HH:00)**, the room clears all messages and uploaded images. The header shows a countdown. A Durable Object alarm performs automatic cleanup; new requests also check for and enforce the hour boundary if an alarm is delayed. Old images cannot be retrieved after the reset. Chat storage is completely separate from D1 forum tables; permanent forum posts/replies are NOT deleted.
- **Image attachments:** JPG, PNG, WebP and GIF. Max **700 KB** per file; large non-GIF images are resized/compressed as WebP in the browser. GIFs must already fit. Images are stored directly in this room's temporary SQLite-backed Durable Object storage. No Cloudflare R2 bucket or extra storage service setup is necessary.
- Press **Enter** to send, **Shift+Enter** for a new line. Preview/remove your image, click pictures to expand, see reconnect state, and delete your own posts; moderators/admins/owners can delete any post.
- Safety/limits: authenticated sender identities verified by the Worker before it forwards to the internal Durable Object, text length <=1000 characters, 900 ms per-user message throttle while the room is active, 3.5 seconds between image uploads, 180 retained messages maximum, and 80 images per hour globally. HTML is escaped before displaying it. SVG files and external image URLs are not accepted as attachments.
- WebSockets use hibernation where possible, reducing idle runtime charges. This feature may incur Cloudflare Durable Objects storage/request charges depending on traffic and plan.

## Deployment (important)

**Use the entire v37 folder, NOT a public-assets-only upload.** From a terminal opened inside the extracted v37 folder:

```powershell
npm install
npx wrangler deploy
```

`wrangler.jsonc` contains a NEW binding `FORUM_LIVE` and the migration entry:

```jsonc
"durable_objects": {
  "bindings": [{ "name": "FORUM_LIVE", "class_name": "ForumLiveRoom" }]
},
"migrations": [{ "tag": "v37_forum_live_room_sqlite", "new_sqlite_classes": ["ForumLiveRoom"] }]
```

Cloudflare applies this **Durable Object class migration during Wrangler deploy**. This is **not a D1 migration**. Do NOT run D1 migrations, re-create your Worker, delete the D1 binding, or reset any tables. Preserve existing environment variables and secrets.

**Cloudflare dashboard ZIP/upload-only deployments may not automatically register a new Durable Object class and binding. For this feature, use Wrangler (`npx wrangler deploy`) with the included configuration.** Do not manually upload only `public/index.html`.

## Verify after deployment

1. Open `https://mediatok.org/api/health` — it should return `"version":"v37"`.
2. Visit MediaTok **Forum**: the **Live chat / #general** panel should appear above your discussion threads. The status should say `Connected` and show people online (you count as one connection).
3. Sign into the site in two browsers or devices. Type in one, press Enter; the message should appear in both without manual refresh.
4. Send a valid JPG/PNG/WebP/GIF from one signed-in account; verify the preview and inline image appear in the other account. Click to open.
5. At the top of the next UTC hour (for example, 17:00 UTC), confirm the chat and images disappear while **forum threads remain unchanged**.
6. Recheck searches for Naruto, One Piece, Reverend Insanity, and Elden Ring to ensure the existing v36 search functionality remains intact.

If the chat does not connect, check the **browser DevTools > Network > WS** request to `/api/forum/live/ws` and Cloudflare Worker logs, and confirm the `FORUM_LIVE` binding exists in the deployed Worker. Ordinary HTTP requests to that WS path return 426 by design.

## What was tested before packaging

- Syntax checked for Worker, live-chat class, and embedded browser JavaScript.
- In-memory SQLite test verified message posting, per-user throttling, image upload and retrieval, anonymous upload rejection, and full hourly cleanup.
- Browser DOM interaction tests (simulated socket/network) exercised receiving messages, sending text, image-upload flow, and countdown at 1200px desktop and 390px mobile.
- Existing offline catalog search smoke/latency/cover tests passed, using mocked upstream APIs.

**Live Cloudflare Durable Object deployment, real cross-device sockets, and real-world traffic were not verified here.**
