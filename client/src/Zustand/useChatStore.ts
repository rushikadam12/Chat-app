import { create } from "zustand";

interface IuseChatStore {
  chatId: string | null;
  setChatId: (newChatId: string) => void;
}

const useChatStore = create<IuseChatStore>((set) => ({
  setChatId: (newChatId) => set({ chatId: newChatId }),
  chatId: null,
}));

export default useChatStore;
