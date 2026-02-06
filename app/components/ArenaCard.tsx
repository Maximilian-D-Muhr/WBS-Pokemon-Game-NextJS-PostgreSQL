import Link from 'next/link';
import { Arena } from '@/app/lib/arenas';

interface ArenaCardProps {
  arena: Arena;
  isCompleted?: boolean;
}

export function ArenaCard({ arena, isCompleted = false }: ArenaCardProps) {
  return (
    <Link
      href={`/arena/${arena.id}`}
      className="group relative block h-52 overflow-hidden rounded-xl border-2 border-zinc-200 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundImage: `url(${arena.backgroundImage})` }}
      />

      {/* Gradient Overlay - more transparent to show images */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${arena.color}40 0%, ${arena.color}90 100%)`,
        }}
      />

      {/* Badge indicator */}
      {isCompleted && (
        <div className="absolute right-3 top-3 z-10">
          <span className="text-2xl drop-shadow-lg">🏆</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
        {/* Type icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur-sm transition-transform group-hover:scale-110">
          {getTypeEmoji(arena.type)}
        </div>

        {/* Type Label */}
        <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/90">
          {arena.typeLabel}
        </span>

        {/* Arena Name - Main Headline */}
        <h2 className="text-lg font-bold leading-tight text-white drop-shadow-md">
          {arena.name}
        </h2>

        {/* Gym Leader */}
        <span className="text-sm text-white/80">
          Leader: {arena.leader}
        </span>

        {/* Badge */}
        <div className="mt-1 text-xs font-medium text-white/70">
          {isCompleted ? (
            <span className="text-green-300">✓ {arena.badgeName}</span>
          ) : (
            <span>{arena.badgeName}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    psychic: '🔮',
    rock: '🪨',
    ice: '❄️',
    dragon: '🐉',
  };
  return emojis[type] || '❓';
}
