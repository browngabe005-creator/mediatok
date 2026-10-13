# Faster search and profile social links

- Search now displays Worker catalog results first instead of waiting for every browser catalog provider. The Worker request is capped at 4.5 seconds; if it times out or returns no results, browser providers are used as a fallback (up to 7 seconds).
- Profile editor → Accounts includes Twitter/X, TikTok, and Instagram fields. Enter a username or profile URL; validated links appear on the public profile card.

## Deploy
1. Apply the new migration `0012_social_profiles.sql` to the D1 database.
2. Deploy the Worker and static site using `README-DEPLOY.md`.

If you have an older deployment, do not skip the migration; profile saves will fail until the new `socials` column exists.
