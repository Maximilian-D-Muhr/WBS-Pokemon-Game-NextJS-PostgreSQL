import { env } from './env';

/**
 * PokeAPI Types
 */

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

/**
 * PokeAPI Client
 */

const BASE_URL = env.POKEAPI_BASE_URL;

/**
 * Fetch a list of Pokemon
 */
export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    { cache: 'force-cache' } // Cache forever - Pokemon data never changes
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a single Pokemon by ID or name
 */
export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`, {
    cache: 'force-cache', // Cache forever - Pokemon data never changes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${idOrName}: ${response.status}`);
  }

  return response.json();
}

/**
 * Extract Pokemon ID from URL
 */
export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

/**
 * Get Pokemon sprite URL (small)
 */
export function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/**
 * Get Pokemon official artwork URL (large HD)
 */
export function getPokemonArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get Pokemon shiny artwork URL (large HD)
 */
export function getPokemonShinyArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

/**
 * Fetch Pokemon by type
 */
export interface TypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface TypeResponse {
  id: number;
  name: string;
  pokemon: TypePokemon[];
}

export async function getPokemonByType(type: string): Promise<TypeResponse> {
  const response = await fetch(`${BASE_URL}/type/${type}`, {
    cache: 'force-cache', // Cache forever - Pokemon data never changes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch type ${type}: ${response.status}`);
  }

  return response.json();
}

/**
 * Type color mapping for UI
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
