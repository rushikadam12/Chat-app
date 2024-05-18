import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const UserChatProfile = () => {
  return (
    <>
      <div className="w-full p-1 border-b-2 hover:bg-slate-800">
        <div
          className="w-full grid-cols-2  
         flex gap-2"
        >
          <div className="s w-fit p-2">
            <Avatar className="h-[3.2rem] w-[3.2rem] ">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="userProfile_picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex px-4 w-full gap-2 flex-col">
            <div className=" flex justify-between w-full">
              <p className="text-lg font-semibold flex-1s">John Doe</p>
              <p className="text-md self-end text-slate-400">9:00AM</p>
            </div>

            <label className="w-full text text-slate-400">
              Hey!there I'm available
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserChatProfile;
