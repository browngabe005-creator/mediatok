# MediaTok v92 — Future Theme refinements

* The left rail now holds consistently spaced actions with the profile link at the bottom.
* The Music category was removed from the Future Theme only. Music features elsewhere remain unchanged.
* Passport-like hover/entrance motion, with reduced-motion support, is enabled in the Future Theme only.
* The owner can tap the pencil on **each individual media cover** to use an HTTPS image link or upload a compressed image. This is only a visual override; your media tracking data is unchanged. Any poster can be restored to its default image.
* The owner can click the gear in the left sidebar to customize the Add, Home, Library, Followers, Notifications, and Profile icons.
* Each customization is stored privately per account, but the chosen icons and artwork display publicly on that account's Future profile.
* **Migration required:** `npx wrangler d1 migrations apply mediatok --remote` (after backing up your existing database). Migration `0015_profile_visual_overrides.sql` adds a table and does not clear media or profiles. The username/password database is not recreated.
* Deploy the entire Worker and `public/` assets together; `/api/health` should report `v92`.
* The animation design is inspired by the reference and not an extraction of Passport Dexx proprietary code.
