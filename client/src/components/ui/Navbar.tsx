import NvabarIcons from "@/utils/NavbarIcons";
import { SiGooglechat } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "./theme-provider";
import useStore from "@/Zustand/Store";
import { useState } from "react";
import UserProfileOption from "./UserProfileOption";
import useAuthStore from "@/Zustand/useAuth";
const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { theme } = useTheme();
  const { MenuOption, setText } = useStore();
  const {User}=useAuthStore()
  
  return (
    <div
      className={`h-screen fixed flex p-[0.2rem] flex-col  ${
        theme === "dark" ? "bg-slate-600" : "bg-slate-400"
      }`}
    >
      <nav className="w-fit flex justify-center  item-center gap-[4rem] flex-col item-center ">
        <label className="p-3 self-center hover:bg-slate-400 hover:cursor-pointer rounded-md">
          <SiGooglechat size={25} />
        </label>
        {NvabarIcons.map((item, index) => {
          return (
            <li
              className={`w-fit flex flex-col items-center justify-center hover:bg-slate-500 hover:cursor-pointer rounded-sm p-2 self-center ${
                MenuOption === item.name ? "bg-slate-800" : "bg-transparent"
              }`}
              onClick={() => {
                setText(item.name);
              }}
            >
              <item.element key={index} size={30} />
            </li>
          );
        })}
      </nav>

      <div className="h-full flex justify-center items-center flex-col gap-14 ">
        <ModeToggle />
        <UserProfileOption>
          <Avatar
            className=" hover:cursor-pointer "
            onClick={() => setIsVisible(!isVisible)}
          >
            <AvatarImage src={User?.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </UserProfileOption>
      </div>
    </div>
  );
};

export default Navbar;
