import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import useAuthStore from "../store/authStore";

interface ScreenScrollWrapperProps {
  children: React.ReactNode;
  allowUnauthenticated?: boolean;
}

export default function ScreenScrollWrapper({
  children,
  allowUnauthenticated,
}: ScreenScrollWrapperProps) {
  const { session } = useAuthStore();
  if (!allowUnauthenticated && !session?.user) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "padding"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
