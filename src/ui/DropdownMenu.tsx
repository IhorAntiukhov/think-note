import { StyleProp, View, ViewStyle } from "react-native";
import { Dropdown, DropdownProps } from "react-native-paper-dropdown";

interface DropdownMenuProps extends DropdownProps {
  style?: StyleProp<ViewStyle>;
}

export default function DropdownMenu({ style, ...rest }: DropdownMenuProps) {
  return (
    <View style={style}>
      <Dropdown mode="outlined" {...rest} />
    </View>
  );
}
