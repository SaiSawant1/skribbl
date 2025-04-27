import { z } from "zod";

/**
 * This will be Message that will handle chats and guess relative work
 */

export type ChatMessagePayload = {
  userName: string;
  data: {
    userName: string;
    message: string;
    time: Date;
  };
  type: string;
  isHidden: boolean;
};

export type CanvasPayload = {
  userName: string;
  data: {
    x: number;
    y: number;
    size: number;
    tool: string;
  };
  type: string;
  isHidden: boolean;
};

export type GameStateMessage = {
  word: string;
  type: string;
  currPlayer: string;
  roomId: string;
  maxPlayers: number;
  currentRound: number;
  maxRounds: number;
  wordLength: number;
  gameState: string;
  adminUserName: string;
};

/*
 * These message will be send by the server or to the server
 */

// type:"word:picked"
export type WordPickedPayload = {
  userName: string;
  word: string;
  type: string;
};

export type WordPickPayload = {
  userName: string;
  words: string[];
  type: string;
};

export const ConfigureFormScheam = z.object({
  maxPlayers: z.number().int().gte(4),
  wordLength: z.number().int().gte(4),
  maxRounds: z.number().int().gte(4),
});
