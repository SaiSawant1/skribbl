import { createStore, StoreApi } from "zustand/vanilla";

export type UserState = {
  userName: string;
  isGuessing: boolean;
  isWinner: boolean;
  word: string;
  isAdmin: boolean;
};

export type UserActions = {
  setUserName: (newUserName: string) => void;
  setIsGuessing: (b: boolean) => void;
  setIsWinner: () => void;
  setWord: (newWord: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  userName: "",
  isAdmin: false,
  isGuessing: false,
  isWinner: false,
  word: "",
};

export const createUserStore = (
  initState: UserState = defaultInitState,
): StoreApi<UserStore> => {
  return createStore<UserStore>((set) => ({
    ...initState,
    setUserName: (newUserName: string) => set({ userName: newUserName }),
    setIsGuessing: (b: boolean) => set({ isGuessing: b }),
    setIsWinner: () => set({ isWinner: true }), // Example of setIsWinner setting a boolean
    setWord: (newWord: string) => set({ word: newWord }),
    setIsAdmin: (isAdmin: boolean) => set({ isAdmin: isAdmin }),
  }));
};
