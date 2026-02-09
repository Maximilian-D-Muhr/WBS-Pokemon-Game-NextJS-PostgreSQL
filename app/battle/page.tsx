'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TYPE_COLORS } from '@/app/lib/pokeapi';

interface RosterPokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

interface BattlePokemon extends RosterPokemon {
  currentHp: number;
  maxHp: number;
}

type BattleState = 'select' | 'battle' | 'victory' | 'defeat';

interface BattleLog {
  message: string;
  type: 'player' | 'opponent' | 'system';
}

// Random Pokemon IDs for opponents (Gen 1-4, excluding legendaries)
const OPPONENT_POOL = [
  // Gen 1
  3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49,
  51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94,
  97, 99, 101, 103, 105, 106, 107, 108, 110, 112, 113, 114, 115, 117, 119, 121,
  122, 123, 124, 125, 126, 127, 128, 130, 131, 132, 134, 135, 136, 137, 139, 141,
  // Gen 2
  154, 157, 160, 162, 164, 166, 168, 169, 171, 176, 178, 181, 182, 184, 185, 186,
  189, 190, 195, 196, 197, 199, 200, 203, 205, 206, 208, 210, 211, 212, 213, 214,
  217, 219, 221, 224, 225, 226, 227, 229, 230, 232, 234, 235, 237, 241, 242,
  // Gen 3
  254, 257, 260, 262, 264, 267, 269, 272, 275, 277, 279, 282, 284, 286, 289, 291,
  292, 295, 297, 301, 302, 303, 306, 308, 310, 311, 312, 314, 317, 319, 321, 323,
  324, 326, 327, 330, 332, 334, 335, 336, 337, 338, 340, 342, 344, 346, 348, 350,
  351, 352, 354, 357, 358, 359, 362, 365, 367, 368, 369, 370,
  // Gen 4
  389, 392, 395, 398, 400, 402, 405, 407, 409, 411, 413, 414, 416, 417, 419, 421,
  423, 424, 426, 428, 429, 430, 432, 435, 437, 441, 442, 446, 448, 450, 452, 454,
  455, 457, 458, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472,
  473, 474, 475, 476, 477
];

export default function BattlePage() {
  const [roster, setRoster] = useState<RosterPokemon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [battleState, setBattleState] = useState<BattleState>('select');
  const [playerPokemon, setPlayerPokemon] = useState<BattlePokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<BattlePokemon | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('pokemon-roster');
    setRoster(saved ? JSON.parse(saved) : []);
    setIsLoaded(true);
  }, []);

  const generateOpponent = async (): Promise<BattlePokemon> => {
    const randomId = OPPONENT_POOL[Math.floor(Math.random() * OPPONENT_POOL.length)];

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await res.json();

    const hp = data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'hp')?.base_stat || 50;

    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: { type: { name: string } }) => t.type.name),
      sprite: data.sprites.front_default,
      stats: {
        hp,
        attack: data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'attack')?.base_stat || 50,
        defense: data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'defense')?.base_stat || 50,
        speed: data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'speed')?.base_stat || 50,
      },
      currentHp: hp,
      maxHp: hp,
    };
  };

  const startBattle = async (pokemon: RosterPokemon) => {
    setIsAnimating(true);
    setBattleLog([{ message: 'Finding opponent...', type: 'system' }]);

    const player: BattlePokemon = {
      ...pokemon,
      currentHp: pokemon.stats.hp,
      maxHp: pokemon.stats.hp,
    };

    const opponent = await generateOpponent();

    setPlayerPokemon(player);
    setOpponentPokemon(opponent);
    setBattleState('battle');

    // Determine who goes first based on speed
    const playerFirst = player.stats.speed >= opponent.stats.speed;
    setIsPlayerTurn(playerFirst);

    setBattleLog([
      { message: `A wild ${opponent.name.toUpperCase()} appeared!`, type: 'system' },
      { message: `Go, ${player.name.toUpperCase()}!`, type: 'system' },
      { message: playerFirst ? 'You move first!' : 'Opponent moves first!', type: 'system' },
    ]);

    setIsAnimating(false);

    // If opponent goes first, trigger their attack
    if (!playerFirst) {
      setTimeout(() => opponentAttack(player, opponent), 1000);
    }
  };

  const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon): number => {
    // Base damage formula with some randomness
    const baseDamage = Math.max(1, attacker.stats.attack - defender.stats.defense / 2);
    const randomFactor = 0.85 + Math.random() * 0.3; // 85% - 115%
    const criticalHit = Math.random() < 0.1 ? 1.5 : 1; // 10% crit chance
    return Math.floor(baseDamage * randomFactor * criticalHit);
  };

  const playerAttack = () => {
    if (!playerPokemon || !opponentPokemon || isAnimating || !isPlayerTurn) return;

    setIsAnimating(true);
    const damage = calculateDamage(playerPokemon, opponentPokemon);
    const newOpponentHp = Math.max(0, opponentPokemon.currentHp - damage);

    setBattleLog(prev => [...prev, {
      message: `${playerPokemon.name.toUpperCase()} deals ${damage} damage!`,
      type: 'player'
    }]);

    setOpponentPokemon({ ...opponentPokemon, currentHp: newOpponentHp });

    if (newOpponentHp <= 0) {
      // Victory!
      setTimeout(() => {
        const earnedScore = Math.floor(opponentPokemon.maxHp + opponentPokemon.stats.attack);
        setScore(prev => prev + earnedScore);
        setBattleLog(prev => [...prev, {
          message: `${opponentPokemon.name.toUpperCase()} fainted! You earned ${earnedScore} points!`,
          type: 'system'
        }]);
        setBattleState('victory');
        setIsAnimating(false);
      }, 500);
    } else {
      // Opponent's turn
      setIsPlayerTurn(false);
      setTimeout(() => {
        opponentAttack(playerPokemon, { ...opponentPokemon, currentHp: newOpponentHp });
      }, 1000);
    }
  };

  const opponentAttack = (player: BattlePokemon, opponent: BattlePokemon) => {
    if (!player || !opponent) return;

    const damage = calculateDamage(opponent, player);
    const newPlayerHp = Math.max(0, player.currentHp - damage);

    setBattleLog(prev => [...prev, {
      message: `${opponent.name.toUpperCase()} deals ${damage} damage!`,
      type: 'opponent'
    }]);

    setPlayerPokemon({ ...player, currentHp: newPlayerHp });

    if (newPlayerHp <= 0) {
      // Defeat
      setTimeout(() => {
        setBattleLog(prev => [...prev, {
          message: `${player.name.toUpperCase()} fainted!`,
          type: 'system'
        }]);
        setBattleState('defeat');
        setIsAnimating(false);
      }, 500);
    } else {
      // Player's turn
      setIsPlayerTurn(true);
      setIsAnimating(false);
    }
  };

  const continueBattle = async () => {
    if (!playerPokemon) return;

    setIsAnimating(true);
    setBattleLog([{ message: 'Finding new opponent...', type: 'system' }]);

    const opponent = await generateOpponent();
    setOpponentPokemon(opponent);
    setBattleState('battle');

    const playerFirst = playerPokemon.stats.speed >= opponent.stats.speed;
    setIsPlayerTurn(playerFirst);

    setBattleLog([
      { message: `A wild ${opponent.name.toUpperCase()} appeared!`, type: 'system' },
      { message: playerFirst ? 'You move first!' : 'Opponent moves first!', type: 'system' },
    ]);

    setIsAnimating(false);

    if (!playerFirst) {
      setTimeout(() => opponentAttack(playerPokemon, opponent), 1000);
    }
  };

  const resetBattle = () => {
    setBattleState('select');
    setPlayerPokemon(null);
    setOpponentPokemon(null);
    setBattleLog([]);
    setScore(0);
    setIsPlayerTurn(true);
  };

  const getHpBarColor = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent > 50) return 'bg-green-500';
    if (percent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Battle
        </h1>

        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Choose a Pokémon from your roster and battle a random opponent..
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
