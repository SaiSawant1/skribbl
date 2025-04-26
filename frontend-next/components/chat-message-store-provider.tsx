"use client";

import {
  ChatMessageStore,
  createChatMessageStore,
} from "@/store/chatMessageStore";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ChatStoreStoreApi = ReturnType<typeof createChatMessageStore>;

export const ChatMessageStoreContext = createContext<
  ChatStoreStoreApi | undefined
>(
  undefined,
);

export interface ChatMessageStoreProviderProps {
  children: ReactNode;
}

export const ChatMessageStoreProvider = ({
  children,
}: ChatMessageStoreProviderProps) => {
  const storeRef = useRef<ChatStoreStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createChatMessageStore();
  }

  return (
    <ChatMessageStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatMessageStoreContext.Provider>
  );
};

export const useChatMessageStore = <T,>(
  selector: (store: ChatMessageStore) => T,
): T => {
  const chatMessageStoreContext = useContext(ChatMessageStoreContext);

  if (!chatMessageStoreContext) {
    throw new Error(`useUserStore must be used within GameStoreProvider`);
  }

  return useStore(chatMessageStoreContext, selector);
};
