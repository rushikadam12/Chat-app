import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const AvatarBox = () => {
  return (
    <div
      className="p-2 py-5 
    "
    >
      <div className=" bg-slate-600  px-8  rounded-lg relative w-full text-center">
        <Avatar className="relative  bottom-3 h-[3rem] w-[3rem] ">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="userProfile_picture"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <label className="w-full text-md font-semibold ">John</label>
      </div>
    </div>
  );
};

export default AvatarBox;
