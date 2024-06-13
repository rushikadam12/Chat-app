import { create } from "zustand";
import { IAvailableUser } from "@/interfaces/AllUser";

interface UserProfileI {
  setUserAvatar: (user: IAvailableUser) => void;
  userProfile: IAvailableUser|null;
}

const useUserProfileStore = create<UserProfileI>((set) => ({
  setUserAvatar: (user: IAvailableUser ) => set({ userProfile: user}),
  userProfile:null
}));
export default useUserProfileStore;
