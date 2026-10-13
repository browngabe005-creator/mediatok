# MediaTok media details and cast credits

This update improves the click-through details modal for supported media types:
- Books, manga, comics, and light novels show available author metadata.
- Films and TV show director/creator/crew and cast portraits when TMDB credits are configured.
- Films found through iTunes and Wikipedia may resolve credits through TMDB by exact title (and year for films); ambiguous matches are not guessed.
- Anime shows available staff, characters, and Japanese voice actors from AniList/Jikan where the result key supports those catalogs.
- Portraits use lazy loading and a placeholder if a provider image fails.

## Deploy

From this project directory run:

```bash
npx wrangler deploy
```

Set the Cloudflare Worker secret `TMDB_API_KEY` for film and TV cast credits. If it is not set, those credits are unavailable; the rest of the detail view still works. Third-party catalogs may not provide credits for every title.

The frontend was checked with `node --check` after extracting its inline scripts, and the Worker was checked with `node --check`. These are syntax checks, not a live-provider or production deployment test.
