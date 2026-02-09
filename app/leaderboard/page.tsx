import { getLeaderboard, getHallOfShame } from '@/app/lib/leaderboard';

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  xp: number;
  created_at: string;
}

interface ShameEntry {
  id: number;
  username: string;
  attempted_score: number;
  reason: string;
  attempt_time: string;
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard() as LeaderboardEntry[];
  const hallOfShame = await getHallOfShame() as ShameEntry[];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Leaderboard
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Top scores from all trainers
        </p>

        <div className={`mt-8 ${hallOfShame.length > 0 ? 'grid gap-8 lg:grid-cols-2' : ''}`}>
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
                          {entry.username}
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

          {/* Hall of Shame - Only show if there are cheaters */}
          {hallOfShame.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-red-600 dark:text-red-400">
                🚨 Hall of Shame
              </h2>
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                Caught cheating? You end up here!
              </p>
              <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-red-200 bg-red-100 dark:border-red-900 dark:bg-red-900/30">
                      <th className="px-4 py-3 text-left text-sm font-medium text-red-700 dark:text-red-400">
                        Cheater
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-red-700 dark:text-red-400">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hallOfShame.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-red-100 last:border-0 dark:border-red-900/50"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-red-800 dark:text-red-300">
                            {entry.username}
                          </span>
                          <p className="text-xs text-red-500">
                            Tried: {entry.attempted_score.toLocaleString()} pts
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                          {entry.reason.length > 50
                            ? entry.reason.slice(0, 50) + '...'
                            : entry.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">
            🔒 Security Features
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li>• SQL Injection protection (parameterized queries)</li>
            <li>• Input validation with Zod schema</li>
            <li>• Score limit detection (max {2000} per session)</li>
            <li>• XSS prevention (React auto-escaping)</li>
            <li>• Honeypot logging for suspicious activity</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
