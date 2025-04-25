// src/providers/counter-store-provider.tsx
"use client";

import { createGameStore, GameStore } from "@/store/gameStore";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type GameStoreApi = ReturnType<typeof createGameStore>;

export const GameStoreContext = createContext<GameStoreApi | undefined>(
  undefined,
);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const GameStoreProvider = ({
  children,
}: UserStoreProviderProps) => {
  const storeRef = useRef<GameStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createGameStore();
  }

  return (
    <GameStoreContext.Provider value={storeRef.current}>
      {children}
    </GameStoreContext.Provider>
  );
};

export const useGameStore = <T,>(
  selector: (store: GameStore) => T,
): T => {
  const gameStoreContext = useContext(GameStoreContext);

  if (!gameStoreContext) {
    throw new Error(`useUserStore must be used within GameStoreProvider`);
  }

  return useStore(gameStoreContext, selector);
};
