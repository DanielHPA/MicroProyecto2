import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// Game state
const games = new Map();
const players = new Map();

// Card deck
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return shuffleDeck(deck);
}

function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCardValue(card) {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  
  for (const card of hand) {
    const cardValue = getCardValue(card);
    value += cardValue;
    if (card.rank === 'A') aces++;
  }
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
}

function createGame(gameId, hostId) {
  return {
    id: gameId,
    hostId,
    players: new Map(),
    deck: createDeck(),
    dealerHand: [],
    gameState: 'waiting', // waiting, playing, finished
    currentPlayerIndex: 0,
    messages: []
  };
}

function addPlayerToGame(gameId, playerId, playerName) {
  const game = games.get(gameId);
  if (!game) return false;
  
  if (game.players.size >= 4) return false; // Max 4 players
  
  game.players.set(playerId, {
    id: playerId,
    name: playerName,
    hand: [],
    bet: 0,
    chips: 1000,
    status: 'waiting', // waiting, playing, bust, stand, blackjack
    isReady: false
  });
  
  return true;
}

function dealCard(game) {
  if (game.deck.length === 0) {
    game.deck = createDeck();
  }
  return game.deck.pop();
}

function startGame(gameId) {
  const game = games.get(gameId);
  if (!game) return;
  
  game.gameState = 'playing';
  game.currentPlayerIndex = 0;
  
  // Deal initial cards
  const playerIds = Array.from(game.players.keys());
  
  // Deal 2 cards to each player
  for (let i = 0; i < 2; i++) {
    for (const playerId of playerIds) {
      const player = game.players.get(playerId);
      player.hand.push(dealCard(game));
      player.status = 'playing';
    }
    game.dealerHand.push(dealCard(game));
  }
  
  // Check for blackjacks
  for (const [playerId, player] of game.players) {
    if (calculateHandValue(player.hand) === 21) {
      player.status = 'blackjack';
    }
  }
}

function playerHit(gameId, playerId) {
  const game = games.get(gameId);
  if (!game) return;
  
  const player = game.players.get(playerId);
  if (!player || player.status !== 'playing') return;
  
  player.hand.push(dealCard(game));
  const handValue = calculateHandValue(player.hand);
  
  if (handValue > 21) {
    player.status = 'bust';
  } else if (handValue === 21) {
    player.status = 'blackjack';
  }
}

function playerStand(gameId, playerId) {
  const game = games.get(gameId);
  if (!game) return;
  
  const player = game.players.get(playerId);
  if (!player || player.status !== 'playing') return;
  
  player.status = 'stand';
}

function checkGameEnd(gameId) {
  const game = games.get(gameId);
  if (!game) return false;
  
  const activePlayers = Array.from(game.players.values()).filter(
    p => p.status === 'playing'
  );
  
  return activePlayers.length === 0;
}

function finishGame(gameId) {
  const game = games.get(gameId);
  if (!game) return;
  
  // Dealer plays
  while (calculateHandValue(game.dealerHand) < 17) {
    game.dealerHand.push(dealCard(game));
  }
  
  const dealerValue = calculateHandValue(game.dealerHand);
  
  // Determine winners
  for (const [playerId, player] of game.players) {
    const playerValue = calculateHandValue(player.hand);
    
    if (player.status === 'bust') {
      // Player loses
      continue;
    }
    
    if (player.status === 'blackjack' && dealerValue !== 21) {
      player.chips += Math.floor(player.bet * 1.5);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
      player.chips += player.bet;
    } else if (playerValue === dealerValue) {
      // Push - return bet
    } else {
      // Player loses
    }
  }
  
  game.gameState = 'finished';
}

function broadcastToGame(gameId, message) {
  const game = games.get(gameId);
  if (!game) return;
  
  for (const [playerId, player] of game.players) {
    const ws = players.get(playerId);
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

function getGameState(gameId) {
  const game = games.get(gameId);
  if (!game) return null;
  
  return {
    id: game.id,
    players: Array.from(game.players.values()).map(p => ({
      ...p,
      hand: p.hand,
      handValue: calculateHandValue(p.hand)
    })),
    dealerHand: game.dealerHand,
    dealerValue: calculateHandValue(game.dealerHand),
    gameState: game.gameState,
    messages: game.messages
  };
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'join':
          const playerId = uuidv4();
          players.set(playerId, ws);
          ws.playerId = playerId;
          ws.send(JSON.stringify({
            type: 'joined',
            playerId: playerId
          }));
          break;
          
        case 'createGame':
          const gameId = uuidv4();
          const game = createGame(gameId, ws.playerId);
          games.set(gameId, game);
          addPlayerToGame(gameId, ws.playerId, message.playerName);
          
          ws.send(JSON.stringify({
            type: 'gameCreated',
            gameId: gameId,
            gameState: getGameState(gameId)
          }));
          break;
          
        case 'joinGame':
          const success = addPlayerToGame(message.gameId, ws.playerId, message.playerName);
          if (success) {
            broadcastToGame(message.gameId, {
              type: 'playerJoined',
              gameState: getGameState(message.gameId)
            });
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Could not join game'
            }));
          }
          break;
          
        case 'startGame':
          startGame(message.gameId);
          broadcastToGame(message.gameId, {
            type: 'gameStarted',
            gameState: getGameState(message.gameId)
          });
          break;
          
        case 'hit':
          playerHit(message.gameId, ws.playerId);
          if (checkGameEnd(message.gameId)) {
            finishGame(message.gameId);
          }
          broadcastToGame(message.gameId, {
            type: 'gameUpdate',
            gameState: getGameState(message.gameId)
          });
          break;
          
        case 'stand':
          playerStand(message.gameId, ws.playerId);
          if (checkGameEnd(message.gameId)) {
            finishGame(message.gameId);
          }
          broadcastToGame(message.gameId, {
            type: 'gameUpdate',
            gameState: getGameState(message.gameId)
          });
          break;
          
        case 'chat':
          const gameForChat = games.get(message.gameId);
          if (gameForChat) {
            const chatMessage = {
              id: uuidv4(),
              playerId: ws.playerId,
              playerName: message.playerName,
              message: message.message,
              timestamp: Date.now()
            };
            gameForChat.messages.push(chatMessage);
            broadcastToGame(message.gameId, {
              type: 'chatMessage',
              message: chatMessage
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws.playerId) {
      players.delete(ws.playerId);
    }
  });
});

console.log(`WebSocket server running on port ${PORT}`);