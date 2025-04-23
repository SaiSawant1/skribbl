"use client";

import { Player } from "@/hooks/useWebsocket";

interface PlayersListProps {
  players: Player[];
}

export default function PlayersList({ players }: PlayersListProps) {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Players
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {sortedPlayers.map((player) => (
          <div
            key={player.userName}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${player.isDrawing
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{player.userName}</span>
              {player.isDrawing && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  (Drawing)
                </span>
              )}
            </div>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

