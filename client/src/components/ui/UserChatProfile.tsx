import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserIdStore from "@/Zustand/useUserIdStore";
import { IAvailableUser } from "@/interfaces/AllUser";
import { useEffect, useMemo } from "react";

const UserChatProfile: React.FC<IAvailableUser> = ({
  avatar,
  username,
  email,
  _id,
}) => {
  // const { userId, setUserId } = useUserIdStore();

  return (
    <>
      <div
        className="w-full grid-cols-2  
         flex gap-2"
      >
        <div className="s w-fit p-2">
          <Avatar className="h-[3.2rem] w-[3.2rem] ">
            <AvatarImage src={avatar} alt="userProfile_picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex px-4 w-full gap-2 flex-col">
          <div className=" flex justify-between w-full">
            <p className="text-lg font-semibold flex-1s">{username}</p>
            <p className="text-md self-end text-slate-400">9:00AM</p>
          </div>
          <p className="w-full text text-slate-400">Hey!there I'm available</p>
        </div>
      </div>
    </>
  );
};

export default UserChatProfile;
