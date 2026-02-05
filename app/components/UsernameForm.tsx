'use client';

import { useState, useEffect } from 'react';

interface UsernameFormProps {
  onUsernameSet: (username: string) => void;
}

export function UsernameForm({ onUsernameSet }: UsernameFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (trimmed.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Save to localStorage for now (will be DB later)
    localStorage.setItem('pokemon-username', trimmed);
    onUsernameSet(trimmed);
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Welcome, Trainer!
      </h2>
      <p className="mb-6 text-center text-zinc-500 dark:text-zinc-400">
        Enter your name to start your journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="Your trainer name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          Start Adventure
        </button>
      </form>
    </div>
  );
}
