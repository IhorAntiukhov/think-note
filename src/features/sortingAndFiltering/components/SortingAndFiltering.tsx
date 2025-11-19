import ImageButton from "@/src/ui/ImageButton";
import { View } from "react-native";
import sortingStyles from "../styles/sorting.styles";
import Sorting from "./Sorting";
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
    <View style={sortingStyles.sortingAndFilteringContainer}>
      <View style={sortingStyles.sortingAndMarkedContainer}>
        <ImageButton
          icon={isMarked ? "star" : "star-outline"}
          onPress={() => onChangeIsMarked(!isMarked)}
        />

        <View style={{ flexGrow: 1 }}>
          <Sorting
            sortBy={sortBy}
            onChangeSortBy={onChangeSortBy}
            isAscending={isAscending}
            onChangeIsAscending={onChangeIsAscending}
          />
        </View>
      </View>

      <View style={{ flexGrow: 1, maxWidth: 400 }}>
        <TagsDropdown
          selectedTags={selectedTags}
          onChangeSelectedTags={onChangeSelectedTags}
        />
      </View>
    </View>
  );
}
