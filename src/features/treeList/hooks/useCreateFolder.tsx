import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { use, useCallback } from "react";
import { insertCategory } from "../../ideas/api/ideasRepo";
import { insertFolder } from "../../notes/api/notesRepo";
import TreeListContext from "../context/treeListContext";
import useFetchData from "./useFetchData";

export default function useCreateFolder() {
  const { type, data, setData, userId, setNewFolderDepth } =
    use(TreeListContext)!;
  const { showInfoDialog } = useDialogStore();

  const fetchData = useFetchData({ value: undefined });

  return useCallback(
    async (
      folderName: string,
      parentIndex: number,
      parentFolderId: number | null,
      depth: number,
    ) => {
      if (!folderName) {
        setNewFolderDepth(null);
        return;
      }

      try {
        if (type === "notes") {
          const { data: newFolder, error } = await insertFolder(
            folderName,
            userId,
            parentFolderId,
            depth,
          );

          if (error) throw error;

          if (newFolder) {
            const newData = data ? [...data] : [];

            newData.splice(parentFolderId ? parentIndex + 1 : 0, 0, newFolder);
            setData(newData);
          }
        } else {
          const { data: newFolder, error } = await insertCategory(
            folderName,
            userId,
          );

          if (error) throw error;

          if (newFolder) {
            const newData = data ? [...data] : [];

            newData.splice(parentFolderId ? parentIndex + 1 : 0, 0, newFolder);
            setData(newData);
          }
        }

        await fetchData();
      } catch (error) {
        showInfoDialog(
          "Folder creation failder",
          (error as PostgrestError).message,
        );
      } finally {
        setNewFolderDepth(null);
      }
    },
    [type, data, setData, userId, fetchData, showInfoDialog, setNewFolderDepth],
  );
}
