"use server";

import { z } from "zod";
import { db } from "./db";
import { revalidatePath } from "next/cache";

// Constants for cheat detection
const MAX_LEGITIMATE_SCORE = 2000; // Max realistic score per session
const SUSPICIOUS_PATTERNS = [
  /drop\s+table/i,
  /delete\s+from/i,
  /insert\s+into/i,
  /<script/i,
  /javascript:/i,
  /onerror/i,
  /onclick/i,
];

const leaderboardEntrySchema = z.object({
  username: z.string()
    .min(1, "Username required")
    .max(30, "Username too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and - allowed"),
  score: z.number().int().nonnegative(),
  xp: z.number().int().nonnegative().optional(),
  isChampion: z.boolean().optional(),
});

type LeaderboardInput = z.infer<typeof leaderboardEntrySchema>;

interface SubmissionResult {
  success: boolean;
  error?: string;
  details?: Record<string, string[]>;
  caught?: boolean; // True if caught cheating
}

// Detect suspicious activity
function detectCheating(input: unknown): { isSuspicious: boolean; reason: string } {
  // Check if input is even an object
  if (typeof input !== 'object' || input === null) {
    return { isSuspicious: true, reason: "Invalid request format" };
  }

  const data = input as Record<string, unknown>;

  // Check for SQL injection attempts in raw input
  const rawUsername = String(data.username || '');
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(rawUsername)) {
      return { isSuspicious: true, reason: `Injection attempt detected: ${rawUsername}` };
    }
  }

  // Check for impossibly high scores
  if (typeof data.score === 'number' && data.score > MAX_LEGITIMATE_SCORE) {
    return { isSuspicious: true, reason: `Score too high: ${data.score} (max: ${MAX_LEGITIMATE_SCORE})` };
  }

  return { isSuspicious: false, reason: "" };
}

// Log cheating attempt to the Hall of Shame
async function logCheatAttempt(
  username: string,
  attemptedScore: number,
  reason: string
) {
  try {
    await db`
      INSERT INTO hall_of_shame (username, attempted_score, reason, attempt_time)
      VALUES (${username.slice(0, 50)}, ${attemptedScore}, ${reason.slice(0, 200)}, NOW())
    `;
  } catch {
    // Table might not exist yet, silently fail
    console.log("Hall of shame table not ready");
  }
}

export async function addToLeaderboard(input: unknown): Promise<SubmissionResult> {
  // First, check for cheating BEFORE validation
  const cheatCheck = detectCheating(input);

  if (cheatCheck.isSuspicious) {
    const data = input as Record<string, unknown>;
    const username = String(data.username || 'UNKNOWN').slice(0, 50);
    const score = Number(data.score) || 0;

    // Log to Hall of Shame
    await logCheatAttempt(username, score, cheatCheck.reason);

    // Return success to not alert the attacker (honeypot behavior)
    return {
      success: true, // Fake success!
      caught: true,
    };
  }

  // Normal validation
  const parsed = leaderboardEntrySchema.safeParse(input);

  if (!parsed.success) {
    // Validation failed - might be an attack
    const data = input as Record<string, unknown>;
    const username = String(data.username || 'INVALID').slice(0, 50);
    const score = Number(data.score) || 0;

    await logCheatAttempt(username, score, `Validation failed: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);

    return {
      success: false,
      error: "Invalid leaderboard data",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data: LeaderboardInput = parsed.data;

  const isChampion = data.isChampion || false;

  // One entry per username — always update score/xp/champion status
  const existingEntry = await db`
    SELECT id, score FROM leaderboard
    WHERE username = ${data.username}
    LIMIT 1
  `;

  if (existingEntry.length > 0) {
    // Update existing entry with latest score, xp and champion status
    await db`
      UPDATE leaderboard
      SET score = ${data.score}, xp = ${data.xp || 0}, is_champion = ${isChampion}, created_at = NOW()
      WHERE id = ${existingEntry[0].id}
    `;
  } else {
    // New user — insert first entry
    await db`
      INSERT INTO leaderboard (username, score, xp, is_champion)
      VALUES (${data.username}, ${data.score}, ${data.xp || 0}, ${isChampion})
    `;
  }

  revalidatePath("/leaderboard");

  return {
    success: true,
    caught: false,
  };
}

export async function getLeaderboard() {
  try {
    const rows = await db`
      SELECT id, username, score, COALESCE(xp, 0) as xp, COALESCE(is_champion, false) as is_champion, created_at
      FROM leaderboard
      ORDER BY score DESC
      LIMIT 100
    `;
    return rows;
  } catch {
    // Fallback if columns don't exist yet
    const rows = await db`
      SELECT id, username, score, 0 as xp, false as is_champion, created_at
      FROM leaderboard
      ORDER BY score DESC
      LIMIT 100
    `;
    return rows;
  }
}

// Get the Hall of Shame (caught cheaters)
export async function getHallOfShame() {
  try {
    const rows = await db`
      SELECT id, username, attempted_score, reason, attempt_time
      FROM hall_of_shame
      ORDER BY attempt_time DESC
      LIMIT 50
    `;
    return rows;
  } catch {
    // Table might not exist
    return [];
  }
}
