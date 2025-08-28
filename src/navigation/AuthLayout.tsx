import { COLORS } from "@/src/constants/theme";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../api/supabase";
import useAuthStore from "../store/authStore";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const { session, setSession } = useAuthStore();
  const eventRef = useRef<AuthChangeEvent>(undefined);
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session === undefined || eventRef.current === event) return;

      eventRef.current = event;

      if (event === "INITIAL_SESSION") {
        SplashScreen.hide();

        if (session) router.replace("/(tabs)");
        else router.replace("/(auth)/login");
      } else if (event === "SIGNED_IN") {
        router.replace("/(tabs)/profile");
      } else if (event === "SIGNED_OUT") {
        router.replace("/(auth)/login");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [router, setSession]);

  if (session === undefined) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.secondary }}
      edges={["left", "right", "top"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
