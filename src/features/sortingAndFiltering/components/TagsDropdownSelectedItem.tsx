import { COLORS } from "@/src/constants/theme";
import dropdownStyles from "@/src/styles/dropdown.styles";
import TagsDropdownOption from "@/src/types/tagsDropdownOption";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

interface TagsDropdownSelectedItemProps {
  item: TagsDropdownOption;
  unSelect: ((item: any) => void) | undefined;
}

export default function TagsDropdownSelectedItem({
  item,
  unSelect,
}: TagsDropdownSelectedItemProps) {
  return (
    <TouchableOpacity onPress={unSelect && (() => unSelect(item))}>
      <View style={dropdownStyles.selectedItem}>
        <Text style={{ color: COLORS.secondary }}>{item.label}</Text>
        <MaterialIcons name="delete" size={20} color={COLORS.secondary} />
      </View>
    </TouchableOpacity>
  );
}
