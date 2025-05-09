"use client";

import { useGameStore } from "./game-store-provider";
import { useMessageStore } from "./chat-message-store-provider";

export default function PlayersList() {
  const { currentPlayer } = useGameStore((state) => state);

  const { positions } = useMessageStore((state) => state);

  console.log(positions, currentPlayer);
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Players
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {positions.map((player) => (
          <div
            key={player.userName}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${player.userName === currentPlayer
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
          >
            <span className="text-green-600 dark:text-green-400 font-medium">
              {player.userName}:-{player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
