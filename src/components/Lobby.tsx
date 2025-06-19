import React, { useState } from 'react';
import { Plus, Users, Play } from 'lucide-react';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

export function Lobby({ onCreateGame, onJoinGame }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && gameId.trim()) {
      onJoinGame(gameId.trim(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-gold-400 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎰</div>
          <h1 className="text-4xl font-bold text-white mb-2">Blackjack</h1>
          <p className="text-gray-300">Multiplayer Card Game</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-800 text-white border-2 border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-400 transition-colors"
              maxLength={20}
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none"
            >
              <Plus className="w-5 h-5" />
              Create New Game
            </button>

            <div className="text-center">
              <span className="text-gray-400">or</span>
            </div>

            {!showJoinForm ? (
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Join Existing Game
              </button>
            ) : (
              <form onSubmit={handleJoinGame} className="space-y-4">
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="Game ID"
                  className="w-full bg-gray-800 text-white border-2 border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-400 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!playerName.trim() || !gameId.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:transform-none"
                  >
                    <Play className="w-4 h-4" />
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Share the Game ID with friends to play together!</p>
        </div>
      </div>
    </div>
  );
}