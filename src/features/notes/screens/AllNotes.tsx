import { useState } from "react";
import { View } from "react-native";
import SearchWrapper from "../../search/components/SearchWrapper";
import TreeList from "../../treeList/components/TreeList";
import { NoteFolderRow } from "../../treeList/types/noteRow";
import filterAndSortItems from "../../treeList/utils/filterAndSortItems";
import allNotesStyles from "../styles/allNotes.styles";

export default function AllNotes() {
  const [data, setData] = useState<NoteFolderRow[]>([]);
  const [showOnlyMarked, setShowOnlyMarked] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <View style={allNotesStyles.container}>
      <SearchWrapper type="notes">
        <TreeList
          type="notes"
          data={data}
          setData={setData}
          filterOrSortData={filterAndSortItems}
          showOnlyMarked={showOnlyMarked}
          setShowOnlyMarked={setShowOnlyMarked}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </SearchWrapper>
    </View>
  );
}
