"use client";

import { useMessageStore } from "@/components/chat-message-store-provider";
import { useGameStore } from "@/components/game-store-provider";
import { useUserStore } from "@/components/user-store-provider";
import {
  CanvasPayload,
  ChatMessagePayload,
  GameStateMessage,
  PositionsMessage,
} from "@/types";

export const useMessages = () => {
  const { setChatMessages, setPositions, setCanvasMessage } = useMessageStore((
    state,
  ) => state);
  const { setIsGuessing, setIsAdmin, userName } = useUserStore((state) =>
    state
  );
  const { setInfo } = useGameStore(
    (state) => state,
  );

  const newMessage = (
    data:
      | ChatMessagePayload
      | GameStateMessage
      | CanvasPayload
      | PositionsMessage,
  ) => {
    switch (data.type) {
      case "chat":
        const msg = data as ChatMessagePayload;
        setChatMessages(msg);
        break;
      case "game:state":
        const gameStateInfo = data as GameStateMessage;
        setInfo({
          adminUserName: gameStateInfo.adminUserName,
          gameState: gameStateInfo.gameState,
          maxPlayers: gameStateInfo.maxPlayers,
          maxRounds: gameStateInfo.maxRounds,
          roomId: gameStateInfo.roomId,
          wordLength: gameStateInfo.wordLength,
          currentPlayer: gameStateInfo.currentPlayer,
          word: gameStateInfo.word,
          currentRound: gameStateInfo.currentRound,
        });
        if (gameStateInfo.adminUserName === userName) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        if (gameStateInfo.currentPlayer === userName) {
          setIsGuessing(false);
          console.log(false);
        } else {
          setIsGuessing(true);
        }
        break;
      case "canvas":
        const canvasMsg = data as CanvasPayload;
        console.log(canvasMsg);
        setCanvasMessage(canvasMsg);
        break;
      case "player:rank":
        const playload = data as PositionsMessage;
        console.log(playload.positions);
        setPositions(playload.positions);
        break;
      default:
        break;
    }
  };

  return { newMessage };
};
