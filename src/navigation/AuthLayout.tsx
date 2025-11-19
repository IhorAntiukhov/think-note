import { COLORS } from "@/src/constants/theme";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../api/supabase";
import useAvailableTags from "../hooks/useAvailableTags";
import useIdeaCategories from "../hooks/useIdeaCategories";
import useAuthStore from "../store/authStore";

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

  useAvailableTags(session);
  useIdeaCategories(session);

  if (session === undefined) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.secondary }}
      edges={["left", "right", "top"]}
    >
      <View style={{ backgroundColor: COLORS.background, height: "100%" }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
