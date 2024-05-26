import Profile from "@/components/ui/Profile";
import GroupChat from "@/components/ui/GroupChat";
import Chat from "@/components/ui/Chat";
import Messages from "@/components/ui/Messages";

import useStore from "@/Zustand/Store";
import { MenuOptionType } from "@/Zustand/Store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useSocket } from "@/context/socketContext";

// import useChatStore from "@/Zustand/useChatStore";

// import useSocketStore from "@/Zustand/useSocketStore";
// import { initalConnection } from "@/context/socketContext";
const Home: React.FC = () => {
  const { MenuOption } = useStore();
  const { socket } = useSocket();

  // const { connect, disconnect } = useSocketStore();
  const MenuComponent: Record<MenuOptionType, JSX.Element> = {
    Chat: <Chat />,
    Group: <GroupChat />,
    User: <Profile />,
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("connect", () => {
      console.log("Client side socket connected with ID:" + socket.id);
    });

    // socket.on("joinChat", (chatId) => {
    //   console.log("Joined the chat with ID:", chatId);
    // });

    // socket.on("disconnect", () => {
    //   console.log("Client side socket disconnected");
    // });
    return () => {
      socket.off("connect");
      // socket.off("joinChat");
      // socket.off("disconnect");
    };
  }, []);
  // initalConnection();
  return (
    <div className="w-full h-screen flex px-1">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-sm overflow-scroll hideScrollBar  hide_scroll_bar scroll-smooth">
        {MenuOption && MenuComponent[MenuOption]}
      </div>
      <div className="w-full border-2 relative">
        <Messages />
      </div>
    </div>
  );
};

export default Home;
