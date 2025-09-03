import useAuthStore from "@/src/store/authStore";
import { Tables } from "@/src/types/supabase";
import OutlineButton from "@/src/ui/OutlineButton";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Divider } from "react-native-paper";
import { getAllItems, insertFolder } from "../api/notesRepo";
import SORTING_OPTIONS from "../constants/sortingOptions";
import treeListStyles from "../styles/treeList.styles";
import sortItems from "../utils/sortItems";
import Sorting from "./Sorting";
import TreeItem from "./TreeItem";

type TreeItemType = Tables<"notes">;
interface OpenedFolderType {
  currentFolderId: number;
  parentFolderId: number | null;
}

export default function TreeList() {
  const [data, setData] = useState<TreeItemType[]>([]);
  const [openedFolders, setOpenedFolders] = useState<OpenedFolderType[]>([]);
  const [newFolderDepth, setNewFolderDepth] = useState<number | null>(null);
  const [loadingFolderId, setLoadingFolderId] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<string | undefined>(
    SORTING_OPTIONS[0].value,
  );

  const { session } = useAuthStore();
  const user = session!.user;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await getAllItems(
          user.id,
          openedFolders.map((openedFolder) => openedFolder.currentFolderId),
          sortBy,
          false,
        );

        if (error) throw error;

        if (data) setData(sortItems(data));
      } catch (error) {
        Alert.alert(
          "Fetch failed",
          (error as PostgrestError).message,
          undefined,
          {
            cancelable: true,
          },
        );
      } finally {
        setLoadingFolderId(null);
      }
    }
    fetchData();
  }, [user.id, sortBy, openedFolders]);

  const createFolder = useCallback(
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
        const { data: newFolder, error } = await insertFolder(
          folderName,
          user.id,
          parentFolderId,
          depth,
        );

        if (error) throw error;

        const newData = data ? [...data] : [];
        newData.splice(parentFolderId ? parentIndex + 1 : 0, 0, newFolder!);
        setData(newData);
      } catch (error) {
        Alert.alert(
          "Folder creation failed",
          (error as PostgrestError).message,
          undefined,
          { cancelable: true },
        );
      } finally {
        setNewFolderDepth(null);
      }
    },
    [user.id, data],
  );

  const toggleFolder = useCallback(
    (
      isOpened: boolean,
      currentFolderId: number,
      parentFolderId: number | null,
    ) => {
      if (isOpened) {
        setOpenedFolders((state) => [
          ...state,
          { currentFolderId, parentFolderId },
        ]);
        setLoadingFolderId(currentFolderId);
      } else {
        const newFolders = [...openedFolders];
        const filteredFolders = newFolders.filter(
          ({
            currentFolderId: currentOpenedFolderId,
            parentFolderId: parentOpenedFolderId,
          }) => {
            if (currentOpenedFolderId === currentFolderId) {
              previousFolderId = currentOpenedFolderId;
              return false;
            }
            if (parentOpenedFolderId === previousFolderId) {
              previousFolderId = currentOpenedFolderId;
              return false;
            }
            return true;
          },
        );

        let previousFolderId = 0;
        setOpenedFolders(filteredFolders);

        const newData = [...data];
        setData(
          newData.filter(
            (item) =>
              !(
                item.depth !== 1 &&
                (item.folder_id === currentFolderId ||
                  filteredFolders.findIndex(
                    (openedFolder) =>
                      item.folder_id === openedFolder.currentFolderId,
                  ) === -1)
              ),
          ),
        );
      }
    },
    [openedFolders, data],
  );

  return (
    <>
      <Sorting value={sortBy} onSelect={setSortBy} />

      {newFolderDepth && <TreeItem index={0} onCreateFolder={createFolder} />}
      <View style={treeListStyles.listContainer}>
        {data?.map((item, index) => (
          <TreeItem
            key={item.id}
            item={item}
            index={index}
            onCreateFolder={createFolder}
            onFolderToggle={toggleFolder}
            isLoading={item.id === loadingFolderId}
          />
        ))}
      </View>

      <Divider style={{ marginHorizontal: -20, marginBottom: 20 }} />

      <OutlineButton icon="folder-plus" onPress={() => setNewFolderDepth(1)}>
        New folder
      </OutlineButton>
    </>
  );
}
