import io, { Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket;
  roomId: string | null;
  username: string | null;
  socketId: string | null;
  socketUsername: string | null;
  // setRoomId: (roomId: string) => void;
  // setUsername: (username: string) => void;
  // setSocketId: (socketId: string) => void;
  // setSocketUsername: (socketUsername: string) => void;
  mountJoinChatEvent: (chatId: any) => void;
  sendMessage: (message: any) => void;
  receiveMessage: (handler: (message: any) => void) => void; // addMessageListener: (handler: (message: any) => void) => void;
  removeMessageListener: (handler: (message: any) => void) => void;
};
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  reconnectionAttempts: 2,
});
const useSocketStore = create<SocketStore>(() => ({
  socket,
  roomId: "",
  username: "",
  socketId: "",
  socketUsername: "",
  // setRoomId: (roomId) => set({ roomId }),
  // setUsername: (username) => set({ username }),
  // setSocketId: (socketId) => set({ socketId }),
  // setSocketUsername: (socketUsername) => set({ socketUsername }),

  mountJoinChatEvent: (chatId: string) => {
    socket.emit("joinChat", chatId);
  },

  sendMessage: (message) => {
    socket.emit("messageReceived", message);
  },
  receiveMessage: (handler) => {
    socket.on("messageReceived", handler)
  },


  removeMessageListener: (handler) => {
    socket.off("messageReceived", handler);
  },
}));

export default useSocketStore;
