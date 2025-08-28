import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
  session: Session | null | undefined;
  avatarUrl: string | undefined;
  setSession: (session: Session | null) => void;
  setAvatarUrl: (avatarUrl: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: undefined,
  avatarUrl: undefined,
  setSession: (session: Session | null) => set(() => ({ session })),
  setAvatarUrl: (avatarUrl: string) => set(() => ({ avatarUrl })),
}));

export default useAuthStore;
