import { COLORS } from "@/src/constants/theme";
//import DropdownMenu from "@/src/ui/DropdownMenu";
import DropdownMenu from "@/src/ui/DropdownMenu";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import SORTING_OPTIONS from "../constants/sortingOptions";

interface SortingProps {
  sortBy: string;
  onChangeSortBy: (value: string) => void;
  isAscending: boolean;
  onChangeIsAscending: (isAscending: boolean) => void;
}

export default function Sorting({
  sortBy,
  onChangeSortBy,
  isAscending,
  onChangeIsAscending,
}: SortingProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 10,
      }}
    >
      <View style={{ flexGrow: 1 }}>
        <DropdownMenu
          label="Sort by"
          options={SORTING_OPTIONS}
          value={sortBy}
          onChange={onChangeSortBy}
        />
      </View>

      <View style={{ paddingTop: 5 }}>
        <IconButton
          style={{
            borderRadius: "50%",
            borderWidth: 2,
            borderColor: COLORS.secondary,
          }}
          icon={isAscending ? "arrow-up" : "arrow-down"}
          size={22}
          iconColor={COLORS.secondary}
          onPress={() => onChangeIsAscending(!isAscending)}
        />
      </View>
    </View>
  );
}
