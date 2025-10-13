import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import NoteItem from "../../notes/components/NoteItem";
import treeListStyles from "../../notes/styles/treeList.styles";
import { SearchNoteData, searchNotes } from "../api/searchRepo";

interface SearchResultsListProp {
  searchQuery: string;
}

export default function SearchResultsList({
  searchQuery,
}: SearchResultsListProp) {
  const { user } = useAuthStore().session!;
  const { showInfoDialog } = useDialogStore();

  const [data, setData] = useState<SearchNoteData>(null);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await searchNotes(searchQuery, user.id);

      if (error) throw error;

      if (data) setData(data);
    } catch (error) {
      showInfoDialog("Fetch failed", (error as PostgrestError).message);
    }
  }, [searchQuery, user.id, showInfoDialog]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View style={treeListStyles.listContainer}>
      {data && data.length ? (
        data.map((item, index) => (
          <NoteItem
            item={{ ...item, type: "note", folder_id: null, depth: 1 }}
            key={item.id}
            index={index}
            selectedIndex={null}
            inSearchResults
          />
        ))
      ) : (
        <Text style={treeListStyles.noDataText}>No notes found</Text>
      )}
    </View>
  );
}
