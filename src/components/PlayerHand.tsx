import React from 'react';
import { Player } from '../types/game';
import { Card } from './Card';
import { Crown, Users } from 'lucide-react';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer?: boolean;
  isHost?: boolean;
  showCards?: boolean;
}

export function PlayerHand({ 
  player, 
  isCurrentPlayer = false, 
  isHost = false,
  showCards = false 
}: PlayerHandProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blackjack': return 'text-yellow-400';
      case 'bust': return 'text-red-400';
      case 'stand': return 'text-blue-400';
      case 'playing': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'blackjack': return 'BLACKJACK!';
      case 'bust': return 'BUST';
      case 'stand': return 'STAND';
      case 'playing': return 'PLAYING';
      default: return 'WAITING';
    }
  };

  return (
    <div className={`
      relative p-6 rounded-2xl border-2 transition-all duration-300
      ${isCurrentPlayer 
        ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/60 border-emerald-400 shadow-2xl shadow-emerald-400/30 scale-105' 
        : 'bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-600'
      }
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isHost && <Crown className="w-5 h-5 text-yellow-400" />}
            <span className="font-bold text-white text-lg">{player.name}</span>
            {isCurrentPlayer && (
              <div className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                YOU
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-bold">{player.chips}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(player.status)} bg-current/10`}>
          {getStatusText(player.status)}
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap justify-center mb-4 min-h-[144px] items-center">
        {player.hand.length > 0 ? (
          player.hand.map((card, index) => (
            <Card
              key={index}
              card={card}
              hidden={!showCards && !isCurrentPlayer}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            <div className="text-4xl mb-2">🃏</div>
            <div className="text-sm">Waiting for cards...</div>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <div className="text-xl font-bold text-white mb-1">
          {showCards || isCurrentPlayer ? (
            <>Hand Value: {player.handValue}</>
          ) : (
            <>Cards: {player.hand.length}</>
          )}
        </div>
        {player.bet > 0 && (
          <div className="text-sm text-yellow-400 font-semibold">
            Bet: {player.bet}
          </div>
        )}
      </div>
    </div>
  );
}