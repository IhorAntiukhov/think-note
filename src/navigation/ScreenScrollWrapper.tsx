import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

interface ScreenScrollWrapperProps {
  children: React.ReactNode;
}

export default function ScreenScrollWrapper({
  children,
}: ScreenScrollWrapperProps) {
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
