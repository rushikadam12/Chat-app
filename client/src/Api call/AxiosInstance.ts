import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_URL}`,
  timeout: 2000,
});

export const loginPost = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  return instance.post("/login", { email, password });
};

export const loginGoogle = async () => {
  return instance.get("/passport/google");
};
