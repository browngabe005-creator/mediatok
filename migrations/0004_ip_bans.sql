-- Run after migration 0003_forum_roles.sql.
ALTER TABLE ip_bans ADD COLUMN ip_address TEXT;
CREATE INDEX IF NOT EXISTS idx_ip_bans_address ON ip_bans(ip_address);
