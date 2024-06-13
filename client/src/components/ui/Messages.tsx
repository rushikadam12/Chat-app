import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserMessageMenu from "./UserMessageMenu";
import { MdSearch } from "react-icons/md";
import { Fragment, useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import useChatStore from "@/Zustand/useChatStore";
import useUserIdStore from "@/Zustand/useUserIdStore";
import MessageLeft from "./messageLeft";
import MessageRight from "./messageRight";
import useSocketStore from "@/Zustand/useSocketStore";
import {
  SendMessageReq,
  fetchChatReq,
  fetchMessageReq,
} from "@/Api call/AxiosInstance";
import useUserProfileStore from "@/Zustand/useUserPofileStore";
import { User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
const Messages = () => {
  const [click, setOnClick] = useState<boolean>(false);
  const [UserMessage, setUserMessage] = useState<string>("");
  const [showMessage, setShowUserMessage] = useState<string[]>([]);
  const { userProfile } = useUserProfileStore();
  const { userId } = useUserIdStore();
  const { chatId, setChatId } = useChatStore();

  const {
    sendMessage,
    receiveMessage,
    mountJoinChatEvent,
    removeMessageListener,
  } = useSocketStore();

  const messageHandler = (data: any[]) => {
    console.log("Received messages:", data);
    setShowUserMessage((prev) => [...prev, ...data]);
    console.log(showMessage);
  };

  const fetchSendMessage = async (UserMessage: string) => {
    try {
      if (!userId) {
        return console.log("value is null");
      }
      const resp = await SendMessageReq(chatId, UserMessage);
      if (resp.status === 200) {
        setUserMessage("");
        return resp.data.data;
      }
    } catch (error) {
      return error;
    }
  };
  const sendMessageMutate = useMutation({
    mutationFn: (UserMessage: string) => fetchSendMessage(UserMessage),
    onSuccess: (data) => {
      setShowUserMessage((prev) => [...prev, data]);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const fetchChats = async () => {
    try {
      const resp = await fetchChatReq(userId);
      console.log(await resp.data);
      setChatId(await resp.data.data._id);
      mountJoinChatEvent(resp.data.data._id);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMessages = async () => {
    try {
      const resp = await fetchMessageReq(chatId);
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
  }, [chatId]);

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

  useEffect(() => {
    receiveMessage(messageHandler);
    return () => {
      removeMessageListener(messageHandler);
    };
  }, []);

  return (
    <>
      <div className="relative w-full h-full">
        {/* user avatar */}
        <div
          className={
            showMessage.length === 0
              ? "hidden"
              : "p-4 bg-slate-800 w-full flex border-2 "
          }
        >
          <div className="w-full flex gap-2">
            <Avatar className={"h-[2.2rem] w-[2.2rem] "}>
              <AvatarImage
                src={userProfile?.avatar}
                alt="userProfile_picture"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <label className="text-lg self-center ">
              {userProfile?.username}
            </label>
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
        <div className="h-[80%] w-full p-2 flex flex-col gap-2 overflow-scroll  py-5 hideScrollBar hide_scroll_bar">
          {/* message display section */}
          {showMessage.length === 0 && (
            <h1 className="text-xl  text-center text-slate-200">
              Start your chat
            </h1>
          )}
          {showMessage?.map((msg: any) => {
            if (msg.sender._id === userId) {
              // Render message sent by the current user on the right side
              return (
                <Fragment key={msg._id}>
                  <MessageLeft message={msg.content} />
                </Fragment>
              );
            } else {
              // Render message sent by other users on the left side
              return (
                <Fragment key={msg._id}>
                  <MessageRight message={msg.content} />
                </Fragment>
              );
            }
          })}
        </div>
        {/* message send bar */}
        <div className="w-full px-2 py-4 gap-2 flex border-2  max-w-full justify-between absolute   bottom-0 bg-slate-800">
          <input
            type="text"
            value={UserMessage}
            placeholder="Enter your message"
            className="p-2 rounded-md  bg-slate-700 outline-none flex-1"
            onChange={(e) => {
              setUserMessage(e.target.value);
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
              onClick={() => {
                sendMessage(UserMessage), sendMessageMutate.mutate(UserMessage);
              }}
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

function mountJoinChatEvent(chatId: string | null) {
  throw new Error("Function not implemented.");
}
// function mountJoinChatEvent(chatId: string | null) {
//   throw new Error("Function not implemented.");
// }
