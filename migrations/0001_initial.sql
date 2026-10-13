CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT NOT NULL UNIQUE,
  discord_username TEXT NOT NULL DEFAULT '',
  global_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '',
  favs TEXT NOT NULL DEFAULT '',
  banner TEXT NOT NULL DEFAULT 'Mono',
  avc TEXT NOT NULL DEFAULT '',
  shape TEXT NOT NULL DEFAULT 'circle',
  joined INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  banned INTEGER NOT NULL DEFAULT 0,
  links TEXT NOT NULL DEFAULT '{}',
  stats TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
