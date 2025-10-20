import DropdownOption from "@/src/types/dropdownOption";
import DropdownMenu from "@/src/ui/DropdownMenu";
import ImageButton from "@/src/ui/ImageButton";
import { View } from "react-native";
import SORTING_OPTIONS from "../constants/sortingOptions";
import sortingStyles from "../styles/sorting.styles";

interface SortingProps {
  sortBy: string;
  onChangeSortBy: (value: string) => void;
  isAscending: boolean;
  onChangeIsAscending: (isAscending: boolean) => void;
  sortingOptions?: DropdownOption[];
}

export default function Sorting({
  sortBy,
  onChangeSortBy,
  isAscending,
  onChangeIsAscending,
  sortingOptions,
}: SortingProps) {
  return (
    <View style={[sortingStyles.sortingContainer, { flexShrink: 1 }]}>
      <View style={{ flexGrow: 1 }}>
        <DropdownMenu
          label="Sort by"
          options={sortingOptions || SORTING_OPTIONS}
          value={sortBy}
          onChange={onChangeSortBy}
          leftIcon={
            sortBy === "created_at"
              ? "calendar-month"
              : sortBy === "updated_at"
                ? "update"
                : sortBy === "name"
                  ? "abc"
                  : sortBy === "num_words"
                    ? "edit"
                    : "file-open"
          }
        />
      </View>

      <View style={{ paddingTop: 1 }}>
        <ImageButton
          icon={isAscending ? "arrow-up" : "arrow-down"}
          onPress={() => onChangeIsAscending(!isAscending)}
        />
      </View>
    </View>
  );
}
