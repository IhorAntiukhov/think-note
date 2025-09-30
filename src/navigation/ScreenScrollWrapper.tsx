import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

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
      {children}
    </KeyboardAvoidingView>
  );
}
