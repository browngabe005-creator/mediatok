# Anime and manga credits improvements

The media details modal now performs a title-based AniList lookup for anime and manga regardless of which catalog originally supplied the search result. It loads staff and character portraits, Japanese voice actors for anime, and author/artist credits plus characters for manga. MyAnimeList data through Jikan is used as a fallback when AniList cannot return a matching entry. Missing portraits use a generated initials avatar rather than leaving an empty image slot.

Sources:
- AniList GraphQL API: https://anilist.gitbook.io/anilist-apiv2-docs
- Jikan (unofficial MyAnimeList API): https://docs.api.jikan.moe/

AniList/Jikan availability, provider rate limits, and individual records can still affect results; no third-party database guarantees a real portrait for every person.
