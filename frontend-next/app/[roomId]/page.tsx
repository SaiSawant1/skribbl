"use client";

import ChatBox, { ChatMessagePayload } from "@/components/ChatBox";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const { roomId } = useParams();
  const userName = localStorage.getItem("userName");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const socketRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef<boolean>(false);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;
    if (!userName || !roomId) {
      setError("user name or roomId not found");
      return;
    }
    const socket = new WebSocket(
      `ws://localhost:8080/ws?roomId=${roomId}&userName=${userName}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("web socket connected");
      setIsConnected(true);
      setError(undefined);
    };

    socket.onmessage = (e) => {
      console.log(e.data);
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    };

    socket.onclose = () => {
      console.log("socket closed");
      setIsConnected(false);
      connectedRef.current = false;
    };
  }, [roomId, userName]);

  const onSendMessag = (message: string) => {
    if (!userName) {
      return;
    }
    const msg: ChatMessagePayload = {
      userName: userName,
      type: "chat",
      data: { message: message, time: new Date(), userName: userName },
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col">
        <div>room id: {roomId}</div>
        <div>user name: {userName}</div>
        {isConnected == true ? <div>live</div> : <div>not live</div>}
        {error}
      </div>
      <div>
        <ChatBox
          onSendMessage={onSendMessag}
          isDrawing={false}
          messages={messages}
        />
      </div>
    </div>
  );
}
