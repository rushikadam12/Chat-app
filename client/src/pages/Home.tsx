import Profile from "@/components/ui/Profile";
import GroupChat from "@/components/ui/GroupChat";
import Chat from "@/components/ui/Chat";
import Messages from "@/components/ui/Messages";

import useStore from "@/Zustand/Store";
import { MenuOptionType } from "@/Zustand/Store"; 
import { Toaster } from "sonner";
const Home: React.FC = () => {
  const { MenuOption } = useStore();
  const MenuComponent: Record<MenuOptionType, JSX.Element> = {
    Chat: <Chat />,
    Group: <GroupChat />,
    User: <Profile />,
  };

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
