'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TYPE_COLORS } from '@/app/lib/pokeapi';
import { addToLeaderboard } from '@/app/lib/leaderboard';

// ============ INTERFACES ============

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

// Waqar's Stats System
type BattleStats = {
  wins: number;
  losses: number;
  xp: number;
  score: number;  // Added: persist score across sessions
};

type BattleResult = 'win' | 'loss';

const initialStats: BattleStats = {
  wins: 0,
  losses: 0,
  xp: 0,
  score: 0,
};

// Maximum score - reaching this means "Game Completed"
const MAX_SCORE = 2000;

// Arena types that count for badge progress
const ARENA_TYPES = ['fire', 'water', 'electric', 'grass', 'psychic', 'rock', 'ice', 'dragon'];

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
  const router = useRouter();

  // Battle State
  const [roster, setRoster] = useState<RosterPokemon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [battleState, setBattleState] = useState<BattleState>('select');
  const [playerPokemon, setPlayerPokemon] = useState<BattlePokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<BattlePokemon | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);

  // Champion Badge State
  const [playedArenas, setPlayedArenas] = useState<string[]>([]);
  const [showChampionBadge, setShowChampionBadge] = useState(false);

  // Waqar's Stats State
  const [stats, setStats] = useState<BattleStats>(initialStats);
  const [showModal, setShowModal] = useState(false);
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);
  const [showGameCompleted, setShowGameCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pokemon-roster');
    const savedBadges = localStorage.getItem('pokemon-badges');
    const savedStats = localStorage.getItem('pokemon-battle-stats');
    const savedUsername = localStorage.getItem('pokemon-username');
    setRoster(saved ? JSON.parse(saved) : []);
    setPlayedArenas(savedBadges ? JSON.parse(savedBadges) : []);
    const parsedStats = savedStats ? JSON.parse(savedStats) : initialStats;
    setStats(parsedStats);
    setScore(parsedStats.score || 0);  // Load score from stats
    setUsername(savedUsername || 'Anonymous');
    setIsLoaded(true);
  }, []);

  // ============ WAQAR'S STATS SYSTEM ============

  async function handleBattleResult(result: BattleResult) {
    const scoreDelta = result === 'win' ? 100 : -50;
    const xpGain = result === 'win' ? 30 : 10; // XP always goes up

    // Calculate raw score (might be over MAX_SCORE if cheating)
    const rawScore = Math.max(0, score + scoreDelta);

    // Send RAW score to server first - let server detect cheating!
    // Server will catch scores > 2000 and log to Hall of Shame
    if (username) {
      const isChampion = playedArenas.length >= 8;
      const isWinner = rawScore >= MAX_SCORE && rawScore <= MAX_SCORE; // Only winner if exactly at max, not over
      await addToLeaderboard({ username, score: rawScore, xp: stats.xp + xpGain, isChampion, isWinner });
    }

    // Now cap score for local display (after server got the raw value)
    const newScore = Math.min(rawScore, MAX_SCORE);
    const isWinner = newScore >= MAX_SCORE && score < MAX_SCORE;

    const newStats = {
      wins: result === 'win' ? stats.wins + 1 : stats.wins,
      losses: result === 'loss' ? stats.losses + 1 : stats.losses,
      xp: stats.xp + xpGain,
      score: newScore,  // Save capped score locally
    };

    setScore(newScore);
    setStats(newStats);
    localStorage.setItem('pokemon-battle-stats', JSON.stringify(newStats));
    setLastResult(result);

    // Show Game Completed modal if player just reached max score legitimately
    if (isWinner) {
      setShowGameCompleted(true);
    } else {
      setShowModal(true);
    }
  }

  // ============ CHAMPION BADGE SYSTEM ============

  const markArenasPlayed = (pokemonTypes: string[]) => {
    const currentBadges = JSON.parse(localStorage.getItem('pokemon-badges') || '[]');
    const newArenas = pokemonTypes.filter(type =>
      ARENA_TYPES.includes(type) && !currentBadges.includes(type)
    );

    if (newArenas.length > 0) {
      const updatedBadges = [...currentBadges, ...newArenas];
      localStorage.setItem('pokemon-badges', JSON.stringify(updatedBadges));
      setPlayedArenas(updatedBadges);

      if (updatedBadges.length >= 8 && currentBadges.length < 8) {
        setShowChampionBadge(true);
      }
    }
  };

  // ============ BATTLE LOGIC ============

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

    const playerFirst = player.stats.speed >= opponent.stats.speed;
    setIsPlayerTurn(playerFirst);

    setBattleLog([
      { message: `A wild ${opponent.name.toUpperCase()} appeared!`, type: 'system' },
      { message: `Go, ${player.name.toUpperCase()}!`, type: 'system' },
      { message: playerFirst ? 'You move first!' : 'Opponent moves first!', type: 'system' },
    ]);

    setIsAnimating(false);

    if (!playerFirst) {
      setTimeout(() => opponentAttack(player, opponent), 1000);
    }
  };

  const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon): number => {
    const baseDamage = Math.max(1, attacker.stats.attack - defender.stats.defense / 2);
    const randomFactor = 0.85 + Math.random() * 0.3;
    const criticalHit = Math.random() < 0.1 ? 1.5 : 1;
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
      setTimeout(() => {
        setBattleLog(prev => [...prev, {
          message: `${opponentPokemon.name.toUpperCase()} fainted! +100 points!`,
          type: 'system'
        }]);
        setBattleState('victory');
        setIsAnimating(false);

        // Track arena + stats
        markArenasPlayed(playerPokemon.types);
        handleBattleResult('win');
      }, 500);
    } else {
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
      setTimeout(() => {
        setBattleLog(prev => [...prev, {
          message: `${player.name.toUpperCase()} fainted! -50 points!`,
          type: 'system'
        }]);
        setBattleState('defeat');
        setIsAnimating(false);

        // Track arena + stats (participation counts!)
        markArenasPlayed(player.types);
        handleBattleResult('loss');
      }, 500);
    } else {
      setIsPlayerTurn(true);
      setIsAnimating(false);
    }
  };

  const continueBattle = async () => {
    if (!playerPokemon) return;
    setShowModal(false);
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
    setShowModal(false);
    setBattleState('select');
    setPlayerPokemon(null);
    setOpponentPokemon(null);
    setBattleLog([]);
    // Score is NOT reset - it persists across battles
    setIsPlayerTurn(true);
  };

  const viewLeaderboard = () => {
    router.push('/leaderboard');
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
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Battle Arena</h1>
          {/* Stats Display */}
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">Wins: {stats.wins}</span>
            <span className="text-red-600">Losses: {stats.losses}</span>
            <span className="font-bold text-blue-600">Score: {score}</span>
            <span className="text-yellow-600">XP: {stats.xp}</span>
          </div>
        </div>

        {/* Score is displayed in the header stats */}

        {/* Select Pokemon */}
        {battleState === 'select' && (
          <div className="mt-8">
            {/* Arena Progress - Above Roster */}
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Arena Progress: {playedArenas.length}/8
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {ARENA_TYPES.map(type => (
                  <span
                    key={type}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      playedArenas.includes(type)
                        ? 'text-white'
                        : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-700'
                    }`}
                    style={playedArenas.includes(type) ? { backgroundColor: TYPE_COLORS[type] } : {}}
                  >
                    {playedArenas.includes(type) ? '✓ ' : ''}{type}
                  </span>
                ))}
              </div>
            </div>

            {roster.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg text-zinc-500">Your roster is empty!</p>
                <p className="mt-2 text-sm text-zinc-400">Add Pokemon to your roster first.</p>
                <Link href="/" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
                  Browse Arenas
                </Link>
              </div>
            ) : (
              <>
                {/* Fight with Random Button */}
                <button
                  onClick={() => startBattle(roster[Math.floor(Math.random() * roster.length)])}
                  className="mb-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-5 text-xl font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
                >
                  🎲 Fight with Random Pokemon!
                </button>

                <p className="mb-4 text-zinc-500 dark:text-zinc-400">Or choose your Pokemon:</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {roster.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => startBattle(pokemon)}
                      className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                          alt={pokemon.name}
                          width={64}
                          height={64}
                          className="transition-transform group-hover:scale-110"
                        />
                        <div>
                          <h3 className="font-semibold capitalize text-zinc-900 dark:text-zinc-100">{pokemon.name}</h3>
                          <div className="mt-1 flex gap-1">
                            {pokemon.types.map((type) => (
                              <span key={type} className="rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: TYPE_COLORS[type] }}>{type}</span>
                            ))}
                          </div>
                          <p className="mt-1 text-xs text-zinc-400">HP: {pokemon.stats.hp} | ATK: {pokemon.stats.attack}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Battle Arena */}
        {(battleState === 'battle' || battleState === 'victory' || battleState === 'defeat') && playerPokemon && opponentPokemon && (
          <div className="mt-8">
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-b from-sky-100 to-green-100 p-6 dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-900">
              <div className="grid grid-cols-2 gap-8">
                {/* Opponent */}
                <div className="text-center">
                  <div className="mb-2 rounded-lg bg-white/80 p-2 dark:bg-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize text-zinc-900 dark:text-zinc-100">{opponentPokemon.name}</span>
                      <span className="text-sm text-zinc-500">{opponentPokemon.currentHp}/{opponentPokemon.maxHp}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={`h-full transition-all duration-300 ${getHpBarColor(opponentPokemon.currentHp, opponentPokemon.maxHp)}`}
                        style={{ width: `${(opponentPokemon.currentHp / opponentPokemon.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${opponentPokemon.id}.png`}
                    alt={opponentPokemon.name}
                    width={150}
                    height={150}
                    className={`mx-auto ${battleState === 'victory' ? 'opacity-30 grayscale' : ''}`}
                  />
                </div>

                {/* Player */}
                <div className="text-center">
                  <div className="mb-2 rounded-lg bg-white/80 p-2 dark:bg-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize text-zinc-900 dark:text-zinc-100">{playerPokemon.name}</span>
                      <span className="text-sm text-zinc-500">{playerPokemon.currentHp}/{playerPokemon.maxHp}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={`h-full transition-all duration-300 ${getHpBarColor(playerPokemon.currentHp, playerPokemon.maxHp)}`}
                        style={{ width: `${(playerPokemon.currentHp / playerPokemon.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${playerPokemon.id}.png`}
                    alt={playerPokemon.name}
                    width={150}
                    height={150}
                    className={`mx-auto ${battleState === 'defeat' ? 'opacity-30 grayscale' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div className="mt-4 h-32 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              {battleLog.map((log, i) => (
                <p
                  key={i}
                  className={`text-sm ${
                    log.type === 'player' ? 'text-blue-600 dark:text-blue-400' :
                    log.type === 'opponent' ? 'text-red-600 dark:text-red-400' :
                    'text-zinc-500'
                  }`}
                >
                  {log.message}
                </p>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              {battleState === 'battle' && (
                <button
                  onClick={playerAttack}
                  disabled={!isPlayerTurn || isAnimating}
                  className={`flex-1 rounded-xl py-4 text-lg font-bold transition-all ${
                    isPlayerTurn && !isAnimating
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700'
                  }`}
                >
                  {isPlayerTurn ? '⚔️ Attack!' : 'Opponent attacking...'}
                </button>
              )}

              {battleState === 'victory' && !showModal && (
                <>
                  <button
                    onClick={continueBattle}
                    className="flex-1 rounded-xl bg-green-500 py-4 text-lg font-bold text-white hover:bg-green-600"
                  >
                    🎯 Continue Battle
                  </button>
                  <button
                    onClick={viewLeaderboard}
                    className="rounded-xl border border-zinc-300 px-6 py-4 font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    🏆 View Leaderboard
                  </button>
                </>
              )}

              {battleState === 'defeat' && !showModal && (
                <button
                  onClick={resetBattle}
                  className="flex-1 rounded-xl bg-blue-500 py-4 text-lg font-bold text-white hover:bg-blue-600"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Waqar's Result Modal */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <div className="mx-4 max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Battle Result
              </h2>
              <p className="mt-4 text-lg">
                Result:{' '}
                <span className={lastResult === 'win' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
                  {lastResult?.toUpperCase()}
                </span>
              </p>
              <div className="mt-4 space-y-1">
                <p>Wins: {stats.wins}</p>
                <p>Losses: {stats.losses}</p>
                <p>Score: {score}</p>
                <p>Total XP: {stats.xp}</p>
              </div>
              <div className="mt-6 flex gap-3">
                {lastResult === 'win' && (
                  <>
                    <button
                      onClick={continueBattle}
                      className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
                    >
                      Continue
                    </button>
                    <button
                      onClick={viewLeaderboard}
                      className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 font-medium text-black hover:bg-yellow-400"
                    >
                      🏆 View Leaderboard
                    </button>
                  </>
                )}
                {lastResult === 'loss' && (
                  <button
                    onClick={resetBattle}
                    className="flex-1 rounded-lg bg-zinc-200 px-4 py-2 font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Champion Badge Modal */}
        {showChampionBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="mx-4 max-w-md animate-bounce rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-1">
              <div className="rounded-xl bg-zinc-900 p-8 text-center">
                <div className="text-6xl">🏆</div>
                <h2 className="mt-4 text-3xl font-bold text-yellow-400">CHAMPION!</h2>
                <p className="mt-2 text-lg text-zinc-300">You&apos;ve battled in all 8 arenas!</p>
                <p className="mt-1 text-sm text-zinc-400">You are now a true Pokemon Champion!</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {ARENA_TYPES.map(type => (
                    <span
                      key={type}
                      className="rounded-full px-3 py-1 text-sm font-medium text-white"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowChampionBadge(false)}
                  className="mt-6 rounded-lg bg-yellow-500 px-8 py-3 font-bold text-black transition-colors hover:bg-yellow-400"
                >
                  Awesome! 🎉
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Completed Modal - Reached Max Score */}
        {showGameCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="mx-4 max-w-md rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-1">
              <div className="rounded-xl bg-zinc-900 p-8 text-center">
                <div className="text-6xl">🏅</div>
                <h2 className="mt-4 text-3xl font-bold text-green-400">GAME COMPLETED!</h2>
                <p className="mt-2 text-lg text-zinc-300">You&apos;ve reached the maximum score!</p>
                <p className="mt-1 text-sm text-zinc-400">{MAX_SCORE} points - You&apos;re a true Pokemon Master!</p>
                <div className="mt-4 rounded-lg bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Final Stats:</p>
                  <p className="text-xl font-bold text-green-400">{stats.wins} Wins · {stats.xp} XP</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowGameCompleted(false);
                      setShowModal(true);
                    }}
                    className="flex-1 rounded-lg bg-zinc-700 px-4 py-3 font-medium text-white hover:bg-zinc-600"
                  >
                    Continue Playing
                  </button>
                  <button
                    onClick={() => {
                      setShowGameCompleted(false);
                      viewLeaderboard();
                    }}
                    className="flex-1 rounded-lg bg-green-500 px-4 py-3 font-bold text-black hover:bg-green-400"
                  >
                    🏆 Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        </main>
    </div>
  );
}
