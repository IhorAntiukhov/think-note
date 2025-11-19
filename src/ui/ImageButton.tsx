import React from "react";
import { IconButton, IconButtonProps } from "react-native-paper";
import { COLORS } from "../constants/theme";
import { sharedStyles } from "../styles/shared.styles";

export default function ImageButton({ ...rest }: IconButtonProps) {
  return (
    <IconButton
      style={sharedStyles.imageButton}
      size={22}
      iconColor={COLORS.secondary}
      {...rest}
    />
  );
}
