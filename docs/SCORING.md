# Scoring & Experience System Documentation

## Overview

The Pokemon Battle game uses two metrics to track player performance:
- **Score** - Points earned during a single battle session
- **XP (Experience Points)** - Cumulative points across all sessions

---

## Score Calculation

Score is earned each time you **defeat an opponent** in battle.

### Formula

```
Score per Victory = opponent.maxHP + opponent.attack
```

### Example

If you defeat a Charizard with:
- Max HP: 78
- Attack: 84

**Score earned = 78 + 84 = 162 points**

### Session Score

- Score accumulates during a battle session (multiple fights with the same Pokemon)
- Score resets to 0 when you:
  - Return to Pokemon selection
  - Start a new session

---

## XP (Experience Points) Calculation

XP is your **lifetime score** that persists across all sessions.

### Formula

| Battle Result | XP Change |
|---------------|-----------|
| **Win** | `+earnedScore` (same as score calculation) |
| **Loss** | `-10 XP` (minimum 0) |

### Example

```
Starting XP: 500

Battle 1: Win vs Blastoise (HP: 79, ATK: 83)
  → +162 XP
  → Total: 662 XP

Battle 2: Loss
  → -10 XP
  → Total: 652 XP

Battle 3: Win vs Pikachu (HP: 35, ATK: 55)
  → +90 XP
  → Total: 742 XP
```

### XP Storage

- XP is stored in `localStorage` under key `pokemon-battle-stats`
- XP is also saved to the database when submitting to the leaderboard

---

## Leaderboard Rules

### Entry Limits

- **Maximum 3 entries per username** in the leaderboard
- If you already have 3 entries and submit a new score:
  - If new score > your lowest score → replaces lowest entry
  - If new score ≤ your lowest score → not added

### What Gets Saved

Each leaderboard entry contains:
- `username` - Player name
- `score` - Session score at time of submission
- `xp` - Total XP at time of submission
- `created_at` - Timestamp

### Auto-Save vs Manual Save

- **Auto-save**: Score is automatically saved after each victory
- **Manual save**: "Save to Leaderboard" button on victory screen

---

## Damage Calculation (Battle Mechanics)

For context, here's how battle damage works:

### Formula

```javascript
baseDamage = max(1, attacker.attack - defender.defense / 2)
randomFactor = 0.85 to 1.15 (random)
criticalHit = 1.5 (10% chance) or 1.0 (90% chance)

finalDamage = floor(baseDamage × randomFactor × criticalHit)
```

### Turn Order

- Pokemon with higher **Speed** attacks first
- If Speed is equal, player attacks first

---

## Arena Progress (Champion Badge)

- Playing in battle with a Pokemon of a specific type marks that arena as "played"
- **8 different arena types**: fire, water, electric, grass, psychic, rock, ice, dragon
- When all 8 arenas are played → **Champion Badge** 🏆

### Note

- You don't need to WIN - just participating counts!
- A dual-type Pokemon (e.g., Charizard: fire/flying) marks both arena types

---

## Security Features

### Cheat Detection

The leaderboard includes honeypot security:

| Check | Limit | Result if Exceeded |
|-------|-------|-------------------|
| Max score per session | 2000 | Logged to Hall of Shame |
| SQL injection patterns | N/A | Logged to Hall of Shame |
| XSS attempts | N/A | Logged to Hall of Shame |

Cheaters receive a **fake success message** (honeypot behavior) but their attempt is logged.

---

## Summary Table

| Metric | Calculation | Persists? | Storage |
|--------|-------------|-----------|---------|
| Score | Win: `+100`, Loss: `-50` (min 0) | Per session | Memory + DB |
| XP | Win: `+30`, Loss: `+10` (always gains) | Forever | localStorage + DB |
| Arena Progress | Pokemon type played | Forever | localStorage |
| Champion Status | All 8 arenas played | Forever | localStorage + DB |

---

## Database Schema

```sql
CREATE TABLE leaderboard (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  score INT NOT NULL,
  xp INT DEFAULT 0,
  is_champion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migrations for existing DB:
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS is_champion BOOLEAN DEFAULT FALSE;
```

---

*Last updated: February 2026*
*WBS Coding School Group Project - Max & Waqar*
