import { Animated, ViewStyle } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

interface OutlineButtonType extends ButtonProps {
  style?: Animated.WithAnimatedObject<ViewStyle>;
}

export default function OutlineButton({
  children,
  style,
  ...rest
}: OutlineButtonType) {
  return (
    <Button
      mode="outlined"
      style={{
        borderWidth: 2,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
