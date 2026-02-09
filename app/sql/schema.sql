-- Leaderboard table for legitimate scores
CREATE TABLE leaderboard (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hall of Shame - catches cheaters/hackers 🍯
CREATE TABLE hall_of_shame (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  attempted_score INT NOT NULL,
  reason TEXT NOT NULL,
  attempt_time TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_shame_time ON hall_of_shame(attempt_time DESC);
