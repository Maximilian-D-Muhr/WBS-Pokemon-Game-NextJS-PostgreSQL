import { getLeaderboard } from '@/app/lib/leaderboard';
import SecurityBox from '@/app/components/SecurityBox';

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  xp: number;
  is_champion: boolean;
  is_winner: boolean;
  created_at: string;
}

// Arena type emojis for the champion badge animation
const ARENA_EMOJIS = ['🔥', '💧', '⚡', '🌿', '🔮', '🪨', '❄️', '🐉'];

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard() as LeaderboardEntry[];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <style>{`
        @keyframes emoji-cycle {
          0%, 10% { opacity: 1; }
          12.5%, 100% { opacity: 0; }
        }
        .arena-emoji {
          position: absolute;
          animation: emoji-cycle 8s infinite;
        }
        .arena-emoji:nth-child(1) { animation-delay: 0s; }
        .arena-emoji:nth-child(2) { animation-delay: 1s; }
        .arena-emoji:nth-child(3) { animation-delay: 2s; }
        .arena-emoji:nth-child(4) { animation-delay: 3s; }
        .arena-emoji:nth-child(5) { animation-delay: 4s; }
        .arena-emoji:nth-child(6) { animation-delay: 5s; }
        .arena-emoji:nth-child(7) { animation-delay: 6s; }
        .arena-emoji:nth-child(8) { animation-delay: 7s; }
      `}</style>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Leaderboard
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Top scores from all trainers
        </p>

        <div className="mt-8">
          {/* Leaderboard */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🏆 Top Trainers
            </h2>
            {leaderboard.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No scores yet. Be the first to battle!
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Trainer
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Score
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        XP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                              index === 0
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : index === 1
                                ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                                : index === 2
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'text-zinc-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                          <div className="flex items-center gap-2">
                            <span>{entry.username}</span>
                            {entry.is_winner && (
                              <span title="Game Completed - Max Score Reached!" className="text-green-500">🏅</span>
                            )}
                            {entry.is_champion && (
                              <>
                                <span title="Champion">👑</span>
                                <span className="relative inline-block w-5 h-5" title="Arena Champion - All 8 arenas completed!">
                                  {ARENA_EMOJIS.map((emoji, i) => (
                                    <span key={i} className="arena-emoji">{emoji}</span>
                                  ))}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-zinc-600 dark:text-zinc-400">
                          {entry.score.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-yellow-600 dark:text-yellow-400">
                          {entry.xp.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Security Info */}
        <SecurityBox />
      </main>
    </div>
  );
}
