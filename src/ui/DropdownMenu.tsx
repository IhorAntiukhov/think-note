import { useState } from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../constants/theme";
import dropdownStyles from "../styles/dropdown.styles";
import DropdownOption from "../types/dropdownOption";

interface DropdownMenuProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function DropdownMenu({
  label,
  options,
  value,
  onChange,
}: DropdownMenuProps) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={dropdownStyles.container}>
      <Text
        style={[dropdownStyles.label, isFocus && { color: COLORS.primary }]}
      >
        {label}
      </Text>
      <Dropdown
        style={[
          dropdownStyles.dropdown,
          isFocus && { borderColor: COLORS.primary },
        ]}
        placeholderStyle={dropdownStyles.placeholderStyle}
        selectedTextStyle={dropdownStyles.selectedTextStyle}
        iconStyle={dropdownStyles.iconStyle}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
}
