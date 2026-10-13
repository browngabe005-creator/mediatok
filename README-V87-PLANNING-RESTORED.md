# MediaTok v87: restore original Planning section

This is a narrow rollback of the profile UI to its pre-v77 (v76) structure.

- Planning returns to its original full-width section **beneath Showcase** on the profile Overview tab.
- The Planning media tab and its existing full-list view remain.
- Remove the later Planning / Watching / Global three-column sidebar layout.
- Restore the original v76 Watching & Reading and Global recent activity rail structure, with no artificial 5-entry cap in Watching.
- Restore the original Showcase card/Planning card profile markup.
- Keep newer non-profile features, including the updated artwork recovery, imports, recommendations, dark-theme overrides, and back-end routes.
- Retain the v79 Discord-like dark theme changes while removing its three-column profile CSS.
- No database migrations or resets required. Deploy the whole Worker project against the existing D1 binding and check `/api/health` reports `v87`.
