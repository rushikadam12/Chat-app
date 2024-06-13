import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IAvailableUser } from "@/interfaces/AllUser";
import React from "react";
interface AvatarBoxI extends IAvailableUser {}
const AvatarBox: React.FC<AvatarBoxI> = ({ avatar, username }) => {
  return (
    <div
      className="p-2 py-5 
    "
    >
      <div className=" bg-slate-600  px-8  rounded-lg relative w-full text-center flex items-center flex-col">
        <Avatar className="relative  bottom-3 h-[3rem] w-[3rem] ">
          <AvatarImage src={avatar} alt="userProfile_picture" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <label className="min-w-fit text-md font-semibold truncate p-1">
          {username}
        </label>
      </div>
    </div>
  );
};

export default AvatarBox;
