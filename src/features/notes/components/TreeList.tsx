import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import { Tables } from "@/src/types/supabase";
import OutlineButton from "@/src/ui/OutlineButton";
import { errorAlert } from "@/src/utils/alerts";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  IconButton,
  Searchbar,
} from "react-native-paper";
import Avatar from "../../auth/components/Avatar";
import {
  getAllItems,
  getItemsInFolders,
  getTopFolders,
  insertFolder,
} from "../api/notesRepo";
import SORTING_OPTIONS from "../constants/sortingOptions";
import allNotesStyles from "../styles/allNotes.styles";
import treeListStyles from "../styles/treeList.styles";
import sortItems from "../utils/sortItems";
import FolderNameInput from "./FolderNameInput";
import Sorting from "./Sorting";
import TreeItem from "./TreeItem";

type TreeItemType = Tables<"notes">;

interface OpenedFolderType {
  currentFolderId: number;
  parentFolderId: number | null;
}

enum LoadingAllState {
  notLoading,
  loadingExpand,
  loadingCollapse,
  loadingAll,
}

export default function TreeList() {
  const [data, setData] = useState<TreeItemType[]>([]);
  const [openedFolders, setOpenedFolders] = useState<OpenedFolderType[]>([]);
  const [newFolderDepth, setNewFolderDepth] = useState<number | null>(null);

  const [loadingFolderId, setLoadingFolderId] = useState<number | null>(null);
  const [loadingAllState, setLoadingAllState] = useState(
    LoadingAllState.loadingAll,
  );

  const [sortBy, setSortBy] = useState<string>(SORTING_OPTIONS[0].value);
  const [isAscending, setIsAscending] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthStore().session!;

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await getItemsInFolders(
        user.id,
        openedFolders.map((openedFolder) => openedFolder.currentFolderId),
        sortBy,
        isAscending,
      );

      if (error) throw error;

      if (data) setData(sortItems(data));
    } catch (error) {
      errorAlert("Fetch failed", error as PostgrestError);
    } finally {
      setLoadingFolderId(null);
      setLoadingAllState(LoadingAllState.notLoading);
    }
  }, [isAscending, sortBy, user.id, openedFolders]);

  const expandOrCollapseFolders = useCallback(
    async (expand: boolean) => {
      try {
        setLoadingAllState(
          expand
            ? LoadingAllState.loadingExpand
            : LoadingAllState.loadingCollapse,
        );
        const { data, error } = expand
          ? await getAllItems(user.id, sortBy, isAscending)
          : await getTopFolders(user.id, sortBy, isAscending);

        if (error) throw error;

        if (data) {
          const sortedData = sortItems(data);

          setData(sortedData);

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
        errorAlert("Fetch failed", error as PostgrestError);
      } finally {
        setLoadingAllState(LoadingAllState.notLoading);
      }
    },
    [isAscending, sortBy, user.id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

        await fetchData();
      } catch (error) {
        errorAlert("Folder creation failder", error as PostgrestError);
      } finally {
        setNewFolderDepth(null);
      }
    },
    [user.id, data, fetchData],
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
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 20 }}
      />

      <View style={allNotesStyles.mainDirectory}>
        <Avatar minimized />
        <Text style={{ fontSize: 18, flexGrow: 1 }}>
          {user.user_metadata.username}
        </Text>

        <View style={allNotesStyles.treeListControlButtons}>
          {loadingAllState === LoadingAllState.loadingExpand ? (
            <ActivityIndicator size={32} />
          ) : (
            <IconButton
              icon="arrow-expand-all"
              size={20}
              iconColor={COLORS.primary}
              style={allNotesStyles.treeListControlButton}
              onPress={() => expandOrCollapseFolders(true)}
            />
          )}
          {loadingAllState === LoadingAllState.loadingCollapse ? (
            <ActivityIndicator size={32} />
          ) : (
            <IconButton
              icon="arrow-collapse-all"
              size={20}
              iconColor={COLORS.primary}
              style={allNotesStyles.treeListControlButton}
              onPress={() => expandOrCollapseFolders(false)}
            />
          )}
        </View>
      </View>

      <Divider style={{ marginHorizontal: -20, marginBottom: 10 }} />

      <Sorting
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        isAscending={isAscending}
        onChangeIsAscending={setIsAscending}
      />

      {newFolderDepth && (
        <FolderNameInput
          nested={false}
          index={0}
          onCreateFolder={createFolder}
        />
      )}
      {!data.length && !newFolderDepth && (
        <View style={treeListStyles.noDataWrapper}>
          {loadingAllState === LoadingAllState.loadingAll ? (
            <ActivityIndicator size={32} />
          ) : (
            <Text style={treeListStyles.noDataText}>
              You do not have any folders or notes
            </Text>
          )}
        </View>
      )}
      <View style={treeListStyles.listContainer}>
        {data?.map((item, index) => (
          <TreeItem
            key={item.id}
            item={item}
            index={index}
            isFolderOpened={
              !!openedFolders.find(
                (folder) => folder.currentFolderId === item.id,
              )
            }
            onCreateFolder={createFolder}
            onFolderToggle={toggleFolder}
            onUpdateFolders={fetchData}
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
