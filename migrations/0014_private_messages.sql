-- Private member-to-member messages. Additive and isolated from public forum data.
CREATE TABLE IF NOT EXISTS dm_threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_low_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_high_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_low_id,user_high_id),
  CHECK(user_low_id < user_high_id)
);
CREATE INDEX IF NOT EXISTS idx_dm_threads_low ON dm_threads(user_low_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_dm_threads_high ON dm_threads(user_high_id,updated_at DESC);

CREATE TABLE IF NOT EXISTS dm_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL REFERENCES dm_threads(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  read_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_dm_messages_thread ON dm_messages(thread_id,created_at ASC);
CREATE INDEX IF NOT EXISTS idx_dm_messages_unread ON dm_messages(thread_id,read_at,created_at DESC);
