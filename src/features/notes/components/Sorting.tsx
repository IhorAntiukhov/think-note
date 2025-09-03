import DropdownMenu from "@/src/ui/DropdownMenu";
import { View } from "react-native";
import SORTING_OPTIONS from "../constants/sortingOptions";

interface SortingProps {
  value?: string;
  onSelect: (value?: string) => void;
}

export default function Sorting({ value, onSelect }: SortingProps) {
  return (
    <View>
      <DropdownMenu
        label="Sort by"
        placeholder="Select sorting criterion"
        options={SORTING_OPTIONS}
        value={value}
        onSelect={onSelect}
        style={{ marginBottom: 10 }}
      />
    </View>
  );
}
