import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserMessageMenu from "./UserMessageMenu";
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import useChatStore from "@/Zustand/useChatStore";
import useUserIdStore from "@/Zustand/useUserIdStore";
import { AxiosInstance } from "@/Api call/AxiosInstance";
import axios from "axios";
import React from "react";
import MessageLeft from "./messageLeft";
import MessageRight from "./messageRight";
// import useSocketStore from "@/Zustand/useSocketStore";
import { SocketProvider } from "@/context/socketContext";
const Messages = () => {
  const [click, setOnClick] = useState<boolean>(false);
  const [UserMessage, setUserMessage] = useState<string>("");
  const [showMessage, setShowUserMessage] = useState<any>([]);
  const [refetch, setrefetch] = useState<boolean>(false);
  const { userId } = useUserIdStore();
  const { chatId, setChatId } = useChatStore();
  // const { sendMessage, messages } = useSocketStore();

  const fetchSendMessage = async () => {
    try {
      if (!userId) {
        return console.log("value is null");
      }
      const resp = await AxiosInstance.post(
        `chat-app/messages/${chatId}`,
        { content: UserMessage },
        {
          withCredentials: true,
        }
      );

      if (resp.status === 200) {
        setrefetch(!refetch);
        console.log(await resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChats = async () => {
    try {
      const resp = await axios.post(
        `http://localhost:5121/api/v1/chat-app/chats/c/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(await resp.data);
      // setChatId(await resp.data.data._id);
    } catch (error) {
      // console.log(userId);
      console.log(error);
    }
  };
  const fetchMessages = async () => {
    try {
      const resp = await AxiosInstance.get(`chat-app/messages/${chatId}`, {
        withCredentials: true,
      });
      console.log(await resp.data);
      setShowUserMessage(resp.data.data);
    } catch (error) {
      console.log(chatId);
      console.log(error);
    }
  };

  useEffect(() => {
    async function callFetchMessage() {
      try {
        if (chatId) {
          await fetchMessages();
        }
      } catch (error) {
        console.log(error);
      }
    }
    callFetchMessage();
  }, [chatId, refetch]);

  useEffect(() => {
    async function CallFetch() {
      try {
        if (userId) {
          await fetchChats();
        }
      } catch (error) {
        console.log(error);
      }
    }
    CallFetch();
  }, [userId]);
  return (
    <>
      <div className="relative w-full h-full">
        {/* user avatar */}
        <div className="p-4 bg-slate-800 w-full flex border-2">
          <div className="w-full flex gap-2">
            <Avatar className="h-[2.2rem] w-[2.2rem] ">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="userProfile_picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <label className="text-lg self-center ">John Doe</label>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-full flex">
              <button
                className={`p-2  rounded-l-md hover:cursor-pointer ${
                  click && "bg-slate-600"
                }`}
                onClick={() => {
                  setOnClick(!click);
                }}
              >
                <MdSearch size={20} />
              </button>
              <input
                type="text"
                className={`bg-slate-500 outline-none rounded-r-md p-2 transition-all ${
                  click ? "visible " : "hidden"
                }`}
              />
            </label>

            <UserMessageMenu />
          </div>
        </div>
        <div className="h-[80%] w-full p-2 flex flex-col gap-2 overflow-scroll  py-5">
          {showMessage?.map((msg: any) => {
            if (msg.sender._id === userId) {
              // Render message sent by the current user on the right side
              return <MessageLeft message={msg.content} />;
            } else {
              // Render message sent by other users on the left side
              return <MessageRight message={msg.content} />;
            }
          })}
        </div>
        {/* message send bar */}
        <div className="w-full px-2 py-4 gap-2 flex border-2  max-w-full justify-between absolute   bottom-0 bg-slate-800">
          <input
            type="text"
            placeholder="Enter your message"
            className="p-2 rounded-md  bg-slate-700 outline-none flex-1"
            onChange={(e) => {
              setUserMessage(e.target.value);
              // sendMessage(UserMessage);
            }}
          />
          <div className="w-fit flex gap-5">
            <input type="file" id="file-btn" hidden />
            <label
              className="p-1 self-center hover:curser-pointer "
              htmlFor="file-btn"
            >
              <ImAttachment size={20} />
            </label>
            <button
              className="p-2 bg-slate-400 rounded-md outline-none"
              onClick={fetchSendMessage}
            >
              <GrSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
