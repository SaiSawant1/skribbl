"use client";

import { createMessageStore, MessageStore } from "@/store/messageStore";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type messageStoreStoreApi = ReturnType<typeof createMessageStore>;

export const MessageStoreContext = createContext<
  messageStoreStoreApi | undefined
>(
  undefined,
);

export interface MessageStoreProviderProps {
  children: ReactNode;
}

export const MessageStoreProvider = ({
  children,
}: MessageStoreProviderProps) => {
  const storeRef = useRef<messageStoreStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createMessageStore();
  }

  return (
    <MessageStoreContext.Provider value={storeRef.current}>
      {children}
    </MessageStoreContext.Provider>
  );
};

export const useMessageStore = <T,>(
  selector: (store: MessageStore) => T,
): T => {
  const messageStoreContext = useContext(MessageStoreContext);

  if (!messageStoreContext) {
    throw new Error(`useUserStore must be used within GameStoreProvider`);
  }

  return useStore(messageStoreContext, selector);
};
