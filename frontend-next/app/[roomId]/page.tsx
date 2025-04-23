"use client";

import ChatBox from "@/components/ChatBox";
import PlayersList from "@/components/PlayersList";
import DrawingCanvas from "@/components/DrawingCanvas";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useParams } from "next/navigation";

export default function GamePage() {
  const { error, isConnected, messages, onSendMessage } = useWebSocket();
  const { roomId } = useParams();
  const userName = localStorage.getItem("userName");
  if (!userName) {
    return;
  }

  // Temporary mock data for PlayersList
  const mockPlayers = [
    { position: 1, userName: userName || "You", score: 0, isDrawing: false },
    { position: 2, userName: "Player 2", score: 0, isDrawing: false },
  ];

  // Temporary mock functions for DrawingCanvas
  const handleDraw = () => { };
  const handleClear = () => { };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Room: {roomId}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Player: {userName}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${isConnected
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 flex gap-4">
        {/* Left Column - Players List */}
        <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <PlayersList players={mockPlayers} />
        </div>

        {/* Middle Column - Drawing Canvas */}
        <div className="w-2/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <DrawingCanvas
            isDrawing={false}
            onDraw={handleDraw}
            onClear={handleClear}
          />
        </div>

        {/* Right Column - Chat */}
        <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <ChatBox
            onSendMessage={onSendMessage}
            isDrawing={false}
            messages={messages}
            userName={userName}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}

