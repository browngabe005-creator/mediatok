# MediaTok v65 — restore header + original Alice particle motion

## Changes
- Restores the **left-anchored** profile avatar, name, role and banner actions from v63 rather than centering them. The banner stays at 178px on desktop.
- Keeps showcase/planning and medium buttons in the **middle column**, with watching, Global Activity and optional Music in a separate right column. Your Space remains in its own left navigation rail.
- Replaces the simplified particles with a faithful adaptation of the **Alice (1).html** rising glowing particles (upward drift, horizontal sine movement, pointer repulsion with velocity damping). Adds original-style click ripple and eight sparks. Particle/glow color uses the profile's color picker.
- Effects are **opt-in**, behind content, use reduced particle count on mobile, pause for hidden tabs and respect reduced-motion settings. No custom cursor, intro animation, or audio.
- All existing account, session, search, feed, mobile, music and database code is otherwise unchanged. No migration required.

## Deploy
`npm install` then `npx wrangler deploy`, using the full project. Check `/api/health` for `v65`, and hard-refresh.

## Notes
No live production deployment or verification has been performed. Test Effects under Customize Profile > Appearance after enabling particles and choosing a color.
