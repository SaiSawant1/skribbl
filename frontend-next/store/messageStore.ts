import { CanvasPayload, ChatMessagePayload, PlayerRank } from "@/types";
import { createStore, StoreApi } from "zustand/vanilla";

export type MessageState = {
  chatMessages: ChatMessagePayload[];
  canvasMessage: CanvasPayload | null;
  positions: PlayerRank[];
};

export type MessageActions = {
  setChatMessages: (msg: ChatMessagePayload) => void;
  setCanvasMessage: (msg: CanvasPayload) => void;
  setPositions: (newPositions: PlayerRank[]) => void;
};

export type MessageStore = MessageState & MessageActions;

export const defaultInitState: MessageState = {
  chatMessages: [],
  canvasMessage: null,
  positions: [],
};

export const createMessageStore = (
  initState: MessageState = defaultInitState,
): StoreApi<MessageStore> => {
  return createStore<MessageStore>((set) => ({
    ...initState,
    setChatMessages: (msg) =>
      set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
    setCanvasMessage: (msg) => set({ canvasMessage: msg }),
    setPositions: (newPositions: PlayerRank[]) =>
      set({ positions: newPositions }),
  }));
};
