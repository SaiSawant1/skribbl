"use client";

import { CanvasPayload, ChatMessagePayload } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "./useMessages";

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
  const { newMessage } = useMessages();
  const router = useRouter();

  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;
    if (!userName || !roomId) {
      setError("user name or roomId not found");
      return;
    }
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_GO_SERVER_WS}/ws?roomId=${roomId}&userName=${userName}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("web socket connected");
      setIsConnected(true);
      setError(undefined);
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log(msg);
      newMessage(msg);
    };

    socket.onclose = () => {
      setIsConnected(false);
      connectedRef.current = false;
      router.push("/start");
    };
  }, [roomId, userName, router, newMessage]);

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

  const onCanvasMessage = (
    x: number,
    y: number,
    type: string,
    size: number,
    tool: string,
  ) => {
    if (!userName) {
      return;
    }
    const msg: CanvasPayload = {
      userName: userName,
      type: "canvas",
      data: {
        x: x,
        y: y,
        type: type,
        size: size,
        tool: tool,
      },
      isHidden: false,
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  return { onCanvasMessage, isConnected, error, onSendMessage };
};
