'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SpriteViewerProps {
  pokemonId: number;
  pokemonName: string;
}

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function SpriteViewer({ pokemonId, pokemonName }: SpriteViewerProps) {
  const [isShiny, setIsShiny] = useState(false);

  // Auto-rotate between normal and shiny
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShiny((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getArtworkUrl = (): string => {
    return isShiny
      ? `${SPRITE_BASE}/other/official-artwork/shiny/${pokemonId}.png`
      : `${SPRITE_BASE}/other/official-artwork/${pokemonId}.png`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Artwork Display */}
      <div className="relative">
        <div className="relative h-64 w-64">
          <Image
            src={getArtworkUrl()}
            alt={`${pokemonName} ${isShiny ? 'shiny' : ''}`}
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Shiny sparkle effect */}
        {isShiny && (
          <div className="absolute -right-2 -top-2 text-2xl animate-pulse">✨</div>
        )}
      </div>
    </div>
  );
}
