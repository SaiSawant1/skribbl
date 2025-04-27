"use client";

import { useChatMessageStore } from "@/components/chat-message-store-provider";
import { useGameStore } from "@/components/game-store-provider";
import { useUserStore } from "@/components/user-store-provider";
import { ChatMessagePayload, GameStateMessage } from "@/types";

export const useMessages = () => {
  const { setChatMessages } = useChatMessageStore((state) => state);
  const { setIsGuessing, setIsAdmin } = useUserStore((state) => state);
  const { setInfo } = useGameStore(
    (state) => state,
  );

  const newMessage = (data: ChatMessagePayload | GameStateMessage) => {
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
          currentPlayer: gameStateInfo.currPlayer,
          word: gameStateInfo.word,
          currentRound: gameStateInfo.currentRound,
        });
        setIsGuessing(true);
        setIsAdmin(false);
        break;
    }
  };

  return { newMessage };
};
