-- Additive cache only. No existing user or media data is altered.
CREATE TABLE IF NOT EXISTS media_catalog_cache (
 cache_key TEXT PRIMARY KEY,
 response_json TEXT NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_media_catalog_cache_updated ON media_catalog_cache(updated_at);
