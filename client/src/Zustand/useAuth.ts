import { create } from "zustand";
import { AxiosInstance } from "@/Api call/AxiosInstance"; 

interface AuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  checkAuthStatus: () => void; // Action to check authentication status
}
const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  isLoading: true,
  checkAuthStatus: async () => {
    try {
      const response = await AxiosInstance.get("/login/auth", {
        withCredentials: true,
      });
      if ((await response.data.data.auth) === true) {
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.log(error);
      set({ isAuthenticated: false });
    } finally {
    set({isLoading:false})}
  },
}));

export default useAuthStore;
