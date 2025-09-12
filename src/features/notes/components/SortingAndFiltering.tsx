import { COLORS } from "@/src/constants/theme";
import DropdownMenu from "@/src/ui/DropdownMenu";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import SORTING_OPTIONS from "../constants/sortingOptions";

interface SortingAndFilteringProps {
  sortBy: string;
  onChangeSortBy: (value: string) => void;
  isAscending: boolean;
  onChangeIsAscending: (isAscending: boolean) => void;
  isMarked: boolean;
  onChangeIsMarked: (isMarked: boolean) => void;
}

export default function SortingAndFiltering({
  sortBy,
  onChangeSortBy,
  isAscending,
  onChangeIsAscending,
  isMarked,
  onChangeIsMarked,
}: SortingAndFilteringProps) {
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <View style={{ paddingTop: 1 }}>
          <IconButton
            style={{
              borderRadius: "50%",
              borderWidth: 2,
              borderColor: COLORS.secondary,
            }}
            icon={isMarked ? "star" : "star-outline"}
            size={22}
            iconColor={COLORS.secondary}
            onPress={() => onChangeIsMarked(!isMarked)}
          />
        </View>

        <View style={{ flexGrow: 1 }}>
          <DropdownMenu
            label="Sort by"
            options={SORTING_OPTIONS}
            value={sortBy}
            onChange={onChangeSortBy}
          />
        </View>

        <View style={{ paddingTop: 1 }}>
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
    </View>
  );
}
