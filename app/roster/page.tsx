'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TYPE_COLORS } from '@/app/lib/pokeapi';

interface RosterPokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

const MAX_ROSTER_SIZE = 6;

export default function RosterPage() {
  const [roster, setRoster] = useState<RosterPokemon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pokemon-roster');
    setRoster(saved ? JSON.parse(saved) : []);
    setIsLoaded(true);
  }, []);

  const removeFromRoster = (id: number) => {
    const newRoster = roster.filter((p) => p.id !== id);
    localStorage.setItem('pokemon-roster', JSON.stringify(newRoster));
    setRoster(newRoster);
  };

  const clearRoster = () => {
    localStorage.removeItem('pokemon-roster');
    setRoster([]);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">Loading roster...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              My Roster
            </h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {roster.length} / {MAX_ROSTER_SIZE} Pokemon
            </p>
          </div>

          {roster.length > 0 && (
            <button
              onClick={clearRoster}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Clear All
            </button>
          )}
        </div>

        {roster.length === 0 ? (
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              Your roster is empty
            </p>
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
              Visit an arena and add Pokemon to your team!
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Browse Arenas
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map((pokemon) => (
              <div
                key={pokemon.id}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Type gradient background */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0]] || '#A8A878'} 0%, transparent 50%)`,
                  }}
                />

                <div className="relative">
                  {/* Pokemon Image */}
                  <Link href={`/pokemon/${pokemon.id}`}>
                    <div className="mx-auto h-24 w-24">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                        alt={pokemon.name}
                        width={96}
                        height={96}
                        className="object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                  </Link>

                  {/* Pokemon Info */}
                  <div className="mt-2 text-center">
                    <Link href={`/pokemon/${pokemon.id}`}>
                      <h3 className="text-lg font-semibold capitalize text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400">
                        {pokemon.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-zinc-400">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </p>

                    {/* Types */}
                    <div className="mt-2 flex justify-center gap-1">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: TYPE_COLORS[type] || '#A8A878' }}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                      <span className="text-zinc-500">HP</span>
                      <span className="ml-1 font-medium text-zinc-700 dark:text-zinc-300">
                        {pokemon.stats.hp}
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                      <span className="text-zinc-500">ATK</span>
                      <span className="ml-1 font-medium text-zinc-700 dark:text-zinc-300">
                        {pokemon.stats.attack}
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                      <span className="text-zinc-500">DEF</span>
                      <span className="ml-1 font-medium text-zinc-700 dark:text-zinc-300">
                        {pokemon.stats.defense}
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                      <span className="text-zinc-500">SPD</span>
                      <span className="ml-1 font-medium text-zinc-700 dark:text-zinc-300">
                        {pokemon.stats.speed}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromRoster(pokemon.id)}
                    className="mt-4 w-full rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: MAX_ROSTER_SIZE - roster.length }).map((_, i) => (
              <Link
                key={`empty-${i}`}
                href="/"
                className="flex h-full min-h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div className="text-center">
                  <span className="text-3xl text-zinc-300 dark:text-zinc-700">+</span>
                  <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600">
                    Add Pokemon
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
