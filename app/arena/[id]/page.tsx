import { getArenaById, ARENAS } from '@/app/lib/arenas';
import { getPokemonByType, getPokemonIdFromUrl, TYPE_COLORS } from '@/app/lib/pokeapi';
import { PokemonCard } from '@/app/components/PokemonCard';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ArenaPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArenaPage({ params }: ArenaPageProps) {
  const { id } = await params;
  const arena = getArenaById(id);

  if (!arena) {
    notFound();
  }

  // Fetch all Pokemon of this type
  const typeData = await getPokemonByType(arena.type);

  // Limit to first Pokemon (Gen 1-4 for reasonable list)
  // Filter to only show Pokemon with ID <= 493 (up to Gen 4)
  const pokemonList = typeData.pokemon
    .map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
      id: getPokemonIdFromUrl(p.pokemon.url),
    }))
    .filter((p) => p.id <= 493)
    .sort((a, b) => a.id - b.id);

  const typeColor = TYPE_COLORS[arena.type] || '#A8A878';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${arena.backgroundImage})` }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${typeColor}60 0%, ${typeColor}CC 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-6">
          <Link
            href="/"
            className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            ← Back to Arenas
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{getTypeEmoji(arena.type)}</span>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
                {arena.typeLabel}
              </span>
              <h1 className="text-3xl font-bold text-white">{arena.name}</h1>
            </div>
          </div>

          <p className="mt-2 text-white/90">
            Leader: <span className="font-medium">{arena.leader}</span> • Badge:{' '}
            <span className="font-medium">{arena.badgeName}</span>
          </p>
        </div>
      </div>

      {/* Pokemon List */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            🔥 Wild Pokemon in this Gym
          </h2>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            In this arena you might encounter wild{' '}
            <span
              className="font-medium"
              style={{ color: typeColor }}
            >
              {arena.typeLabel}
            </span>
            -type Pokemon. Choose one to add to your roster!
          </p>
        </div>

        <p className="mb-4 text-sm text-zinc-500">
          Showing {pokemonList.length} {arena.typeLabel}-type Pokemon
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {pokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              url={pokemon.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    psychic: '🔮',
    rock: '🪨',
    ice: '❄️',
    dragon: '🐉',
  };
  return emojis[type] || '❓';
}
