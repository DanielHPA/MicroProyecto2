export interface Card {
  suit: string;
  rank: string;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  handValue: number;
  bet: number;
  chips: number;
  status: 'waiting' | 'playing' | 'bust' | 'stand' | 'blackjack';
  isReady: boolean;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

export interface GameState {
  id: string;
  players: Player[];
  dealerHand: Card[];
  dealerValue: number;
  gameState: 'waiting' | 'playing' | 'finished';
  messages: ChatMessage[];
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}