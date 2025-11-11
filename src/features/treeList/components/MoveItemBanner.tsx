import React from "react";
import { Text } from "react-native";
import { Portal, Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MoveItemBannerProps {
  selectedItemIndex: number | null;
}

export default function MoveItemBanner({
  selectedItemIndex,
}: MoveItemBannerProps) {
  const { top } = useSafeAreaInsets();

  return selectedItemIndex !== null ? (
    <Portal>
      <Surface
        style={{
          marginTop: top + 10,
          marginHorizontal: 10,
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Select the folder where you want to move the selected item
        </Text>
      </Surface>
    </Portal>
  ) : null;
}
