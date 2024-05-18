import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileLabel from "./ProfileLabel";
import { TbUserHexagon } from "react-icons/tb";
import { PiUserCircleGearFill } from "react-icons/pi";
import ProfileData from "@/utils/ProfileData";
import { useTheme } from "./theme-provider";
const Profile = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full h-full ">
      <div className="w-full border-b-2">
        <p className="text-lg p-1 flex item-center gap-2">
          <PiUserCircleGearFill size={25} />
          My profile
        </p>
      </div>
      <div className="w-full flex items-center justify-center p-2 border-b-2 flex-col gap-2">
        <Avatar className="h-[4rem] w-[4rem]">
          <AvatarImage src="https://github.com/shadcn.png" sizes="icon" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <label className="text-xl p-2 flex-row font-semibold ">John Doe</label>
        <p className="p-2 border-t-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
          provident, qui rem eaque nihil ex corrupti. Optio eveniet alias
          consectetur tempore? Vitae vero similique quaerat modi recusandae
          nulla vel fuga!
        </p>
      </div>

      <div className="w-full  flex items-center justify-center px-10 py-2 flex-col ">
        <p className="text-xl py-2 flex  items-center gap-1  self-start">
          <TbUserHexagon /> About
        </p>
        <div
          className={`w-[20rem] ${
            theme === "dark" ? "bg-slate-800" : "bg-slate-500"
          } rounded-md flex-1 p-3 flex flex-col gap-5`}
        >
          {ProfileData.map((item) => {
            return <ProfileLabel dataName={item.dataName} value={item.value} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
