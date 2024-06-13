import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiMenuAltRight } from "react-icons/bi";
import { DeleteChatReq } from "@/Api call/AxiosInstance";
import useChatStore from "@/Zustand/useChatStore";
const UserMessageMenu = () => {
  const { chatId } = useChatStore();
  const DeleteChat = async () => {
    try {
      const resp = await DeleteChatReq(chatId);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BiMenuAltRight size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="hover:cursor-pointer">
          <DropdownMenuLabel>Chat</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              DeleteChat();
            }}
          >
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMessageMenu;
