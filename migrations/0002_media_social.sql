ALTER TABLE users ADD COLUMN banner_url TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN accent TEXT NOT NULL DEFAULT '#6d6bf5';

CREATE TABLE IF NOT EXISTS media_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  media_key TEXT NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  cover TEXT NOT NULL DEFAULT '',
  media_year TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Completed',
  progress INTEGER NOT NULL DEFAULT 0,
  rating REAL,
  note TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, media_key),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_media_logs_updated ON media_logs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_logs_user ON media_logs(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS log_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(log_id) REFERENCES media_logs(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_log_comments_log ON log_comments(log_id, created_at ASC);
