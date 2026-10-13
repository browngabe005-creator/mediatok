# MediaTok v64 — centered profiles, opt-in music & customizable backgrounds

This is a complete Cloudflare Worker project based on v63 music repair. Keep the existing Cloudflare Worker, D1 database, Durable Object, and secrets. **No migration required.**

## Changes

- **Desktop alignment:** At desktop widths the Your Space rail starts and ends in line with the Currently Watching and Global Activity cards, and the two cards remain next to each other on the right. The center profile banner now centers the avatar, name, handle, role and followers; edit/share remain unobtrusive at the top right. The mobile-specific v60 view remains unchanged.
- **Music is private by default:** Existing Last.fm settings and favorite selections are retained, but no public Music panel is rendered unless the owner explicitly enables **Show Music on my public profile** in **Customize profile → Appearance → Profile atmosphere**. Turning it off hides only the panel; it does not delete music selections. The Accounts tab still contains the Last.fm setup button.
- **Optional profile background:** Upload a JPG/PNG/WebP/AVIF/GIF or paste an HTTPS image URL. The background is displayed under the profile content with deliberately reduced opacity so text remains readable. Choose **Use a custom profile background** to enable it; **Remove** clears it.
- **Optional particles and glow:** Owner can toggle a subtle animated particle field and choose an exact hex color using a color picker. Alice.html was used *only as a visual reference*. No entrance gate, background audio, custom mouse pointer or external tracking is introduced. The particle animation honors `prefers-reduced-motion`, pauses in background tabs, and is disabled on narrow/mobile layouts to avoid battery drain.
- **Persistence:** All options live inside the existing `users.socials` JSON object. The worker validates HTTPS / compressed-upload background URLs and hex colors. It preserves existing social links and Last.fm settings.

## Installation

1. Save a database backup, especially before deploying to a live community:
   `npx wrangler d1 export mediatok --remote --output mediatok-backup.sql`
2. From the unzipped v64 project: `npm install` then `npx wrangler deploy`.
3. Hard refresh the site or reopen an installed PWA. Verify `https://mediatok.org/api/health` says `v64`.
4. Visit your profile and choose **Customize profile → Appearance**. Expand the Profile atmosphere section. Turn on only the options desired, then **Save profile**.

## Notes / caveats

- Profile image uploads are converted locally to compressed image data because MediaTok currently stores profile image fields in D1. External HTTPS image URLs can be used instead and are preferable for large photo backgrounds. Animated images may lose animation when optimized.
- Other members' choices are public whenever they opt into the background or particles; Music is completely hidden until enabled.
- These changes are locally browser-tested; live Cloudflare delivery and Last.fm credentials have not been inspected, so a successful live deployment cannot be guaranteed by the local tests.

## Tests

`python tests/v64-profile-browser.py`

`node tests/v64-profile-settings-route.mjs`

`python tests/browser-v60-mobile.py`

Existing v44 offline search, v49 webnovel library, v54 import server, v58 progress, v62/v63 Last.fm, and v53 credits tests also pass. Some old test scripts predate the Accounts import relocation or Worker module format and are not appropriate regression assertions for the current source.
