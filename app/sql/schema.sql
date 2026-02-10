-- Leaderboard table for legitimate scores
CREATE TABLE leaderboard (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  score INT NOT NULL,
  xp INT DEFAULT 0,
  is_champion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migrations (run on existing DB):
-- ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
-- ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS is_champion BOOLEAN DEFAULT FALSE;

-- Hall of Shame - catches cheaters/hackers 🍯
CREATE TABLE hall_of_shame (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  attempted_score INT NOT NULL,
  reason TEXT NOT NULL,
  ip_address TEXT DEFAULT 'Unknown',
  attempt_time TIMESTAMP DEFAULT NOW()
);

-- Migration for existing hall_of_shame table:
-- ALTER TABLE hall_of_shame ADD COLUMN IF NOT EXISTS ip_address TEXT DEFAULT 'Unknown';

-- Index for faster queries
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_shame_time ON hall_of_shame(attempt_time DESC);
