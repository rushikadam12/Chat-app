import { IoSearch } from "react-icons/io5";
import AvatarBox from "./avatarBox";
import UserChatProfile from "./UserChatProfile";
const Chat = () => {
  return (
    <>
      <div className="w-full h-full">
        <div className="w-full px-2">
          <p className="text-xl font-semibold ">Chats</p>
        </div>
        <div className="py-5 flex p-2 relative w-full gap-0 border-b-2">
          <button className="bg-slate-600 rounded-l-md self-center py-2 px-2 outline-none ">
            <IoSearch size={25} />
          </button>

          <input
            type="text"
            className="p-2 w-full min-h-[2rem] bg-slate-600 rounded-r-md outline-none"
            placeholder="Search groups...."
          />
        </div>
        <div className="w-full overflow-x-auto flex hideScrollBar">
          <AvatarBox />
          <AvatarBox />
          <AvatarBox />
          <AvatarBox />
        </div>
        <label className="text-lg  p-2 font-semibold">Recent</label>
        <div className="w-full overflow-y-visible hideScrollBar ">
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
          <UserChatProfile />
        </div>
      </div>
    </>
  );
};

export default Chat;
