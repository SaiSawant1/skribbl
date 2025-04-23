// src/providers/counter-store-provider.tsx
"use client";

import { createUserStore, UserStore } from "@/store/userStore";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const CounterStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const UserStoreProvider = ({
  children,
}: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createUserStore();
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useUserStore = <T,>(
  selector: (store: UserStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useUserStore must be used within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
