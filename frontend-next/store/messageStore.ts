import { CanvasPayload, ChatMessagePayload } from "@/types";
import { createStore, StoreApi } from "zustand/vanilla";

export type MessageState = {
  chatMessages: ChatMessagePayload[];
  canvasMessage: CanvasPayload | null;
};

export type MessageActions = {
  setChatMessages: (msg: ChatMessagePayload) => void;
  setCanvasMessage: (msg: CanvasPayload) => void;
};

export type MessageStore = MessageState & MessageActions;

export const defaultInitState: MessageState = {
  chatMessages: [],
  canvasMessage: null,
};

export const createMessageStore = (
  initState: MessageState = defaultInitState,
): StoreApi<MessageStore> => {
  return createStore<MessageStore>((set) => ({
    ...initState,
    setChatMessages: (msg) =>
      set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
    setCanvasMessage: (msg) => set({ canvasMessage: msg }),
  }));
};
