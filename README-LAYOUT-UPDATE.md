# MediaTok layout update

This archive builds on the supplied MediaTok v95 ZIP. Site layout and public profile layout can be selected independently inside Profile settings. The Letterboxd site layout choice was removed; existing local Letterboxd layout selections fall back to MediaTok Default. The AniList site layout choice and existing AniList profile renderer remain available. The third-party-inspired site choice is labeled Collection Style, while its existing implementation identifiers remain stable for saved browser preferences.

The PassportDex reference's signed-in Hub and Discover pages require an account, so this archive does not claim exact visual or animation parity with those pages. No production deployment or database change was made. Existing Letterboxd import/link features remain available because the requested removal concerned UI layout options.

Validation: `npm ci`, the v89/v94/v95 layout checks, inline JavaScript syntax, and a local Chromium interaction check of independent site/profile choices, draft preservation, and removed-layout fallback passed.
