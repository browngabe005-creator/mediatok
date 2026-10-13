# MediaTok v71 — Serializd TV Import

Adds Serializd as a TV-only file import source in Profile Editor → Accounts.

## Supported input
- `shows.csv` from a compatible Serializd export tool
- JSON exports containing a `shows` array
- Flexible title/name fields, ratings, premiere year, network metadata, and season counts

## Import rules
- Every Serializd title is forced to MediaTok `tv` so ambiguous export fields cannot create the wrong medium.
- Serializd 5-star ratings are converted to MediaTok's 10-point scale.
- When watched-season counts equal total seasons, status becomes `Completed`; otherwise show-list entries default to `In progress` unless an explicit user watch/list status exists.
- `diary.csv` is intentionally rejected because it contains episode-level diary records, while MediaTok logs TV at the show level.
- Existing MediaTok TV titles are preserved and duplicate imports are skipped.
- No Serializd password or credential is collected by MediaTok.

Serializd does not currently advertise a native user export on its public site, so this importer is designed for user-owned CSV/JSON export files rather than credential-based scraping.
