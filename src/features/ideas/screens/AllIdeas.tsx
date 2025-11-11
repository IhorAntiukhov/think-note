import { useState } from "react";
import { View } from "react-native";
import allNotesStyles from "../../notes/styles/allNotes.styles";
import SearchWrapper from "../../search/components/SearchWrapper";
import TreeList from "../../treeList/components/TreeList";
import { IdeaCategoryRow } from "../../treeList/types/ideaRow";
import { sortItems } from "../../treeList/utils/sortItems";

export default function AllIdeas() {
  const [data, setData] = useState<IdeaCategoryRow[]>([]);

  return (
    <View style={allNotesStyles.container}>
      <SearchWrapper type="ideas">
        <TreeList
          type="ideas"
          data={data}
          setData={setData}
          filterOrSortData={sortItems}
        />
      </SearchWrapper>
    </View>
  );
}
