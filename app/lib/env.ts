/**
 * Type-safe environment variables
 *
 * Client-side variables must be prefixed with NEXT_PUBLIC_
 * Server-side variables are only accessible in Server Components and API routes
 */

// Client-side environment variables (accessible in browser)
export const env = {
  // PokeAPI base URL - public, used for fetching Pokemon data
  POKEAPI_BASE_URL: process.env.NEXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
} as const;

// Server-side environment variables (only accessible on server)
export const serverEnv = {
  // Database URL - only used on server, never exposed to client
  DATABASE_URL: process.env.DATABASE_URL || '',
} as const;

/**
 * Validate that required server environment variables are set
 * Call this in server-side code to fail fast if config is missing
 */
export function validateServerEnv() {
  const missing: string[] = [];

  // Uncomment when database is set up:
  // if (!serverEnv.DATABASE_URL) missing.push('DATABASE_URL');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
