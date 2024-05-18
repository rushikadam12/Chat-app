import Profile from "@/components/ui/Profile";
import GroupChat from "@/components/ui/GroupChat";
import Chat from "@/components/ui/Chat";
import Messages from "@/components/ui/Messages";
const Home: React.FC = () => {
  return (
    <div className="w-full h-screen flex px-1">
      <div className="w-full max-w-sm overflow-scroll hideScrollBar  hide_scroll_bar scroll-smooth">
        <Chat />
      </div>
      <div className="w-full border-2 relative">
        <Messages />
      </div>
    </div>
  );
};

export default Home;
