import Image from 'next/image';
import Link from 'next/link';
import { getPokemonIdFromUrl, getPokemonSpriteUrl } from '@/app/lib/pokeapi';

interface PokemonCardProps {
  name: string;
  url: string;
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  const id = getPokemonIdFromUrl(url);
  const spriteUrl = getPokemonSpriteUrl(id);

  return (
    <Link
      href={`/pokemon/${id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-24 w-24">
          <Image
            src={spriteUrl}
            alt={name}
            fill
            className="object-contain transition-transform group-hover:scale-110"
            sizes="96px"
          />
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          #{id.toString().padStart(3, '0')}
        </span>
        <h2 className="text-center font-medium capitalize text-zinc-900 dark:text-zinc-100">
          {name}
        </h2>
      </div>
    </Link>
  );
}
