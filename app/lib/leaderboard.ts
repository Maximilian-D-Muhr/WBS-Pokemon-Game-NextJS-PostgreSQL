"use server";

import { z } from "zod";
import { db } from "./db";
import { revalidatePath } from "next/cache";

const leaderboardEntrySchema = z.object({
  username: z.string().min(1).max(30),
  score: z.number().int().nonnegative(),
});

type LeaderboardInput = z.infer<typeof leaderboardEntrySchema>;

export async function addToLeaderboard(input: unknown) {
  const parsed = leaderboardEntrySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid leaderboard data",
      details: parsed.error.flatten().fieldErrors
    };
  }

  const data: LeaderboardInput = parsed.data;
  
  const [row] = await db`
    INSERT INTO leaderboard (username, score)
    VALUES (${data.username}, ${data.score})
    RETURNING id, username, score, created_at
  `;

  revalidatePath("/leaderboard");
  
  return {
    success: true,
    data: row
  };
}

export async function getLeaderboard() {
  const rows = await db`
    SELECT id, username, score, created_at
    FROM leaderboard
    ORDER BY score DESC
  `;
  return rows;
}
