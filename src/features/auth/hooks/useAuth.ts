import { useEffect } from "react";
import supabase from "../../../api/supabase";
import useAuthStore from "@/src/store/authStore";

export default function useAuth() {
  const { session, setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, [setSession]);

  return session;
}
