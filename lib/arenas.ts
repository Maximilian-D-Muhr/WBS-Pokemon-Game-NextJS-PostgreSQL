/**
 * Arena definitions for Pokemon Battle Game
 * 8 type-based gyms from the original Pokemon games
 */

export interface Arena {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  leader: string;
  badgeName: string;
  color: string;
  backgroundImage: string;
}

export const ARENAS: Arena[] = [
  {
    id: 'rock',
    name: 'Pewter City Gym',
    type: 'rock',
    typeLabel: 'Rock',
    leader: 'Brock',
    badgeName: 'Boulder Badge',
    color: '#B8A038',
    backgroundImage: '/arenas/Marmoria%20Arena.jpg',
  },
  {
    id: 'water',
    name: 'Cerulean City Gym',
    type: 'water',
    typeLabel: 'Water',
    leader: 'Misty',
    badgeName: 'Cascade Badge',
    color: '#6890F0',
    backgroundImage: '/arenas/AzuriaArena.jpg',
  },
  {
    id: 'electric',
    name: 'Vermilion City Gym',
    type: 'electric',
    typeLabel: 'Electric',
    leader: 'Lt. Surge',
    badgeName: 'Thunder Badge',
    color: '#F8D030',
    backgroundImage: '/arenas/OraniaArena.jpg',
  },
  {
    id: 'grass',
    name: 'Celadon City Gym',
    type: 'grass',
    typeLabel: 'Grass',
    leader: 'Erika',
    badgeName: 'Rainbow Badge',
    color: '#78C850',
    backgroundImage: '/arenas/PrismaniaArena.jpg',
  },
  {
    id: 'psychic',
    name: 'Saffron City Gym',
    type: 'psychic',
    typeLabel: 'Psychic',
    leader: 'Sabrina',
    badgeName: 'Marsh Badge',
    color: '#F85888',
    backgroundImage: '/arenas/Saffronia_arena_anime.jpg',
  },
  {
    id: 'fire',
    name: 'Cinnabar Island Gym',
    type: 'fire',
    typeLabel: 'Fire',
    leader: 'Blaine',
    badgeName: 'Volcano Badge',
    color: '#F08030',
    backgroundImage: '/arenas/Arena_der_Zinnoberinsel.jpg',
  },
  {
    id: 'ice',
    name: 'Mahogany Town Gym',
    type: 'ice',
    typeLabel: 'Ice',
    leader: 'Pryce',
    badgeName: 'Glacier Badge',
    color: '#98D8D8',
    backgroundImage: '/arenas/MahagoniaArenaAnime.jpg',
  },
  {
    id: 'dragon',
    name: 'Blackthorn City Gym',
    type: 'dragon',
    typeLabel: 'Dragon',
    leader: 'Clair',
    badgeName: 'Rising Badge',
    color: '#7038F8',
    backgroundImage: '/arenas/EbenholzArenaAnime.jpg',
  },
];

export function getArenaById(id: string): Arena | undefined {
  return ARENAS.find((arena) => arena.id === id);
}
