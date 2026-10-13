# MediaTok v91 — Profile theme logo cleanup

This update only removes third-party brand logos from the two alternate profile themes:
- **Anime Theme**: removes the stylized AniList-style **A** in the theme header.
- **Future Theme**: removes the Passport Dexx-style star logo in the left icon rail.

The empty noninteractive spacers preserve the reference layouts’ existing alignment. All existing Home buttons and navigation routes remain available. **Original Theme has not been changed**, and imported libraries, profile settings, profile data, database schema, and functionality remain unchanged.

To deploy: upload the complete project over the existing Cloudflare Worker and keep the existing D1 binding/database. No migrations required. Confirm `/api/health` says `v91` and hard-refresh to clear the old service-worker cache.
