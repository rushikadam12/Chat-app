import { create } from "zustand";
import { AxiosInstance } from "@/Api call/AxiosInstance";
import { User } from "@/interfaces/User";

/*
  {
  _id: new ObjectId('663b389f079fd8bfafa1c012'),
  email: 'sumitbiradar123@gmail.com',
  username: 'sumit',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNiMzg5ZjA3OWZkOGJmYWZhMWMwMTIiLCJpYXQiOjE3MTYzMTI3NDgsImV4cCI6MTcxNjM5OTE0OH0.eRfAyjWlTSBZ65bvBnUD3NO5_v4DjGkOtPnWgxleqfw',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_kSSoomJ9hiFXmiF2RdZlwx72Y23XsT6iwQ&usqp=CAU',
  createdAt: 2024-05-08T08:32:31.863Z,
  updatedAt: 2024-05-21T17:32:28.534Z,
  __v: 0
}
 */

interface AuthState {
  User: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  checkAuthStatus: () => void; // Action to check authentication status
}
const useAuthStore = create<AuthState>((set) => ({
  User: null,
  isAuthenticated: null,
  isLoading: true,
  checkAuthStatus: async () => {
    try {
      const response = await AxiosInstance.get("/login/auth", {
        withCredentials: true,
      });
      console.log(response.data);
      if ((await response.data.data.auth) === true) {
        set({ User: response.data.data.loggedUser });
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.log(error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
