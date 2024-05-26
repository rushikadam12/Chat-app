/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Function to establish a socket connection with authorization token
const getSocket = () => {
  // Create a socket connection with the provided URI and authentication
  return io("http://localhost:5121", {
    withCredentials: true,
    autoConnect: true,
  });
};

// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: ReturnType<typeof io> | null;
}>({
  socket: null,
});

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);

// SocketProvider component to manage the socket instance and provide it through context
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  // Set up the socket connection when the component mounts
  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // Connect the socket
    // Clean up the socket connection when the component unmounts
    // return () => {
    //    socketInstance.disconnect();
    // };
  }, []);

  return (
    // Provide the socket instance through context to its children
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Export the SocketProvider component and the useSocket hook for other components to use
export { SocketProvider, useSocket };

// import scoketIO from "socket.io-client";
// const ENDPOINT = "http://localhost:5121";
// let socket = scoketIO(ENDPOINT, {
//   withCredentials:true,
//   autoConnect: false,
// });

// export const initalConnection = () => {
//   socket.on("connect", () => {
//     console.log("connected:" + socket.id);
//   });
//   socket.on("disconnect", () => {
//     console.log("socket disconnected");
//   });
// };
