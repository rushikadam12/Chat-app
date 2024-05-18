import { PiUserCircleGearFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { Button } from "./button";
import { RiGroupLine } from "react-icons/ri";
import GroupLabel from "./GroupLabel";

const GroupChat = () => {
  return (
    <>
      <div className="w-full">
        <div className="w-full border-b-2 p-2 flex">
          <p className="text-lg p-1 flex item-center gap-2 flex-1">
            <PiUserCircleGearFill size={25} />
            Group Chat
          </p>
          <Button className="bg-transparent outline-none">
            <RiGroupLine size={20} />
          </Button>
        </div>
        <div className="py-5 flex p-2 relative w-full gap-0">
          <button className="bg-slate-600 rounded-l-md self-center py-2 px-2 outline-none ">
            <IoSearch size={25} />
          </button>

          <input
            type="text"
            className="p-2 w-full min-h-[2rem] bg-slate-600 rounded-r-md outline-none"
            placeholder="Search groups...."
          />
        </div>
        <div className="w-full h<GroupLabel />-full px-10 flex flex-col gap-5">
          <GroupLabel />
          <GroupLabel />
          <GroupLabel />
          <GroupLabel />
        </div>
      </div>
    </>
  );
};

export default GroupChat;
