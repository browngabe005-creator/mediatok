# MediaTok v69 — Visible log removal and profile alignment

## What changed
- Your media posters now have an always-visible, labeled Remove log button. It works on Showcase, Planning and each medium's collection tab.
- Media details and the entry editor reuse your already-loaded profile entries, so a progress lookup failure no longer hides removal for those entries.
- Search and other media detail views can fall back to your profile's saved entries. If both requests fail, a visible retry control replaces the silent failure.
- Removing a log asks for confirmation. The server only permits the entry's owner to delete it. Ratings, notes and progress for that entry are removed with the log.
- Successful deletion refreshes profile lists, account counts and activity. Failed/unconfirmed responses leave the entry visible.
- Edit profile and Share profile now share the rank/follower flex row with matching control heights. On narrow screens they wrap within that row. The banner can grow to fit wrapped content.

## Install this update
Extract this archive and deploy the complete project, including both public/ and src/, to the existing MediaTok Worker. Updating only the Worker JavaScript does not update the visible page; updating only public/ does not update server routes.

Use the existing project's deployment workflow, or run `npm install` followed by `npx wrangler deploy` from the extracted project folder. Preserve your existing Cloudflare variables, secrets, D1 binding and database.

This update does not add a database migration or reset the database.

After deployment, hard-refresh the site (Ctrl+Shift+R). The page source contains `<meta name="mediatok-build" content="v69">`, and `/api/health` reports `version: "v69"`. If either still shows an older version, that part of the deployment has not updated.

## Checks
Passed JavaScript syntax checks, backend authentication/ownership deletion tests, and local removal tests covering all ten media types, failed lookups, cancellation, failed deletion and count refresh. Generated profile markup confirms badges and actions share one row. A browser binary was unavailable in this environment, so visual layout and live Cloudflare behavior have not been tested here.
