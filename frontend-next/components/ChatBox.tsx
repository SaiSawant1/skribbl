"use client";

import { useEffect, useRef, useState } from "react";

export type ChatMessagePayload = {
  userName: string;
  data: {
    userName: string;
    message: string;
    time: Date;
  };
  type: string;
};

interface ChatBoxProps {
  messages: ChatMessagePayload[];
  onSendMessage: (message: string) => void;
  isDrawing: boolean;
}

export default function ChatBox(
  { messages, onSendMessage, isDrawing }: ChatBoxProps,
) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
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
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
          >
            <span className="font-medium">{msg.userName}:</span>
            <span>{msg.data.message}</span>
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
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isDrawing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
