# MediaTok multi-provider catalog search — v32

This package is based on MediaTok-search-logo-repair-v31. No D1 migrations or database resets are involved.

## What changed
- All discovery searches use `/api/search/catalog` for **every medium**. The old AniList-only browser search path could throw before alternatives were attempted.
- The Worker searches independent sources concurrently, deduplicates results, and isolates failing providers. Anime/manga use AniList, Jikan (MyAnimeList), Kitsu; light novels and web novels also search book indexes; visual novels use VNDB and Wikipedia; films use iTunes plus optional TMDB; TV uses TVmaze plus optional TMDB; books/comics use Open Library and Google Books; games use Steam and Wikipedia.
- Browser fallback runs when the Worker returns no results or errors, including for anime/manga. Better timeout, clear error text, and 10-minute local success cache.
- Successful Worker search responses stay cached at the edge for up to 48 hours, with a 10-minute fresh window. During temporary upstream outages, recent cached hits remain usable.
- No API key is necessary for the free fallback sources; TMDB still requires optional existing `TMDB_API_KEY` secret for broader film/TV coverage. An API provider cannot guarantee every title will be indexed.

## Deployment
Use `npx wrangler deploy` in this folder, or deploy using the same complete Worker+public-assets workflow as your previous release. **Do not** create a new Cloudflare project, remove the `DB` D1 binding, or apply migrations. Preserve your existing Worker variables and secrets.

After deployment check:
1. `https://mediatok.org/api/health` should give JSON, not HTML.
2. `https://mediatok.org/api/search/catalog?type=anime&q=naruto` should give `results` as a JSON array.
3. Test manga `one piece`, light novel `re zero`, webnovel `Reverend Insanity`, visual novel `Steins Gate`, TV `The Mentalist`, film `Spirited Away`, comic `Batman`, novel `Dune`, and game `Elden Ring`.
4. Verify the public interface can search, open details, and add a result to an existing profile.

Provider APIs can individually change or go offline; test these live routes after every deployment. Neither live deployment nor live external API responses were modified by constructing this ZIP.
