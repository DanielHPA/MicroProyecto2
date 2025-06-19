import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { GameState } from './types/game';
import { Lobby } from './components/Lobby';
import { GameTable } from './components/GameTable';
import { Chat } from './components/Chat';
import { Wifi, WifiOff } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState('');
  const { connected, playerId, sendMessage, onMessage, offMessage } = useWebSocket('ws://localhost:8080');

  useEffect(() => {
    const handleGameCreated = (data: any) => {
      setGameState(data.gameState);
    };

    const handlePlayerJoined = (data: any) => {
      setGameState(data.gameState);
    };

    const handleGameStarted = (data: any) => {
      setGameState(data.gameState);
    };

    const handleGameUpdate = (data: any) => {
      setGameState(data.gameState);
    };

    const handleChatMessage = (data: any) => {
      if (gameState) {
        setGameState(prev => prev ? {
          ...prev,
          messages: [...prev.messages, data.message]
        } : null);
      }
    };

    const handleError = (data: any) => {
      alert(data.message);
    };

    onMessage('gameCreated', handleGameCreated);
    onMessage('playerJoined', handlePlayerJoined);
    onMessage('gameStarted', handleGameStarted);
    onMessage('gameUpdate', handleGameUpdate);
    onMessage('chatMessage', handleChatMessage);
    onMessage('error', handleError);

    return () => {
      offMessage('gameCreated');
      offMessage('playerJoined');
      offMessage('gameStarted');
      offMessage('gameUpdate');
      offMessage('chatMessage');
      offMessage('error');
    };
  }, [onMessage, offMessage, gameState]);

  const handleCreateGame = (name: string) => {
    setPlayerName(name);
    sendMessage({
      type: 'createGame',
      playerName: name
    });
  };

  const handleJoinGame = (gameId: string, name: string) => {
    setPlayerName(name);
    sendMessage({
      type: 'joinGame',
      gameId,
      playerName: name
    });
  };

  const handleStartGame = () => {
    if (gameState) {
      sendMessage({
        type: 'startGame',
        gameId: gameState.id
      });
    }
  };

  const handleHit = () => {
    if (gameState) {
      sendMessage({
        type: 'hit',
        gameId: gameState.id
      });
    }
  };

  const handleStand = () => {
    if (gameState) {
      sendMessage({
        type: 'stand',
        gameId: gameState.id
      });
    }
  };

  const handleSendMessage = (message: string) => {
    if (gameState) {
      sendMessage({
        type: 'chat',
        gameId: gameState.id,
        playerName,
        message
      });
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-center text-white">
          <WifiOff className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Connecting to Server...</h2>
          <p className="text-gray-300">Please wait while we establish connection</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return <Lobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
  }

  return (
    <>
      {/* Connection Status */}
      <div className="fixed top-4 left-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
          connected ? 'bg-green-600' : 'bg-red-600'
        } text-white text-sm font-medium`}>
          {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <GameTable
        gameState={gameState}
        playerId={playerId || ''}
        playerName={playerName}
        onHit={handleHit}
        onStand={handleStand}
        onStartGame={handleStartGame}
      />

      <Chat
        messages={gameState.messages}
        onSendMessage={handleSendMessage}
        playerName={playerName}
      />
    </>
  );
}

export default App;