"use client";

import { ChatMessagePayload } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type Player = {
  userName: string;
  score: number;
  position: number;
  isDrawing: boolean;
};

export const useWebSocket = (userName: string) => {
  const { roomId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const socketRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef<boolean>(false);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const router = useRouter();

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
      router.push("/start");
    };
  }, [roomId, userName, router]);

  const onSendMessage = (message: string) => {
    if (!userName) {
      return;
    }
    const msg: ChatMessagePayload = {
      userName: userName,
      type: "chat",
      data: { message: message, time: new Date(), userName: userName },
      isHidden: false,
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  return { isConnected, messages, error, onSendMessage };
};
