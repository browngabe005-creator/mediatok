# MediaTok v46 — unified artwork on homepage and global feeds

This is a narrowly scoped frontend artwork update based on v45. **The search endpoints, ranking, offline index and caching algorithm are unchanged.**

## What was repaired

- Homepage recommendation covers no longer stop loading just because the global header still remembers an earlier search query.
- A 30-day verified image-URL cache is shared between result cards, homepage recommendations and global activity. Images are only recorded after a browser confirms they loaded. Storage failures never prevent rendering.
- Media-category homepage posters now try multiple candidates until they find usable images, instead of leaving entire sections empty when the first two fail.
- Missing global activity art is recovered on the homepage sidebar and on the Global Recents page, across every medium (not just films). Existing broken feed image links can request a fresh alternate from the provider instead of being replaced with permanent icons.
- Header/Discover result images, where loaded successfully, populate the same shared cache for use on the other pages.
- Service-worker cache version updated so navigation pulls the revised frontend.

## Checks run

- Browser test `python tests/browser-shared-artwork-v46.py` verifies loaded search artwork, homepage after search with remembered query, homepage sidebar recovery, broken old game cover recovery, medium preview art, and Global Recents image recovery, using mocked external image and provider responses.
- Existing offline catalog, eight-provider artwork, live-room and notification regression tests passed.
- Inline JavaScript checked for parse errors.

Local browser tests **do not guarantee** every real-world provider has artwork for every title or that all images load on the deployed site. Source sites may be rate-limited or lack images.

## Deploy the complete project

1. Back up the current site project and confirm you are using the existing Worker and D1 binding.
2. In this extracted folder run:

```powershell
npm install
npx wrangler deploy
```

3. Open `https://mediatok.org/api/health`. The Worker should report `"version":"v46"`.
4. Hard-refresh the site (Ctrl + Shift + R) or use a new private window. Test Search → Home → Global Recents with the same title; also scroll down to the Explore by Medium tiles.

No new migrations or database resets. The existing auth, profiles, live chat, notifications, and search are retained.
