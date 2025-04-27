"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useChatMessageStore } from "./chat-message-store-provider";
import { useUserStore } from "./user-store-provider";

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  isDrawing: boolean;
  userName: string;
}

export default function ChatBox(
  { onSendMessage, isDrawing, userName }: ChatBoxProps,
) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatMessageStore((state) => state);
  const { isGuessing } = useUserStore((state) => state);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Chat
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 flex flex-col justify-end">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded-lg   dark:bg-red-700",
              userName === msg.userName &&
              "flex justify-end dark:bg-violet-400",
            )}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {msg.userName}:
            </span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {msg.data.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDrawing ? "You're drawing..." : "Type your guess..."}
          disabled={isDrawing}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={!isGuessing}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
