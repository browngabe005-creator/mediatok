# MediaTok v75 — Direct-first artwork repair

This release fixes the site-wide missing media artwork regression by removing the Worker image proxy as the mandatory first hop.

## Changes
- Homepage, Discovery, Global activity, search results, similar-media cards, and other shared catalog artwork now request the original HTTPS catalog/CDN image first.
- If the original image fails, the existing `mediaCoverError()` chain retries through `/api/catalog-image`, then the legacy v42 proxy, then performs a fresh title lookup.
- The service-worker cache name is bumped to v75 so an older shell does not keep stale artwork behavior.
- Worker health reports `v75`.
- No D1 migration is required.
