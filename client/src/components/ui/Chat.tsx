import { IoSearch } from "react-icons/io5";
import AvatarBox from "./avatarBox";
import UserChatProfile from "./UserChatProfile";
import { useQuery } from "@tanstack/react-query";
import { ChatList } from "@/Api call/AxiosInstance";
import { IAvailableUser } from "@/interfaces/AllUser";
import useUserIdStore from "@/Zustand/useUserIdStore";
import { Fragment } from "react";
import useUserProfileStore from "@/Zustand/useUserPofileStore";

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_DELETE_EVENT = "messageDeleted";
const Chat = () => {
  const { setUserId } = useUserIdStore();
  const { setUserAvatar } = useUserProfileStore();

  const FetchUsers = async () => {
    try {
      const resp = await ChatList();
      if (resp.status === 200) {
        console.log(await resp.data.data);

        return await resp.data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {
    data: availabelUsers,
    error,
    isLoading,
    isSuccess,
  } = useQuery<IAvailableUser[], Error>({
    queryKey: ["UserData"],
    queryFn: FetchUsers,
  });

  if (isLoading) {
    return (
      <>
        <h2>Loading...</h2>
      </>
    );
  }

  if (error) {
    console.log(error);
  }

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
            placeholder="Search users...."
          />
        </div>
        <div className="w-full overflow-x-auto flex hideScrollBar">
          {availabelUsers?.map((user: IAvailableUser) => {
            return (
              <Fragment key={user._id}>
                <AvatarBox {...user} />
              </Fragment>
            );
          })}
        </div>
        <label className="text-lg  p-2 font-semibold">Recent</label>
        <div className="w-full overflow-y-visible hideScrollBar ">
          {availabelUsers?.map((user: IAvailableUser, index: null | number) => {
            return (
              <Fragment key={user._id}>
                <li
                  className="w-full p-1 border-b-2 hover:bg-slate-800 list-none hover:cursor-pointer"
                  onClick={() => {
                    setUserId(user._id);
                    setUserAvatar(user);
                  }}
                >
                  <UserChatProfile
                    key={index}
                    avatar={user.avatar}
                    email={user.email}
                    username={user.username}
                    _id={user._id}
                  />
                </li>
              </Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Chat;
