import React from 'react';
import { Card as CardType } from '../types/game';
import { Card } from './Card';

interface DealerHandProps {
  hand: CardType[];
  value: number;
  gameState: string;
}

export function DealerHand({ hand, value, gameState }: DealerHandProps) {
  const showAllCards = gameState === 'finished';
  
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
        <span className="text-4xl">🎩</span>
        <span>Dealer</span>
      </h2>
      
      <div className="flex justify-center gap-3 mb-6 min-h-[144px] items-center">
        {hand.length > 0 ? (
          hand.map((card, index) => (
            <Card
              key={index}
              card={card}
              hidden={index === 1 && !showAllCards}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-5xl mb-3">🃏</div>
            <div className="text-lg">Preparing cards...</div>
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white bg-gray-900/50 rounded-xl px-6 py-3 inline-block">
        Value: {showAllCards ? value : '?'}
      </div>
    </div>
  );
}