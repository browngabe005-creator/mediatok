-- Additive only: preserve all existing users and MediaTok data.
ALTER TABLE users ADD COLUMN email_verified_at INTEGER;
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify','reset')),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_purpose_created
ON auth_tokens(user_id, purpose, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expiry
ON auth_tokens(expires_at);
