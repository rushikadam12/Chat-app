import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_URL}`,
  timeout: 3000,
});

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
