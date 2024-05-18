import { IconType } from "react-icons";
import { FiUser } from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
export interface Inavbaricons {
  name: string;
  element: IconType;
}

const NvabarIcons: Inavbaricons[] = [
  {
    name: "User",
    element: FiUser,
  },
  {
    name: "Chat",
    element: IoChatbubblesOutline,
  },
  {
    name: "Group",
    element: GrGroup,
  },
];
export default NvabarIcons;
