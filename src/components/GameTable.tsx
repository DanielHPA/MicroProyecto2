import React from 'react';
import { GameState } from '../types/game';
import { DealerHand } from './DealerHand';
import { PlayerHand } from './PlayerHand';
import { GameActions } from './GameActions';
import { Copy, Check } from 'lucide-react';

interface GameTableProps {
  gameState: GameState;
  playerId: string;
  playerName: string;
  onHit: () => void;
  onStand: () => void;
  onStartGame: () => void;
}

export function GameTable({
  gameState,
  playerId,
  playerName,
  onHit,
  onStand,
  onStartGame
}: GameTableProps) {
  const [copied, setCopied] = React.useState(false);
  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const isHost = gameState.players[0]?.id === playerId;

  const copyGameId = () => {
    navigator.clipboard.writeText(gameState.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <span className="text-6xl">🎰</span>
            <span>Blackjack Table</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-gold-400 bg-gray-900/30 rounded-xl px-4 py-2 inline-flex">
            <span className="text-lg font-semibold">Game ID: {gameState.id.slice(0, 8)}</span>
            <button
              onClick={copyGameId}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy Game ID"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dealer Section */}
        <div className="bg-green-800/40 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-green-700/50 shadow-2xl">
          <DealerHand
            hand={gameState.dealerHand}
            value={gameState.dealerValue}
            gameState={gameState.gameState}
          />
        </div>

        {/* Game Actions */}
        <div className="mb-8">
          <GameActions
            gameState={gameState.gameState}
            playerStatus={currentPlayer?.status || 'waiting'}
            isHost={isHost}
            onStartGame={onStartGame}
            onHit={onHit}
            onStand={onStand}
            canPlay={!!currentPlayer}
          />
        </div>

        {/* Players Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {gameState.players.map((player, index) => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === playerId}
              isHost={index === 0}
              showCards={gameState.gameState === 'finished'}
            />
          ))}
        </div>

        {/* Game Status */}
        <div className="text-center">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 inline-block border border-gray-700">
            <div className="text-white font-bold text-xl mb-2">
              {gameState.gameState === 'waiting' && '⏳ Waiting for players...'}
              {gameState.gameState === 'playing' && '🎮 Game in progress'}
              {gameState.gameState === 'finished' && '🏆 Game finished'}
            </div>
            <div className="text-lg text-gray-300">
              Players: {gameState.players.length}/4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}