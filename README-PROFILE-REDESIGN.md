# Profile redesign

- New profile page: identity card on the left, tabbed content on the right, every section side by side (swipeable rows on phones).
- New "Customize profile" editor with live preview, accent colors, banner presets, picture shape and a pinned Showcase of up to 5 titles.
- All emojis replaced with inline SVG icons.
- No database migration needed: it uses the existing `shape`, `banner` and `favs` columns. Just run `npx wrangler deploy`.
