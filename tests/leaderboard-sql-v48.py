from pathlib import Path
import re,sqlite3
s=Path(__file__).resolve().parents[1].joinpath('src/worker.js').read_text()
a=s.index('if (url.pathname === "/api/leaderboard"');b=s.index('// Fast, bounded public member lookup',a);r=s[a:b]
queries=re.findall(r'prepare\(`(SELECT.*?)`\)\.(?:all|bind)',r,flags=re.S)
assert len(queries)==2, len(queries)
c=sqlite3.connect(':memory:')
c.executescript('''CREATE TABLE users(id INTEGER PRIMARY KEY,name TEXT,avc TEXT,banned INTEGER DEFAULT 0);
CREATE TABLE media_logs(user_id INTEGER,media_type TEXT,title TEXT,status TEXT);
INSERT INTO users VALUES(1,'Fan','',0);
INSERT INTO media_logs VALUES(1,'games','Fortnite','Completed');
INSERT INTO media_logs VALUES(1,'video-game','Valorant','Completed');
INSERT INTO media_logs VALUES(1,'video_game','League of Legends','Completed');
INSERT INTO media_logs VALUES(1,'Game','Elden Ring','Completed');
INSERT INTO media_logs VALUES(1,'game','Tetris','Completed');
INSERT INTO media_logs VALUES(1,'game','Disco Elysium','Planning');
INSERT INTO media_logs VALUES(1,'novel','Dune','Completed');
INSERT INTO media_logs VALUES(1,'webnovel','The Wandering Inn','Completed');
INSERT INTO media_logs VALUES(1,'other','Made Up Medium','Completed');
''')
rows=c.execute(queries[0]).fetchall();assert rows[0][-1]==2,rows
matched=c.execute(queries[1]).fetchall();assert set(row[1] for row in matched)=={'Fortnite','Valorant','League of Legends','Elden Ring','Tetris'},matched
print('PASS v48: SQL normalizes game, games, video-game, video_game; excludes unknown types and Planning. Story title eligibility remains separate')
