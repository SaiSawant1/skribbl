'use client';

import { Player } from '@/types/websocket';

interface PlayersListProps {
  players: Player[];
}

export default function PlayersList({ players }: PlayersListProps) {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded ${
              player.isDrawing
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{player.name}</span>
              {player.isDrawing && (
                <span className="text-sm text-blue-600">(Drawing)</span>
              )}
            </div>
            <span className="text-green-600 font-medium">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 