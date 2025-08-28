import useAuthStore from "@/src/store/authStore";
import { useEffect } from "react";
import supabase from "../../../api/supabase";

export default function useAuth() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setSession]);
}
