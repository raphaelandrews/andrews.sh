CREATE TABLE IF NOT EXISTS counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hits INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counter (id, hits) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  website TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shoutbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO guestbook (name, website, message)
SELECT 'andrews', 'https://andrews.sh', 'welcome to my guestbook. leave a message before you go!'
WHERE NOT EXISTS (SELECT 1 FROM guestbook);

INSERT INTO shoutbox (name, message)
SELECT 'andrews', 'shoutbox is open. be nice.'
WHERE NOT EXISTS (SELECT 1 FROM shoutbox);
