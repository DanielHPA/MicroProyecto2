import React from 'react';
import { Play, Hand, Square } from 'lucide-react';

interface GameActionsProps {
  gameState: string;
  playerStatus: string;
  isHost: boolean;
  onStartGame: () => void;
  onHit: () => void;
  onStand: () => void;
  canPlay: boolean;
}

export function GameActions({
  gameState,
  playerStatus,
  isHost,
  onStartGame,
  onHit,
  onStand,
  canPlay
}: GameActionsProps) {
  if (gameState === 'waiting' && isHost) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onStartGame}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
      </div>
    );
  }

  if (gameState === 'playing' && canPlay && playerStatus === 'playing') {
    return (
      <div className="flex justify-center gap-4">
        <button
          onClick={onHit}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Hand className="w-5 h-5" />
          Hit
        </button>
        <button
          onClick={onStand}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Square className="w-5 h-5" />
          Stand
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400 mb-4">
          Game Finished!
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          New Game
        </button>
      </div>
    );
  }

  return null;
}