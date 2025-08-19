import { COLORS } from "@/src/constants/theme";
import useAuth from "@/src/features/auth/hooks/useAuth";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function InitialLayout() {
  const session = useAuth();
  const router = useRouter();
  const fontsLoaded = useFonts({
    MaterialCommunityIcons: require("@expo/vector-icons/MaterialCommunityIcons"),
  });

  useEffect(() => {
    if (session === undefined || !fontsLoaded) return;

    SplashScreen.hide();

    if (session) router.replace("/(tabs)");
    else router.replace("/(auth)/login");
  }, [session, fontsLoaded, router]);

  if (!session) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.primary }}
      edges={["left", "right", "top"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
