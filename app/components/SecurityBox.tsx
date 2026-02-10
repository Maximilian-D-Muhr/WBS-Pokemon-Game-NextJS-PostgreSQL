'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SecurityBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
          isOpen
            ? 'w-full border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
            : 'border-zinc-200 bg-white hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900 dark:hover:bg-blue-950/30'
        }`}
      >
        <span className="text-xl">🔒</span>
        {isOpen && (
          <span className="font-semibold text-blue-800 dark:text-blue-300">
            Security Features
          </span>
        )}
        {isOpen && (
          <span className="ml-auto text-blue-600 dark:text-blue-400">▲</span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li>• SQL Injection protection (parameterized queries)</li>
            <li>• Input validation with Zod schema</li>
            <li>• Score limit detection (max 2000 per session)</li>
            <li>• XSS prevention (React auto-escaping)</li>
            <li>• Honeypot logging for suspicious activity</li>
            <li>
              • <Link href="/hall-of-shame" className="underline hover:text-blue-900 dark:hover:text-blue-200">
                🚨 Hall of Shame
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
