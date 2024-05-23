import axios from "axios";
import useUserIdStore from "@/Zustand/useUserIdStore";
import { Cookie } from "lucide-react";
export const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_URL}`,
  timeout: 3000,
});

/*SigIn and SignOut api call */

export const loginPost = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  return AxiosInstance.post(
    "/login",
    { email, password },
    { withCredentials: true }
  );
};

export const loginGoogle = async () => {
  return AxiosInstance.get("/passport/google");
};

export const authCall = async () => {
  return AxiosInstance.get("/login/auth", {
    withCredentials: true,
  });
};

export const LogOut = async () => {
  return AxiosInstance.get("/login/logout", { withCredentials: true });
};

export const RegisterCall = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  const { email, password, username } = data;
  return AxiosInstance.post(
    "/register",
    { email, password, username },
    { withCredentials: true }
  );
};

/*chat api calls */

export const ChatList = async () => {
  return AxiosInstance.get(`/chat-app/chats/users`, { withCredentials: true });
};

//  const { userId } = useUserIdStore.getState();
// export const createChat = async () => {
//   if (!userId) {
//     return
//   }
//   //this request create OneOnOne chat or retrieve previous chat if already created
//   return AxiosInstance.post(`/chat-app/chats/c/${userId}`, {
//     withCredentials: true,
//   });
// };
