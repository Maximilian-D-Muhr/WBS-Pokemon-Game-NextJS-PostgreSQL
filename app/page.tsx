'use client';

import { useState, useEffect } from 'react';
import { ARENAS } from '@/lib/arenas';
import { ArenaCard } from './components/ArenaCard';
import { UsernameForm } from './components/UsernameForm';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [completedArenas, setCompletedArenas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const savedUsername = localStorage.getItem('pokemon-username');
    const savedBadges = localStorage.getItem('pokemon-badges');

    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedBadges) {
      setCompletedArenas(JSON.parse(savedBadges));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pokemon-username');
    setUsername(null);
  };

  // Show loading while checking localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  // Show username form if not logged in
  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
        <UsernameForm onUsernameSet={setUsername} />
      </div>
    );
  }

  // Main game view
  const badgeCount = completedArenas.length;
  const totalArenas = ARENAS.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Pokemon Battle
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Welcome, <span className="font-medium text-zinc-700 dark:text-zinc-300">{username}</span>!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Change Name
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Your Progress
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {badgeCount === totalArenas
                  ? '🎉 You are the Pokemon Champion!'
                  : `Collect all ${totalArenas} badges to become Champion`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {badgeCount}/{totalArenas}
              </div>
              <div className="text-sm text-zinc-500">Badges</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${(badgeCount / totalArenas) * 100}%` }}
            />
          </div>
        </div>

        {/* Arena Grid */}
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Choose Your Arena
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARENAS.map((arena) => (
            <ArenaCard
              key={arena.id}
              arena={arena}
              isCompleted={completedArenas.includes(arena.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
