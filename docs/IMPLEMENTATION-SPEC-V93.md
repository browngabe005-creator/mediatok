# MediaTok expansion: approved plan and first release (v93)

**Baseline:** v92 (`src/worker.js`, `public/index.html`, Cloudflare Workers + D1). **Status:** first-release implementation; no live deployment. The attached zip is a new build, not a modification of the deployed Worker. Preserve the original D1 binding, database UUID, existing users, logs, migrations 0001–0015, all profile renderers and profile visual overrides.

## 1. Scope and sequence

| Phase | Goal | Delivery scope | Database |
| --- | --- | --- | --- |
| **1 — v93 (this release)** | Safe foundation + Custom Public Lists + client-only UI skin architecture | Add conservative canonical-ID tables and manual event capture; public/unlisted/private ranked lists with item reorder, share links, list CRUD, Discover → View Details → Save to List; local four-way UI picker; first Passport-style pointer tilt | Migrations `0016`, `0017` |
| 2 | Passport Dexx page parity | Full Home, Discover, Lists, Community and Settings page-specific shells, mouse/touch interactions, poster grids, circle, accessibility and motion tuning. Do **not** alter profile layout or media data | Mostly frontend; extensions only if parity audit shows missing data |
| 3 | AniList and Letterboxd page parity | Each page's own shell, card system, reviews/diary and list filtering; preserve all MediaTok mediums even on film-first visual style | Additional tables for reviews/diary where necessary |
| 4 | Achievements and Badges | Published badge definitions, secure idempotent award rules, display slots, admin-only rule management | Proposed `0018_achievements.sql` |
| 5 | Taste Twins + MediaTok DNA | Deduplicated media graph, rating/genre overlap, uncertainty-aware comparisons, shareable DNA cards; opt out | Proposed `0019_taste_matching.sql`, `0020_media_dna.sql` |
| 6 | MediaTok Wrapped | Recaps using *verified* timed events, imported-data disclaimers, immutable annual snapshots, accessible animations | Proposed `0021_wrapped.sql` |

**Critical distinction:** v93 delivers the initial UI architecture and styling choices. It does **not** include pixel-identical copies or all features of the reference sites. Those require the explicit parity milestones above, source-specific data, acceptance tests and permissions. No third-party logos or credentials are used.

## 2. File-by-file changes — v93

| File | Exact change | Compatibility / preservation |
| --- | --- | --- |
| `migrations/0016_media_identity_events.sql` | Adds `canonical_media`, `media_provider_ids`, `media_activity_events` with user/date and provider indexes | No ALTER to `media_logs`, no automatic fuzzy duplicate merges, no historical dates invented |
| `migrations/0017_custom_lists.sql` | Adds `user_lists`, `user_list_items` and owner/visibility/order indexes | List items store independent media references; resetting a media log cannot cascade to a list |
| `src/activity-v93.js` | New best-effort append-only recorder for manual log and progress actions | Existing media logging API response unchanged. Emits event timestamps as *MediaTok received action*, not originally watched dates |
| `src/lists-v93.js` | New same-origin list REST handler: ownership, privacy, duplicate limits, validated media types, order updates | No direct changes to media logs, comments or profile settings |
| `src/worker.js` | Imports list handler + activity recorder, hooks `/api/lists/*` into `handleAPI`, records manual log/progress events, health version v93 | Old routes, imports, cron, DM and credit providers remain intact |
| `public/lists-v93.js` | Lists browse/detail/create/edit/delete, ranking controls, share links, media notes, save-from-View Details | Independent from `profilePage()` and `mtProfileLayout()` |
| `public/lists-v93.css` | Scoped list presentation and mobile layout | Does not redefine existing profile selectors |
| `public/site-skins-v93.css` | Initial AniList/Passport/Letterboxd site-only visual layer; active only outside profile | CSS guarded by `[data-profile-active="false"]` and `.layout:not(.pf-page)` |
| `public/site-skins-v93.js` | Delegated, RAF-throttled Passport-style pointer rotation/glare; reduced-motion/touch guards | Never updates account/profile data |
| `public/index.html` | Adds Lists to top/sidebar/mobile nav, Save to List in details, local site-style picker in Settings, list view render branch, public share-link boot handling, external CSS/JS includes | Existing original/anime/future profile renderers unchanged; existing palette/mode selection remains separate |
| `public/service-worker.js` | Rotates cache namespace and pre-caches new local assets | No D1 or user account effect |
| `tests/v93-lists.mjs` | SQLite-backed REST regression tests for privacy/owners/reorder/dedup/delete isolation/event recording | Does not require live Worker or live D1 |
| `docs/IMPLEMENTATION-SPEC-V93.md` | This file | Documentation only |
| `README-V93-FIRST-RELEASE.md` | Safe deployment and validation checklist | Documentation only |

## 3. Exact server API contracts (v93)

All responses are JSON, `Cache-Control: no-store`. Logged-in endpoints use the existing `mt_session` cookie. Only the owner may mutate list data. `GET` methods work unauthenticated only when visibility permits.

| Method | Route | Request/body | Response / access |
| --- | --- | --- | --- |
| `GET` | `/api/lists` | optional `?user=handle`, `?mine=1` | `{"lists":[...]}`; public directory, public user lists, or signed-in owner's own lists |
| `POST` | `/api/lists` | `{title,description,visibility,ranked}` | `201 {ok,id,shareToken}`; owner only; max 40 lists/user |
| `GET` | `/api/lists/:id` | optional `?token=...` | `{list,items}`; public, owner, or unlisted with matching token; private never shared |
| `PATCH` | `/api/lists/:id` | partial `{title,description,visibility,ranked}` | `{ok:true}` owner only |
| `DELETE` | `/api/lists/:id` | empty | `{ok:true}` owner only; deletes list and items only |
| `POST` | `/api/lists/:id/items` | `{mediaType,mediaKey,title,cover,year,note}` | `201 {ok,id}`; valid MediaTok medium; max 150 items; unique `(list_id,media_key)` |
| `PATCH` | `/api/lists/:id/items/:itemId` | `{note}` | `{ok:true}` owner only |
| `DELETE` | `/api/lists/:id/items/:itemId` | empty | `{ok:true}` owner only |
| `POST` | `/api/lists/:id/reorder` | `{itemIds:[all existing item IDs exactly once]}` | `{ok:true}`; atomically rewritten positions |

### Validation rules

- List title 1–90 chars; description 0–1,200 chars; media title 1–200; note 0–800; cover **HTTPS** only; `mediaKey` max 250.
- Visibility: `public`, `unlisted` (opaque token needed for nonowner), `private` (owner only). Unlisted/private omitted from the public directory.
- No cross-account mutation, guessed private-list IDs, unsanitized HTML, or case-insensitive title-only auto-merging.
- Link token must not be confused with user authentication. An unlisted list link grants **read only**, never edit rights.
- Ranking is separate from rating. Lists remain intact when an underlying `media_logs` entry is deleted.

## 4. Exact database changes and data strategy

**Apply migrations `0016` and `0017` in numerical order.** The exact executable SQL is in those files. Both create new tables and indexes only; neither overwrites a current table.

`canonical_media`: `id`, `media_type`, `title`, `year`, timestamps. `media_provider_ids`: composite primary key `(provider, provider_id, media_type)`, trusted FK to canonical record. `media_activity_events`: `user_id`, `media_key`, `media_type`, `event_kind`, `status_before/after`, `progress_after`, `rating_after`, `source`, `occurred_at`.

`user_lists`: integer `id`, FK `user_id`, title, description, constrained visibility, ranked flag, randomly generated share token, created/updated timestamps. `user_list_items`: item ID, FK list ID, unique media key per list, medium, title, cover, year, note, position and creation timestamp.

**Important:** canonical-media tables are introduced as a trusted identity registry, not blindly backfilled with one row per matching title. Provider adapters must explicitly supply recognized IDs. When one work has ambiguous editions or adaptations, retain separate identities until verified. Current lists still display provider-specific entries correctly.

**Activity coverage in v93:** manual log saves and progress saves create events at the time of the action. v93 does not reconstruct historical episodes, backfill imported watch dates, or claim to capture every action taken by every external sync provider. Later integration will instrument import pipelines and deletion/reset semantics before Wrapped goes live. The event recorder logs a warning rather than breaking media logging if migration `0016` was missed.

## 5. Frontend behavior and site-style isolation

**Setting:** Settings → Appearance → Site UI Style. Options: MediaTok Default, AniList, Passport Dexx, Letterboxd.

- Store only `mt_site_skin` in **browser `localStorage`**, not `users.socials`, D1, or profile-layout preferences. No auth required.
- Existing color themes (`mt_theme`) remain independently selectable.
- A public profile continues rendering its owner's `original`/`anime`/`future` profile layout. New page styles are disabled on profile routes via `data-profile-active` guard.
- All four site styles share API calls and functionality. They must not create new copies of logs, modals, or storage.
- Start Passport parity from Home, Discover, Lists, Settings and navigation, then proceed to Community/Details/media modals. Use matching spacing, curved cards, independent left icon rail, media pockets, and pointer-driven cover tilt. **At this phase the styling is foundational, not final-reference-perfect.**
- Pointer interaction: RAF-throttled rotateX/rotateY (±5°), slight scale/lift and localized glare; skip touch and `prefers-reduced-motion`. Keep pointer transforms strictly out of profiles.

### Page parity checklist (future milestones)

| Site page | MediaTok default | Passport | AniList | Letterboxd |
| --- | --- | --- | --- | --- |
| Home | Preserve | Visual hub, circle, moving poster rails | Trending/seasonal/activity | Popular/reviews/friends |
| Discover/Search | Preserve | Cover wall, swipe rows | Grid, advanced filters | Poster explorer, sorting |
| Media Details | Preserve | Immersive detail, related pockets | Banner, stats, staff, related | Poster, credits, reviews/logs |
| Library | Preserve | Status pockets | Anime/manga-style lists and progress | Watched/watchlist/diary |
| Lists | v93 built | Visual collections | Compact rows/grid | Ranked public list cards |
| Community | Preserve | Circle activity | Feed/forum | Reviews/activity |
| Settings | Preserve | Minimal passport settings | Tabs | Compact sections |
| Public profile | **Do not modify** | **Do not modify** | **Do not modify** | **Do not modify** |

Every medium remains available regardless of selected site-style, including novels, manga, webnovels, games and comics. Do not use external trademarks/logos in MediaTok.

## 6. Tests and acceptance gates

| Test | Expected result | v93 status |
| --- | --- | --- |
| Migrations 0001–0017 in order | All apply without losing legacy tables | Executed locally (SQLite) |
| List owner CRUD | Create, rename, re-rank, edit note, remove, delete | Node SQLite test pass |
| Anonymous writes/other-user writes | Rejected 401/403 | Test pass |
| Public/unlisted/private reads | Public browse; unlisted needs token; private owner only | Test pass |
| Reorder validation | Full distinct item set required | Test pass |
| Log deletion independence | List deletion does not delete logs, list references not FK to logs | Test + schema verified |
| Captured actions | Manual log/progress actions tracked by event helper | Unit tested / source checked |
| Frontend syntax | All inline scripts, new JS, Worker | Syntax-check pass |
| Original profile preservation | No edits to `profilePage()`, `mtAnimeProfilePage`, `mtFutureProfilePage` | Source-change review required |
| Live Cloudflare OAuth/D1 | End-to-end production confirmation | **Not executed** |
| Actual browser navigation/screenshots | At least desktop 1440px and phone 390px; every style, modal and profile | **Pending deployment/browser validation**; local browser navigation blocked by sandbox |

**Mandatory production QA:** backup existing D1; apply additive migrations; deploy whole Worker project; confirm `/api/health` v93; create public/private/unlisted lists and verify account separation; reorder; Save to List from View Details; load shared URL in logged-out browser; toggle site style and reload; ensure Original/Anime/Future public profile URLs are unchanged; verify light/dark and mobile. Check Cloudflare logs before general rollout.

## 7. Future exact schema planning (not created in v93)

- `0018_achievements.sql`: `achievement_definitions(id,slug,medium,rule_json,rarity,active)`, `user_achievements(user_id,achievement_id,awarded_at)`, `user_badge_slots(user_id,slot,achievement_id)`. Award in scheduled/idempotent runs; exclude Planning from completion milestones.
- `0019_taste_matching.sql`: `user_taste_snapshots(user_id,schema_version,data_json,computed_at)` and `compatibility_cache(user_a,user_b,score,confidence,shared_count,computed_at)`. Normalize media IDs, keep confidence lower for limited overlap; opt-out and expiration.
- `0020_media_dna.sql`: `media_dna_snapshots(user_id,algorithm_version,traits_json,computed_at)`; user-controlled visibility, no fabricated personality facts.
- `0021_wrapped.sql`: `media_wrapped_snapshots(user_id,year,summary_json,evidence_until,generated_at)`; verified vs imported estimates separated. Finalize schema when activity history coverage is complete.
- Potential follow-up diary/review tables for Letterboxd parity; cannot equate today's `media_logs.updated_at` with historical watch dates.

## 8. Rollback and data protection

- App rollback: redeploy v92 Worker/assets if needed; the additive new tables remain harmless and **must not be dropped blindly**. `mt_site_skin` can be reset in browser localStorage to `default`.
- Do not recreate D1, run `DROP TABLE`, delete log data, or modify Cloudflare bindings. No secrets/Discord IDs should be put into a public preview.
- No auto-import writes or user-profile resets are part of v93. D1 backup is mandatory before remote migrations.
