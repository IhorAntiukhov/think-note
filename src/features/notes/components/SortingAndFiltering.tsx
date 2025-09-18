import DropdownMenu from "@/src/ui/DropdownMenu";
import ImageButton from "@/src/ui/ImageButton";
import { View } from "react-native";
import SORTING_OPTIONS from "../constants/sortingOptions";
import treeListStyles from "../styles/treeList.styles";
import TagsDropdown from "./TagsDropdown";

interface SortingAndFilteringProps {
  sortBy: string;
  onChangeSortBy: (value: string) => void;
  isAscending: boolean;
  onChangeIsAscending: (isAscending: boolean) => void;
  isMarked: boolean;
  onChangeIsMarked: (isMarked: boolean) => void;
  selectedTags: string[];
  onChangeSelectedTags: (tags: string[]) => void;
}

export default function SortingAndFiltering({
  sortBy,
  onChangeSortBy,
  isAscending,
  onChangeIsAscending,
  isMarked,
  onChangeIsMarked,
  selectedTags,
  onChangeSelectedTags,
}: SortingAndFilteringProps) {
  return (
    <View>
      <View style={treeListStyles.dropdownContainer}>
        <View style={{ paddingTop: 1 }}>
          <ImageButton
            icon={isMarked ? "star" : "star-outline"}
            onPress={() => onChangeIsMarked(!isMarked)}
          />
        </View>

        <View style={{ flexGrow: 1 }}>
          <DropdownMenu
            label="Sort by"
            options={SORTING_OPTIONS}
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

      <TagsDropdown
        selectedTags={selectedTags}
        onChangeSelectedTags={onChangeSelectedTags}
      />
    </View>
  );
}
