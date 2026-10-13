-- v93 foundation. This does not change or rewrite existing media_logs.
-- Only link external provider IDs when they are explicitly known; title-based matching
-- must not silently merge adaptations, remakes, reissues, or similarly named works.
CREATE TABLE IF NOT EXISTS canonical_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_canonical_media_type ON canonical_media(media_type);
CREATE TABLE IF NOT EXISTS media_provider_ids (
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  media_type TEXT NOT NULL,
  canonical_media_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(provider, provider_id, media_type),
  FOREIGN KEY(canonical_media_id) REFERENCES canonical_media(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_media_provider_canonical ON media_provider_ids(canonical_media_id);
CREATE TABLE IF NOT EXISTS media_activity_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  media_key TEXT NOT NULL,
  media_type TEXT NOT NULL,
  event_kind TEXT NOT NULL,
  status_before TEXT,
  status_after TEXT,
  progress_after INTEGER,
  rating_after REAL,
  source TEXT NOT NULL DEFAULT 'manual',
  occurred_at INTEGER NOT NULL,
  -- derived event timestamps are not original watched/read dates
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_media_activity_user_date ON media_activity_events(user_id,occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_activity_key ON media_activity_events(user_id,media_key,occurred_at DESC);
