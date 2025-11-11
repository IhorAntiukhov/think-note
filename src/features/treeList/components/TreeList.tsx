import useAuthStore from "@/src/store/authStore";
import sharedStyles from "@/src/styles/shared.styles";
import OutlineButton from "@/src/ui/OutlineButton";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Divider } from "react-native-paper";
import Sorting from "../../sortingAndFiltering/components/Sorting";
import SortingAndFiltering from "../../sortingAndFiltering/components/SortingAndFiltering";
import SORTING_OPTIONS from "../../sortingAndFiltering/constants/sortingOptions";
import TreeListContext from "../context/treeListContext";
import useFetchData from "../hooks/useFetchData";
import treeListStyles from "../styles/treeList.styles";
import { IdeasListProps, NotesListProps } from "../types/treeListProps";
import LoadingAllState from "../types/loadingAllState";
import OpenedFolderType from "../types/openedFolderType";
import ExpandCollapseButtons from "./ExpandCollapseButtons";
import MainDirectoryFolderInput from "./MainDirectoryFolderInput";
import MainLoading from "./MainLoading";
import MoveItemBanner from "./MoveItemBanner";
import MoveToMainDirectory from "./MoveToMainDirectory";
import NoteFolderList from "./NoteFolderList";

type TreeListProps = NotesListProps | IdeasListProps;

export default function TreeList({
  type,
  data,
  setData,
  filterOrSortData,
  showOnlyMarked,
  setShowOnlyMarked,
  selectedTags,
  setSelectedTags,
}: TreeListProps) {
  const [openedFolders, setOpenedFolders] = useState<OpenedFolderType[]>([]);
  const [newFolderDepth, setNewFolderDepth] = useState<number | null>(null);

  const [loadingFolderId, setLoadingFolderId] = useState<number | null>(null);
  const [loadingAllState, setLoadingAllState] = useState(
    LoadingAllState.loadingAll,
  );

  const [sortBy, setSortBy] = useState<string>(SORTING_OPTIONS[0].value);
  const [isAscending, setIsAscending] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  const { user } = useAuthStore().session!;

  const typeAndConfig = useMemo(
    () =>
      type === "notes"
        ? {
            type,
            data,
            setData,
            filterOrSortData,
            showOnlyMarked,
            setShowOnlyMarked,
            selectedTags,
            setSelectedTags,
          }
        : { type, data, setData, filterOrSortData },
    [
      type,
      data,
      setData,
      filterOrSortData,
      showOnlyMarked,
      setShowOnlyMarked,
      selectedTags,
      setSelectedTags,
    ],
  );
  const treeListContextValue = useMemo(
    () => ({
      ...typeAndConfig,
      userId: user.id,
      sortBy,
      isAscending,
      loadingAllState,
      setLoadingAllState,
      openedFolders,
      setOpenedFolders,
      selectedItemIndex,
      setSelectedItemIndex,
      newFolderDepth,
      setNewFolderDepth,
      loadingFolderId,
      setLoadingFolderId,
    }),
    [
      typeAndConfig,
      user.id,
      sortBy,
      isAscending,
      loadingAllState,
      setLoadingAllState,
      openedFolders,
      setOpenedFolders,
      selectedItemIndex,
      setSelectedItemIndex,
      newFolderDepth,
      setNewFolderDepth,
      loadingFolderId,
      setLoadingFolderId,
    ],
  );

  const fetchData = useFetchData({ value: treeListContextValue });

  useFocusEffect(
    useCallback(() => {
      console.log("fetchData");
      fetchData();
    }, [fetchData]),
  );

  return (
    <TreeListContext value={treeListContextValue}>
      <MoveItemBanner selectedItemIndex={selectedItemIndex} />

      <ExpandCollapseButtons />

      <Divider style={sharedStyles.divider} />

      {type === "notes" ? (
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
      ) : (
        <Sorting
          sortBy={sortBy}
          onChangeSortBy={setSortBy}
          isAscending={isAscending}
          onChangeIsAscending={setIsAscending}
          sortingOptions={[
            { label: "Created at", value: "created_at" },
            { label: "Updated at", value: "updated_at" },
          ]}
        />
      )}

      <Divider style={[sharedStyles.divider, { marginBottom: 10 }]} />

      <MainDirectoryFolderInput />

      <MainLoading />

      <View style={treeListStyles.listContainer}>
        <MoveToMainDirectory />

        <NoteFolderList />
      </View>

      <Divider style={{ marginHorizontal: -20, marginBottom: 20 }} />

      <OutlineButton icon="folder-plus" onPress={() => setNewFolderDepth(1)}>
        New folder
      </OutlineButton>
    </TreeListContext>
  );
}
