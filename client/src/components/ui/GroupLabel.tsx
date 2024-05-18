import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const GroupLabel = () => {
  return (
    <div className="w-full h-full flex items-center  gap-4 p-2 rounded-md ">
      <Avatar>
        <AvatarFallback className="bg-slate-600 text-red-300">
          CN
        </AvatarFallback>
      </Avatar>
      <label className="text-lg font-semibold self-center ">#General</label>
    </div>
  );
};

export default GroupLabel;
