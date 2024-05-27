import { create } from "zustand";
import io, { Socket } from "socket.io-client";
interface SocketStore {
  socket: Socket;
  roomId: string;
  username: string;
  socketId: string;
  socketUsername: string;
  setRoomId: (roomId: string) => void;
  setUsername: (username: string) => void;
  setSocketId: (socketId: string) => void;
  setSocketUsername: (socketUsername: string) => void;
  mountJoinChatEvent: (chatId: string) => void;
  MessageReceived: (callback: (message: string) => void) => void;
}

let socket: Socket;

const useSocketStore = create<SocketStore>((set) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
  }

  return {
    socket,
    roomId: "",
    username: "",
    socketId: "",
    socketUsername: "",
    setRoomId: (roomId: string) => {
      set({ roomId });
    },
    setUsername: (username: string) => {
      set({ username });
    },
    setSocketId: (socketId: string) => {
      set({ socketId });
    },
    setSocketUsername: (socketUsername: string) => {
      set({ socketUsername });
    },
    mountJoinChatEvent: (chatId: string) => {
      socket.emit("joinChat", chatId, (response: string) => {
        console.log("user joined to chatId:" + response);
      });
    },
    MessageReceived: (callback) => {
      socket.on("messageReceived", callback);
    },
  };
});

export default useSocketStore;
