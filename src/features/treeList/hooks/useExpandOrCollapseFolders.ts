import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { use, useCallback } from "react";
import {
  getAllIdeas,
  getIdeaCategoriesSorted,
} from "../../ideas/api/ideasRepo";
import { getAllItems, getTopFolders } from "../../notes/api/notesRepo";
import TreeListContext from "../context/treeListContext";
import { IdeaCategoryRow } from "../types/ideaRow";
import LoadingAllState from "../types/loadingAllState";
import { NoteFolderRow } from "../types/noteRow";
import OpenedFolderType from "../types/openedFolderType";

export default function useExpandOrCollapseFolders() {
  const {
    type,
    setData,
    showOnlyMarked,
    filterOrSortData,
    selectedTags,
    userId,
    sortBy,
    isAscending,
    setLoadingAllState,
    setOpenedFolders,
  } = use(TreeListContext)!;

  const { showInfoDialog } = useDialogStore();

  return useCallback(
    async (expand: boolean) => {
      try {
        setLoadingAllState(
          expand
            ? LoadingAllState.loadingExpand
            : LoadingAllState.loadingCollapse,
        );
        const { data, error } = expand
          ? await (type === "notes" ? getAllItems : getAllIdeas)(
              userId,
              sortBy,
              isAscending,
              type === "notes" ? showOnlyMarked : false,
            )
          : await (type === "notes" ? getTopFolders : getIdeaCategoriesSorted)(
              userId,
              sortBy,
              isAscending,
              type === "notes" ? showOnlyMarked : false,
            );

        if (error) throw error;

        if (data) {
          let sortedData: NoteFolderRow[] | IdeaCategoryRow[] = [];

          if (type === "notes") {
            sortedData = filterOrSortData(
              (data as NoteFolderRow[]).filter(
                (note) => !(note.depth === 1 && note.type === "note"),
              ),
              selectedTags,
            );

            setData(sortedData);
          } else {
            sortedData = filterOrSortData(data as IdeaCategoryRow[]);

            setData(sortedData);
          }

          if (expand) {
            setOpenedFolders(
              sortedData.reduce<OpenedFolderType[]>((folders, item) => {
                if (item.type === "folder") {
                  folders.push({
                    currentFolderId: item.id,
                    parentFolderId: item.folder_id,
                  });
                }
                return folders;
              }, []),
            );
          } else {
            setOpenedFolders([]);
          }
        }
      } catch (error) {
        showInfoDialog("Fetch failed", (error as PostgrestError).message);
      } finally {
        setLoadingAllState(LoadingAllState.notLoading);
      }
    },
    [
      setData,
      filterOrSortData,
      selectedTags,
      showOnlyMarked,
      type,
      isAscending,
      sortBy,
      userId,
      setLoadingAllState,
      setOpenedFolders,
      showInfoDialog,
    ],
  );
}
