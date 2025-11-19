import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { use, useCallback } from "react";
import { getIdeasInCategories } from "../../ideas/api/ideasRepo";
import { getItemsInFolders } from "../../notes/api/notesRepo";
import TreeListContext, { Params } from "../context/treeListContext";
import { IdeaCategoryRow } from "../types/ideaRow";
import LoadingAllState from "../types/loadingAllState";
import { NoteFolderRow } from "../types/noteRow";

interface UseFetchDataProps {
  value?: Params;
}

export default function useFetchData({ value }: UseFetchDataProps) {
  const {
    type,
    setData,
    filterOrSortData,
    showOnlyMarked,
    selectedTags,
    openedFolders,
    userId,
    sortBy,
    isAscending,
    setLoadingFolderId,
    setLoadingAllState,
  } = value || use(TreeListContext)!;
  const { showInfoDialog } = useDialogStore();

  return useCallback(async () => {
    try {
      const { data, error } = await (
        type === "notes" ? getItemsInFolders : getIdeasInCategories
      )(
        userId,
        openedFolders.map((openedFolder) => openedFolder.currentFolderId),
        sortBy,
        isAscending,
        type === "notes" ? showOnlyMarked : false,
      );

      if (error) throw error;

      if (data) {
        if (type === "notes") {
          setData(
            filterOrSortData(
              (data as NoteFolderRow[]).filter(
                (note) => !(note.depth === 1 && note.type === "note"),
              ),
              selectedTags,
            ),
          );
        } else {
          setData(filterOrSortData(data as IdeaCategoryRow[]));
        }
      }
    } catch (error) {
      showInfoDialog("Fetch failed", (error as PostgrestError).message);
    } finally {
      setLoadingFolderId(null);
      setLoadingAllState(LoadingAllState.notLoading);
    }
  }, [
    setData,
    filterOrSortData,
    selectedTags,
    showOnlyMarked,
    type,
    isAscending,
    sortBy,
    userId,
    openedFolders,
    showInfoDialog,
    setLoadingAllState,
    setLoadingFolderId,
  ]);
}
