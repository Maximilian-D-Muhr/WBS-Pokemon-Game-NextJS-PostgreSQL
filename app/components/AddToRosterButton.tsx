'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/lib/pokeapi';

interface AddToRosterButtonProps {
  pokemon: Pokemon;
}

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

export function AddToRosterButton({ pokemon }: AddToRosterButtonProps) {
  const [isInRoster, setIsInRoster] = useState(false);
  const [rosterFull, setRosterFull] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  useEffect(() => {
    const roster = getRoster();
    setIsInRoster(roster.some((p) => p.id === pokemon.id));
    setRosterFull(roster.length >= MAX_ROSTER_SIZE);
  }, [pokemon.id]);

  const getRoster = (): RosterPokemon[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pokemon-roster');
    return saved ? JSON.parse(saved) : [];
  };

  const saveRoster = (roster: RosterPokemon[]) => {
    localStorage.setItem('pokemon-roster', JSON.stringify(roster));
  };

  const addToRoster = () => {
    const roster = getRoster();

    if (roster.length >= MAX_ROSTER_SIZE) {
      setShowFeedback('Roster is full! (max 6 Pokemon)');
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    if (roster.some((p) => p.id === pokemon.id)) {
      setShowFeedback('Already in roster!');
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    const newPokemon: RosterPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      sprite: pokemon.sprites.front_default || '',
      stats: {
        hp: pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
        attack: pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
        defense: pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
        speed: pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
      },
    };

    roster.push(newPokemon);
    saveRoster(roster);
    setIsInRoster(true);
    setRosterFull(roster.length >= MAX_ROSTER_SIZE);
    setShowFeedback('Added to roster! ✓');
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const removeFromRoster = () => {
    const roster = getRoster().filter((p) => p.id !== pokemon.id);
    saveRoster(roster);
    setIsInRoster(false);
    setRosterFull(roster.length >= MAX_ROSTER_SIZE);
    setShowFeedback('Removed from roster');
    setTimeout(() => setShowFeedback(null), 2000);
  };

  return (
    <div className="space-y-2">
      {isInRoster ? (
        <button
          onClick={removeFromRoster}
          className="w-full rounded-xl border-2 border-red-200 bg-red-50 px-6 py-3 font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          ✓ In Roster - Click to Remove
        </button>
      ) : (
        <button
          onClick={addToRoster}
          disabled={rosterFull}
          className={`w-full rounded-xl px-6 py-3 font-medium transition-all ${
            rosterFull
              ? 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {rosterFull ? 'Roster Full (6/6)' : '+ Add to Roster'}
        </button>
      )}

      {/* Feedback message */}
      {showFeedback && (
        <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">
          {showFeedback}
        </p>
      )}
    </div>
  );
}
