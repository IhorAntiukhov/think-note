import useAuthStore from "@/src/store/authStore";
import { useEffect } from "react";
import supabase from "../../../api/supabase";

export default function useAuth() {
  const { session, event, setSession } = useAuthStore();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session, event);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setSession]);

  return { session, event };
}
