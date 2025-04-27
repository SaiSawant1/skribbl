import { createStore, StoreApi } from "zustand/vanilla";

export type GameState = {
  currentPlayer: string;
  currentRound: number;
  word: string;
  adminUserName: string;
  maxPlayers: number;
  maxRounds: number;
  wordLength: number;
  roomId: string;
  gameState: string;
};

export type GameActions = {
  setInfo: (info: GameState) => void;
  setWord: (newWord: string) => void;
  setGameState: (newGameState: string) => void;
  setRoomId: (newRoomId: string) => void;
};

export type GameStore = GameState & GameActions;

export const defaultInitState: GameState = {
  currentRound: 0,
  currentPlayer: "",
  word: "",
  adminUserName: "",
  maxPlayers: 4,
  maxRounds: 4,
  wordLength: 4,
  roomId: "",
  gameState: "WAITING",
};

export const createGameStore = (
  initState: GameState = defaultInitState,
): StoreApi<GameStore> => {
  return createStore<GameStore>((set) => ({
    ...initState,
    setInfo: (info: GameState) =>
      set({
        adminUserName: info.adminUserName,
        maxPlayers: info.maxPlayers,
        maxRounds: info.maxRounds,
        roomId: info.roomId,
        wordLength: info.wordLength,
        gameState: info.gameState,
        word: info.word,
        currentPlayer: info.currentPlayer,
        currentRound: info.currentRound,
      }),
    setWord: (newWord: string) => set({ word: newWord }),
    setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
    setGameState: (newGameState) => set({ gameState: newGameState }),
  }));
};
