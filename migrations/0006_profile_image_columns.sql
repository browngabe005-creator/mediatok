-- Add the custom profile-picture storage column used by the Worker.
-- Existing users and rows are preserved.
ALTER TABLE users ADD COLUMN avatar_url TEXT NOT NULL DEFAULT '';
