import { create } from "zustand";

interface IuseUserIdStore{
    setUserId:(newUserId:string)=>void
    userId: string | null;
    
}

const useUserIdStore = create<IuseUserIdStore>((set) => ({
    setUserId:(newUserId)=>set({userId:newUserId}),
    userId: null,
    
}));
export default useUserIdStore