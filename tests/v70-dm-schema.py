from pathlib import Path
import sqlite3
root=Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
db.executescript('CREATE TABLE users(id INTEGER PRIMARY KEY,name TEXT); INSERT INTO users VALUES(1,"a"),(2,"b");')
db.executescript((root/'migrations/0014_private_messages.sql').read_text())
db.execute('INSERT INTO dm_threads(user_low_id,user_high_id,created_at,updated_at) VALUES(1,2,1,1)')
try:
 db.execute('INSERT INTO dm_threads(user_low_id,user_high_id,created_at,updated_at) VALUES(1,2,1,1)')
 raise AssertionError('duplicate thread accepted')
except sqlite3.IntegrityError: pass
db.execute('INSERT INTO dm_messages(thread_id,sender_id,body,created_at) VALUES(1,1,"hi",2)')
assert db.execute('SELECT body FROM dm_messages').fetchone()[0]=='hi'
print('PASS v70 DM schema: unique private threads and participant messages')
