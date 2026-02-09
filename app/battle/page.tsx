"use client";

import { useState } from "react";

type BattleStats = {
  wins: number;
  losses: number;
  xp: number;
};

type BattleResult = "win" | "loss";

const initialStats: BattleStats = {
  wins: 0,
  losses: 0,
  xp: 0,
};

export default function BattlePage() {
  const [stats, setStats] = useState<BattleStats>(initialStats);
  const [showModal, setShowModal] = useState(false);
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);

  function handleBattleResult(result: BattleResult, xpDelta: number) {
    setStats(prev => ({
      wins: result === "win" ? prev.wins + 1 : prev.wins,
      losses: result === "loss" ? prev.losses + 1 : prev.losses,
      xp: Math.max(0, prev.xp + xpDelta),
    }));
    setLastResult(result);
    setShowModal(true);
  }

  // Temporary battle outcome simulation
  function finishBattle() {
    const isWin = Math.random() > 0.5;

    if (isWin) {
      handleBattleResult("win", 50);
    } else {
      handleBattleResult("loss", -20);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Battle
        </h1>

        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Choose a Pokémon from your roster and battle a random opponent.
        </p>

        <button
          className="mt-6 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={finishBattle}
        >
          Finish Battle
        </button>

        {showModal && (
          <div className="mt-6 max-w-sm rounded bg-white p-4 shadow dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Battle Result
            </h2>

            <p className="mt-2 text-sm">
              Result:{" "}
              <span
                className={
                  lastResult === "win"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {lastResult?.toUpperCase()}
              </span>
            </p>

            <p className="mt-2">Wins: {stats.wins}</p>
            <p>Losses: {stats.losses}</p>
            <p>XP: {stats.xp}</p>

            <button
              className="mt-4 rounded bg-zinc-200 px-3 py-1 text-sm hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
