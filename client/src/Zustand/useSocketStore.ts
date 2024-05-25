// import { create } from "zustand";

// import io from "socket.io-client";
// interface Message {
//   content: string;
//   sender: {
//     _id: string;
//     name: string;
//   };
// }

// interface SocketStore {
//   socket: any;
//   isConnected: boolean;
//   connect: () => void;
//   disconnect: () => void;
//   sendMessage: (message: string) => void;
//   messages: Message[];
// }

// const ChatEventEnum = Object.freeze({
//   CONNECT_EVENT: "connect",
//   DISCONNECT_EVENT: "disconnect",
//   JOIN_EVENT: "joinChat",
//   NEW_CHAT_EVENT: "newChat",
//   MESSAGE_RECEIVED_EVENT: "messageReceived",
//   SOCKET_EVENT: "socketError",
//   LEAVE_CHAT_EVENT: "leaveChat",
// });

// const useSocketStore = create<SocketStore>((set) => {
//   let socket: any;

//   const connect = () => {
//     if (socket && socket.connected) {
//       return; // Already connected
//     }

//     socket = io("http://localhost:5122", {
//       withCredentials: true,
//     });
//     socket.connect()
//     socket.on(ChatEventEnum.CONNECT_EVENT, () => {
//       console.log("Socket connected with ID:", socket?.id);
//       set({ socket, isConnected: true });
//     });
//      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
//        console.log("Socket connected with ID:", socket?.id);
//        set({ socket:null, isConnected: false });
//      });
//   };

//   const disconnect = () => {
//     set((state) => {
//       const { socket } = state;
//       if (socket) {
//         socket.disconnect();
//       }
//       return { socket: null, isConnected: false };
//     });
//   };

//   const sendMessage = (message: string) => {
//     set((state) => {
//       const { socket } = state;
//       if (socket) {
//         socket.emit(ChatEventEnum.NEW_CHAT_EVENT, message);
//       }
//       return state;
//     });
//   };

//   return {
//     socket: null,
//     isConnected: false,
//     messages: [],
//     connect,
//     disconnect,
//     sendMessage,
//   };
// });

// export default useSocketStore;
