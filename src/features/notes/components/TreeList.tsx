import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import useDialogStore from "@/src/store/dialogStore";
import sharedStyles from "@/src/styles/shared.styles";
import OutlineButton from "@/src/ui/OutlineButton";
import { PostgrestError } from "@supabase/supabase-js";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  IconButton,
  Portal,
  Surface,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AvatarWithUserName from "../../avatar/components/AvatarWithUserName";
import { getAvailableTags } from "../../sortingAndFiltering/api/tagsRepo";
import SortingAndFiltering from "../../sortingAndFiltering/components/SortingAndFiltering";
import SORTING_OPTIONS from "../../sortingAndFiltering/constants/sortingOptions";
import {
  changeParentFolder,
  getAllItems,
  getItemsInFolders,
  getTopFolders,
  insertFolder,
} from "../api/notesRepo";
import allNotesStyles from "../styles/allNotes.styles";
import treeListStyles from "../styles/treeList.styles";
import { TreeItemRow } from "../types/rowTypes";
import filterAndSortItems from "../utils/sortItems";
import FolderItem from "./FolderItem";
import FolderNameInput from "./FolderNameInput";
import NoteItem from "./NoteItem";

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
  const [data, setData] = useState<TreeItemRow[]>([]);
  const [openedFolders, setOpenedFolders] = useState<OpenedFolderType[]>([]);
  const [newFolderDepth, setNewFolderDepth] = useState<number | null>(null);

  const [loadingFolderId, setLoadingFolderId] = useState<number | null>(null);
  const [loadingAllState, setLoadingAllState] = useState(
    LoadingAllState.loadingAll,
  );

  const [sortBy, setSortBy] = useState<string>(SORTING_OPTIONS[0].value);
  const [isAscending, setIsAscending] = useState(false);
  const [showOnlyMarked, setShowOnlyMarked] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const { top } = useSafeAreaInsets();

  const { user } = useAuthStore().session!;
  const { setAvailableTags } = useAvailableTagsStore();
  const { showInfoDialog } = useDialogStore();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await getAvailableTags(user.id);

        if (error) throw error;

        if (data)
          setAvailableTags(
            data.map(({ id, label, color }) => ({
              value: id.toString(),
              label,
              color,
            })),
          );
      } catch (error) {
        showInfoDialog(
          "Failed to fetch tags",
          (error as PostgrestError).message,
        );
      }
    };

    fetchTags();
  }, [user.id, setAvailableTags, showInfoDialog]);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await getItemsInFolders(
        user.id,
        openedFolders.map((openedFolder) => openedFolder.currentFolderId),
        sortBy,
        isAscending,
        showOnlyMarked,
      );

      if (error) throw error;

      if (data) setData(filterAndSortItems(data, selectedTags));
    } catch (error) {
      showInfoDialog("Fetch failed", (error as PostgrestError).message);
    } finally {
      setLoadingFolderId(null);
      setLoadingAllState(LoadingAllState.notLoading);
    }
  }, [
    isAscending,
    sortBy,
    user.id,
    openedFolders,
    showOnlyMarked,
    selectedTags,
    showInfoDialog,
  ]);

  const expandOrCollapseFolders = useCallback(
    async (expand: boolean) => {
      try {
        setLoadingAllState(
          expand
            ? LoadingAllState.loadingExpand
            : LoadingAllState.loadingCollapse,
        );
        const { data, error } = expand
          ? await getAllItems(user.id, sortBy, isAscending, showOnlyMarked)
          : await getTopFolders(user.id, sortBy, isAscending, showOnlyMarked);

        if (error) throw error;

        if (data) {
          const sortedData = filterAndSortItems(data, selectedTags);

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
        showInfoDialog("Fetch failed", (error as PostgrestError).message);
      } finally {
        setLoadingAllState(LoadingAllState.notLoading);
      }
    },
    [
      isAscending,
      sortBy,
      showOnlyMarked,
      user.id,
      selectedTags,
      showInfoDialog,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

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

        if (newFolder) {
          const newData = data ? [...data] : [];

          newData.splice(parentFolderId ? parentIndex + 1 : 0, 0, {
            ...newFolder,
            tags_notes: [],
          });
          setData(newData);
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
    [user.id, data, fetchData, showInfoDialog],
  );

  const moveItem = useCallback(
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
        const error = await changeParentFolder(
          data[selectedItemIndex].id,
          data[selectedItemIndex].depth,
          destinationFolderIndex === null
            ? undefined
            : data[destinationFolderIndex].id,
        );

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
    [selectedItemIndex, data, fetchData, showInfoDialog],
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
        let previousFolderId = 0;

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
      {selectedItemIndex !== null && (
        <Portal>
          <Surface
            style={{
              marginTop: top + 10,
              marginHorizontal: 10,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, textAlign: "center" }}>
              Select the folder where you want to move the selected item
            </Text>
          </Surface>
        </Portal>
      )}

      <View style={allNotesStyles.mainDirectory}>
        <AvatarWithUserName />

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

      <Divider style={sharedStyles.divider} />

      <SortingAndFiltering
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        isAscending={isAscending}
        onChangeIsAscending={setIsAscending}
        isMarked={showOnlyMarked}
        onChangeIsMarked={setShowOnlyMarked}
        selectedTags={selectedTags}
        onChangeSelectedTags={setSelectedTags}
      />

      <Divider style={[sharedStyles.divider, { marginBottom: 10 }]} />

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
        {selectedItemIndex !== null &&
          data[selectedItemIndex].type === "folder" &&
          data[selectedItemIndex].folder_id !== null && (
            <OutlineButton
              onPress={() => moveItem(null)}
              style={{
                alignSelf: "flex-start",
              }}
              icon="folder"
            >
              Move to the main directory
            </OutlineButton>
          )}
        {data.map((item, index) =>
          item.type === "folder" ? (
            <FolderItem
              item={item}
              key={item.id}
              index={index}
              selectedIndex={selectedItemIndex}
              setSelectedIndex={setSelectedItemIndex}
              moveItem={moveItem}
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
          ) : (
            <NoteItem
              item={item}
              key={item.id}
              index={index}
              selectedIndex={selectedItemIndex}
              setSelectedIndex={setSelectedItemIndex}
            />
          ),
        )}
      </View>

      <Divider style={{ marginHorizontal: -20, marginBottom: 20 }} />

      <OutlineButton icon="folder-plus" onPress={() => setNewFolderDepth(1)}>
        New folder
      </OutlineButton>
    </>
  );
}
