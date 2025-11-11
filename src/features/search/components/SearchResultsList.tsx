import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import IdeaItem from "../../treeList/components/IdeaItem";
import NoteItem from "../../treeList/components/NoteItem";
import treeListStyles from "../../treeList/styles/treeList.styles";
import {
  SearchIdeaData,
  searchIdeas,
  SearchNoteData,
  searchNotes,
} from "../api/searchRepo";

interface SearchResultsListProp {
  type: "notes" | "ideas";
  searchQuery: string;
}

export default function SearchResultsList({
  type,
  searchQuery,
}: SearchResultsListProp) {
  const { user } = useAuthStore().session!;
  const [data, setData] = useState<SearchNoteData | SearchIdeaData>(null);
  const { showInfoDialog } = useDialogStore();

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await (
        type === "notes" ? searchNotes : searchIdeas
      )(searchQuery, user.id);

      if (error) throw error;

      if (data) setData(data);
    } catch (error) {
      showInfoDialog("Fetch failed", (error as PostgrestError).message);
    }
  }, [type, searchQuery, user.id, showInfoDialog, setData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View style={treeListStyles.listContainer}>
      {data && data.length ? (
        type === "notes" ? (
          (data as NonNullable<SearchNoteData>).map((item, index) => (
            <NoteItem
              item={{ ...item, type: "note", folder_id: null, depth: 1 }}
              key={item.id}
              index={index}
              selectedIndex={null}
              inSearchResults
            />
          ))
        ) : (
          (data as NonNullable<SearchIdeaData>).map((item, index) => (
            <IdeaItem
              item={{ ...item, type: "note" }}
              key={item.id}
              index={index}
              selectedIndex={null}
              inSearchResults
            />
          ))
        )
      ) : (
        <Text style={treeListStyles.noDataText}>No notes found</Text>
      )}
    </View>
  );
}
