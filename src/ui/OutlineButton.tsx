import { Animated, ViewStyle } from "react-native";
import { Button, ButtonProps, useTheme } from "react-native-paper";

interface OutlineButtonType extends ButtonProps {
  themeColor?: "primary" | "secondary" | "error";
  style?: Animated.WithAnimatedObject<ViewStyle>;
}

export default function OutlineButton({
  children,
  themeColor,
  style,
  ...rest
}: OutlineButtonType) {
  const theme = useTheme();
  const primaryColor =
    themeColor === "secondary"
      ? theme.colors.secondary
      : themeColor === "error"
        ? theme.colors.error
        : theme.colors.primary;

  return (
    <Button
      mode="outlined"
      theme={{
        colors: {
          primary: primaryColor,
        },
      }}
      style={{
        borderWidth: 2,
        borderColor: primaryColor,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
