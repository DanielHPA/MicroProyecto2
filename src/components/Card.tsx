import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  hidden?: boolean;
  className?: string;
}

export function Card({ card, hidden = false, className = '' }: CardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (hidden) {
    return (
      <div className={`relative w-24 h-36 bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-700 rounded-xl shadow-xl ${className}`}>
        <div className="absolute inset-3 bg-blue-800 rounded-lg opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-blue-300 rounded-lg opacity-40 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-300 rounded opacity-60"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className={`relative w-24 h-36 bg-white border-2 border-gray-300 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}>
      {/* Top left corner */}
      <div className="absolute top-2 left-2">
        <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-base ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
      
      {/* Bottom right corner (rotated) */}
      <div className="absolute bottom-2 right-2 transform rotate-180">
        <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-base ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
      
      {/* Center suit symbol */}
      <div className={`absolute inset-0 flex items-center justify-center text-4xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.suit}
      </div>
      
      {/* Card shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none"></div>
    </div>
  );
}