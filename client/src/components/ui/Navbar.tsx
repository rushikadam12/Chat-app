import NvabarIcons from "@/utils/NavbarIcons";
import { SiGooglechat } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "./theme-provider";
const Navbar = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`h-screen fixed flex p-[0.2rem] flex-col  ${
        theme === "dark" ? "bg-slate-600" : "bg-slate-400"
      }`}
    >
      <nav className="w-fit flex justify-center  item-center gap-[4rem] flex-col item-center ">
        <label className="p-2 self-center hover:bg-slate-400 hover:cursor-pointer rounded-md">
          <SiGooglechat size={25} />
        </label>
        {NvabarIcons.map((item) => {
          return (
            <li className="w-fit flex flex-col items-center justify-center hover:bg-red-600 hover:cursor-pointer rounded-sm p-2">
              <item.element size={30} />
            </li>
          );
        })}
      </nav>

      <div className="h-full flex justify-center items-center flex-col gap-12">
        <ModeToggle />
        <Avatar className=" hover:cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
