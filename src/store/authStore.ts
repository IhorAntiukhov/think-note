import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
  session: Session | null | undefined;
  setSession: (session: Session | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session: Session | null) => set(() => ({ session })),
}));

export default useAuthStore;
