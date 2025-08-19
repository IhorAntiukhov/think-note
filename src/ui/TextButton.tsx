import { Animated, ViewStyle } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

interface TextButtonType extends ButtonProps {
  style?: Animated.WithAnimatedObject<ViewStyle>;
}

export default function TextButton({
  children,
  style,
  ...rest
}: TextButtonType) {
  return (
    <Button
      mode="text"
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
