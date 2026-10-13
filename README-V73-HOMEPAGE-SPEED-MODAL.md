# MediaTok v73

This build focuses on homepage symmetry, reliable media artwork, smoother details, and modal behavior.

- Removed the duplicate four-card Anime/Manga/Films/TV count strip from desktop home.
- Recommendations now occupy that space and still reshuffle each page load.
- Your Space sidebar now scrolls with the document instead of remaining sticky.
- Increased recommendation artwork hydration concurrency and prioritizes visible poster loading.
- Leaderboard/profile avatar images load eagerly with existing fallback handling.
- View Details Close/X now use a real global closeModal handler, stop click propagation, support Escape, and clear modal state immediately.
- Creator/cast portraits use the valid user icon placeholder and eager image loading.
- Reduced frontend credits wait timeout so details remain responsive when a provider is slow.
- No D1 migration is required.
