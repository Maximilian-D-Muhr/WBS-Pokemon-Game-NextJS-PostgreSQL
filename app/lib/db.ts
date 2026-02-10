import { neon } from "@neondatabase/serverless";

export const db = neon(process.env.DATABASE_URL!);

// Separate database for Hall of Shame (security logging)
export const shameDb = neon(process.env.SHAME_DATABASE_URL || process.env.DATABASE_URL!);
