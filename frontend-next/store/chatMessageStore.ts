import { ChatMessagePayload } from "@/types";
import { createStore, StoreApi } from "zustand/vanilla";

export type ChatMessageState = {
  messages: ChatMessagePayload[];
};

export type ChatMessageActions = {
  setChatMessages: (msg: ChatMessagePayload) => void;
};

export type ChatMessageStore = ChatMessageState & ChatMessageActions;

export const defaultInitState: ChatMessageState = {
  messages: [],
};

export const createChatMessageStore = (
  initState: ChatMessageState = defaultInitState,
): StoreApi<ChatMessageStore> => {
  return createStore<ChatMessageStore>((set) => ({
    ...initState,
    setChatMessages: (msg) =>
      set((state) => ({ messages: [...state.messages, msg] })),
  }));
};
