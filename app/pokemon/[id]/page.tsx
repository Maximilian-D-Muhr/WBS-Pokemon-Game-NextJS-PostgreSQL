import { getPokemon, TYPE_COLORS } from '@/lib/pokeapi';
import { SpriteViewer } from '@/app/components/SpriteViewer';
import { AddToRosterButton } from '@/app/components/AddToRosterButton';
import Link from 'next/link';

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;
  const pokemon = await getPokemon(id);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const primaryColor = TYPE_COLORS[primaryType] || '#A8A878';

  // Calculate total stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header with gradient */}
      <div
        className="relative pb-32 pt-8"
        style={{
          background: `linear-gradient(to bottom, ${primaryColor}40 0%, transparent 100%)`,
        }}
      >
        <div className="mx-auto max-w-4xl px-4">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to Arenas
          </Link>

          {/* Pokemon name and ID */}
          <div className="mt-4 flex items-center gap-4">
            <h1 className="text-4xl font-bold capitalize text-zinc-900 dark:text-zinc-100">
              {pokemon.name}
            </h1>
            <span className="text-2xl text-zinc-400">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>

          {/* Types */}
          <div className="mt-3 flex gap-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="rounded-full px-4 py-1 text-sm font-medium text-white"
                style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#A8A878' }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto -mt-24 max-w-4xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Sprite Viewer */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <SpriteViewer pokemonId={pokemon.id} pokemonName={pokemon.name} />

            {/* Add to Roster Button */}
            <div className="mt-6">
              <AddToRosterButton pokemon={pokemon} />
            </div>
          </div>

          {/* Right: Stats & Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Info
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-zinc-500">Height</span>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div>
                  <span className="text-sm text-zinc-500">Weight</span>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
                <div>
                  <span className="text-sm text-zinc-500">Base XP</span>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {pokemon.base_experience || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-zinc-500">Total Stats</span>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {totalStats}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Base Stats
              </h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-zinc-600 dark:text-zinc-400">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Abilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className={`rounded-lg px-3 py-1 text-sm capitalize ${
                      a.is_hidden
                        ? 'border border-dashed border-zinc-300 text-zinc-500 dark:border-zinc-600'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {a.ability.name.replace('-', ' ')}
                    {a.is_hidden && ' (hidden)'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
