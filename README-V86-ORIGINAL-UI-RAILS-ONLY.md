# MediaTok v86 — original profile preserved, sidebar geometry only

The visual profile design (banner, media tabs, Showcase artwork, fonts, colors, controls) is unchanged from v85. Only sidebar grid geometry and reliable five-item preview visibility are corrected.

- At desktop widths 1460px+: unchanged left navigation, dominant central profile, and three evenly spaced narrower sidebars at the far right.
- Watching & Reading, Planning, and Global display five items each. The existing View all buttons open their existing separate modal windows.
- The center profile is not forced into a narrow width, and the sidebar cards cannot overwrite the main content.
- At smaller screen widths, the three-card row flows below the main profile instead of becoming unusably small; phones display them one per row.
- The left navigation scrolls with the page.
- Removed the stale v82/v85 profile sizing experiments and placed the one profile-only override after *all* legacy CSS, resolving prior cascade conflicts.
- The visibility calculation no longer reduces the requested five Watching items based on panel height.

No database migration required. Do not recreate D1. Deploy the whole project and verify `/api/health` is v86.
