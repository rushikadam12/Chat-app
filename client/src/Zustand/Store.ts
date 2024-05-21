import { create } from "zustand";

export type MenuOptionType = "Chat" | "Group" | "User";
interface StoreState {
  MenuOption: MenuOptionType;
  setText: (newText: MenuOptionType) => void;
}

const useStore = create<StoreState>((set) => ({
  MenuOption: "Chat",
  setText: (newText) => set({ MenuOption: newText }),
}));

export default useStore;
