import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
  session: Session | null | undefined;
  event: AuthChangeEvent | undefined;
  setSession: (session: Session | null, event: AuthChangeEvent) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: undefined,
  event: undefined,
  setSession: (session: Session | null, event: AuthChangeEvent) =>
    set(() => ({ session, event })),
}));

export default useAuthStore;
