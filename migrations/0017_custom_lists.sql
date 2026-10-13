-- Lists contain snapshots/references, not media_logs FKs. Deleting a user's log
-- must not silently delete that media from a separately curated public list.
CREATE TABLE IF NOT EXISTS user_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','unlisted','private')),
  ranked INTEGER NOT NULL DEFAULT 1 CHECK(ranked IN (0,1)),
  share_token TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_lists_owner ON user_lists(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_lists_visibility ON user_lists(visibility,updated_at DESC);
CREATE TABLE IF NOT EXISTS user_list_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,
  media_key TEXT NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  cover TEXT NOT NULL DEFAULT '',
  media_year TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(list_id,media_key),
  FOREIGN KEY(list_id) REFERENCES user_lists(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_list_items_position ON user_list_items(list_id,position,id);
