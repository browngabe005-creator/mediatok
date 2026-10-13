-- Persistent de-duplication and baseline state for scheduled episode/season notifications.
CREATE TABLE IF NOT EXISTS release_watch_state (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_key TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('anime','tv')),
  provider_id TEXT NOT NULL DEFAULT '',
  last_episode_key TEXT NOT NULL DEFAULT '',
  last_season_key TEXT NOT NULL DEFAULT '',
  last_season INTEGER,
  last_checked_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, media_key)
);
CREATE INDEX IF NOT EXISTS idx_release_watch_checked ON release_watch_state(last_checked_at);
