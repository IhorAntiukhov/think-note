import { COLORS } from "@/src/constants/theme";
import useAuth from "@/src/features/auth/hooks/useAuth";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function InitialLayout() {
  const { session, event } = useAuth();
  const eventRef = useRef<AuthChangeEvent>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (session === undefined || eventRef.current === event) return;

    console.log(event, session);
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
  }, [session, event, router]);

  if (session === undefined) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.primary }}
      edges={["left", "right", "top"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
