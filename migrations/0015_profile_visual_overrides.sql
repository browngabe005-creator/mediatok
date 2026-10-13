-- Profile-specific visual overrides, independent from imported media artwork.
CREATE TABLE IF NOT EXISTS profile_visual_overrides (
  user_id INTEGER NOT NULL,
  slot TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,slot),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
