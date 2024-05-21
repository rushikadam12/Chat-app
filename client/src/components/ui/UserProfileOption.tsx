import React, { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "@/Api call/AxiosInstance";

interface UserProfileOptionProps {
  children: ReactNode; // Define children prop as ReactNode type
}

const UserProfileOption: React.FC<UserProfileOptionProps> = ({ children }) => {
  const Navigate = useNavigate();
  const userLogout = useMutation({
    mutationFn: LogOut,
    onSuccess: async (response) => {
      console.log(response.data);
      if (response.status === 200) {
        Navigate("/");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              userLogout.mutate();
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserProfileOption;
