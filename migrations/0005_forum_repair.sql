-- Safe/idempotent repair: creates forum tables only when missing. Does not reset or alter existing user data.
CREATE TABLE IF NOT EXISTS forum_threads (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,category TEXT NOT NULL DEFAULT 'General',title TEXT NOT NULL,body TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_forum_threads_created ON forum_threads(created_at DESC);
CREATE TABLE IF NOT EXISTS forum_replies (id INTEGER PRIMARY KEY AUTOINCREMENT,thread_id INTEGER NOT NULL,user_id INTEGER NOT NULL,body TEXT NOT NULL,created_at INTEGER NOT NULL,FOREIGN KEY(thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON forum_replies(thread_id,created_at ASC);
CREATE TABLE IF NOT EXISTS moderation_audit (id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id INTEGER NOT NULL,action TEXT NOT NULL,target_user_id INTEGER,detail TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE CASCADE);
