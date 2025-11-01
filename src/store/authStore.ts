import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
  session: Session | null | undefined;
  avatarUrl: string | null;
  setSession: (session: Session | null) => void;
  setAvatarUrl: (avatarUrl: string | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: undefined,
  avatarUrl: null,
  setSession: (session) => set(() => ({ session })),
  setAvatarUrl: (avatarUrl) => set(() => ({ avatarUrl })),
}));

export default useAuthStore;
