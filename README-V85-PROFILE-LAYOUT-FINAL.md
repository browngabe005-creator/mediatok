# MediaTok v85 — profile layout correction

This build fixes the CSS cascade bug that caused v84 to appear unchanged. The older v81 profile rules loaded after v84 and overrode its grid. v85 removes that conflicting block and places one final profile layout override at the end of the document.

Desktop profile: original dominant center column, three slightly smaller right-side panels (Watching & Reading, Planning, Global), exactly five preview rows each, with existing View all modals preserved. No D1 migration is required.
