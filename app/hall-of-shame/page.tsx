import { getHallOfShame } from '@/app/lib/leaderboard';
import Link from 'next/link';
import Image from 'next/image';

interface ShameEntry {
  id: number;
  username: string;
  attempted_score: number;
  reason: string;
  ip_address: string | null;
  attempt_time: string;
}

export default async function HallOfShamePage() {
  const hallOfShame = await getHallOfShame() as ShameEntry[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-zinc-950 to-zinc-950">
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header with Claude Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/claude-logo.svg"
              alt="Claude"
              width={60}
              height={60}
              className="opacity-80"
            />
          </div>
          <p className="text-sm text-zinc-400">
            Security Audit made possible with{' '}
            <span className="font-semibold text-orange-400">Claude Code</span>
          </p>
        </div>

        <h1 className="text-3xl font-bold text-red-500">
          🚨 Hall of Shame
        </h1>
        <p className="mt-2 text-zinc-400">
          Caught cheating? You end up here forever.
        </p>

        <div className="mt-8">
          {hallOfShame.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
              <p className="text-6xl">🎉</p>
              <p className="mt-4 text-lg text-zinc-400">No cheaters caught... yet!</p>
              <p className="mt-2 text-sm text-zinc-500">Our security system is watching.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-red-900 bg-red-950/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-900 bg-red-900/30">
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-400">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-400">
                      Attempted Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-400">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-400">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-400">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hallOfShame.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-red-900/50 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-red-300">
                          {entry.username}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-red-400">
                        {entry.attempted_score.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-400/80">
                        {entry.reason.length > 60
                          ? entry.reason.slice(0, 60) + '...'
                          : entry.reason}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        {entry.ip_address || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {new Date(entry.attempt_time).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-semibold text-zinc-300">
            🔒 What gets you here?
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>• SQL Injection attempts (DROP TABLE, DELETE FROM, etc.)</li>
            <li>• Impossibly high scores (&gt;2000 per session)</li>
            <li>• XSS attacks (script tags, javascript: URLs)</li>
            <li>• Invalid data format manipulation</li>
          </ul>
        </div>

        {/* Back to Leaderboard */}
        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-block rounded-lg bg-zinc-800 px-6 py-3 font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            ← Back to Leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
