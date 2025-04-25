import { createStore, StoreApi } from "zustand/vanilla";

export type GameState = {
  adminUserName: string;
  maxPlayers: number;
  maxRounds: number;
  wordLength: number;
  roomId: string;
  gameState: string;
};

export type GameActions = {
  setInfo: (info: GameState) => void;
};

export type GameStore = GameState & GameActions;

export const defaultInitState: GameState = {
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
      }),
  }));
};
