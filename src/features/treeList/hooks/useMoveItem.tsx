import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { use, useCallback } from "react";
import { changeIdeaCategory } from "../../ideas/api/ideasRepo";
import { changeParentFolder } from "../../notes/api/notesRepo";
import TreeListContext from "../context/treeListContext";
import useFetchData from "./useFetchData";

export default function useMoveItem() {
  const { type, data, selectedItemIndex, setSelectedItemIndex } =
    use(TreeListContext)!;
  const { showInfoDialog } = useDialogStore();
  const fetchData = useFetchData({ value: undefined });

  return useCallback(
    async (destinationFolderIndex: number | null) => {
      if (selectedItemIndex === null) return;

      if (
        data[selectedItemIndex].type === "folder" &&
        destinationFolderIndex !== null
      ) {
        let currentFolderIndex = destinationFolderIndex;

        while (currentFolderIndex !== -1) {
          currentFolderIndex = data.findIndex(
            (item) => item.id === currentFolderIndex,
          );

          if (currentFolderIndex === selectedItemIndex) return;
        }
      }

      try {
        let error: PostgrestError | null = null;

        if (type === "notes") {
          error = await changeParentFolder(
            data[selectedItemIndex].id,
            data[selectedItemIndex].depth,
            destinationFolderIndex === null
              ? undefined
              : data[destinationFolderIndex].id,
          );
        } else if (destinationFolderIndex !== null) {
          error = await changeIdeaCategory(
            data[selectedItemIndex].id,
            data[destinationFolderIndex].id,
          );
        }

        if (error) throw error;

        await fetchData();
      } catch (error) {
        showInfoDialog(
          "Failed to move item",
          (error as PostgrestError).message,
        );
      } finally {
        setSelectedItemIndex(null);
      }
    },
    [
      type,
      data,
      selectedItemIndex,
      setSelectedItemIndex,
      fetchData,
      showInfoDialog,
    ],
  );
}
