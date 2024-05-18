import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserMessageMenu from "./UserMessageMenu";
import { MdSearch } from "react-icons/md";
import { useState } from "react";
import { ImAttachment } from "react-icons/im";
import { GrSend } from "react-icons/gr";
const Messages = () => {
  const [click, setOnClick] = useState<boolean>(false);

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
        {/* message send bar */}
        <div className="w-full px-2 py-4 gap-2 flex border-2  max-w-full justify-between absolute   bottom-0 bg-slate-800">
          <input
            type="text"
            placeholder="Enter your message"
            className="p-2 rounded-md  bg-slate-700 outline-none flex-1"
          />
          <div className="w-fit flex gap-5">
            <input type="file" id="file-btn" hidden />
            <label
              className="p-1 self-center hover:curser-pointer "
              htmlFor="file-btn"
            >
              <ImAttachment size={20} />
            </label>
            <button className="p-2 bg-slate-400 rounded-md outline-none">
              <GrSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
