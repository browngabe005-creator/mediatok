# v88 — Per-medium / per-status profile reset

At the bottom of each individual media tab (Anime, Manga, TV, Movies, Books, etc.), profile owners can reset the entries currently selected by the status filter. Examples: Anime > Planning resets only planned Anime; Manga > Completed resets only completed Manga; Anime > All resets Anime across all statuses. The separate Planning tab has a Reset Planning control at the bottom to reset planning entries only (across media types). The profile Overview design stays the same.

The reset preview displays the exact count and requires typing RESET before the button is enabled. The server validates the session, allowed medium/status, and expected count, then deletes only rows owned by the signed-in account and matching that scope. Other users and other sections are unaffected. Linked-account auto-sync may re-import deleted items later; disable source syncing first if you do not want those entries to reappear.

No D1 migration. Deploy the complete Worker project. /api/health returns v88.
