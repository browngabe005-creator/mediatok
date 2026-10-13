-- Adds independent email/password authentication without modifying existing accounts.
-- Existing Discord users remain Discord users; accounts are never automatically merged.
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'discord';
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_password_unique
ON users(email COLLATE NOCASE)
WHERE password_hash IS NOT NULL AND auth_provider='email';
