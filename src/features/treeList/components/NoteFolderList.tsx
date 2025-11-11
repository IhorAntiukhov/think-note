import { use } from "react";
import useCreateFolder from "../hooks/useCreateFolder";
import useFetchData from "../hooks/useFetchData";
import useMoveItem from "../hooks/useMoveItem";
import useToggleFolder from "../hooks/useToggleFolder";
import TreeListContext from "../context/treeListContext";
import CategoryItem from "./CaterogyItem";
import FolderItem from "./FolderItem";
import IdeaItem from "./IdeaItem";
import NoteItem from "./NoteItem";

export default function NoteFolderList() {
  const {
    type,
    data,
    openedFolders,
    selectedItemIndex,
    setSelectedItemIndex,
    loadingFolderId,
  } = use(TreeListContext)!;

  const moveItem = useMoveItem();
  const fetchData = useFetchData({ value: undefined });
  const createFolder = useCreateFolder();
  const toggleFolder = useToggleFolder();

  return type === "notes"
    ? data.map((item, index) =>
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
      )
    : data.map((item, index) =>
        item.type === "folder" ? (
          <CategoryItem
            type="category"
            item={item}
            key={item.id}
            index={index}
            selectedIndex={selectedItemIndex}
            moveItem={moveItem}
            isFolderOpened={
              !!openedFolders.find(
                (folder) => folder.currentFolderId === item.id,
              )
            }
            onFolderToggle={toggleFolder}
            onUpdateFolders={fetchData}
            isLoading={item.id === loadingFolderId}
          />
        ) : (
          <IdeaItem
            item={item}
            key={item.id}
            index={index}
            selectedIndex={selectedItemIndex}
            setSelectedIndex={setSelectedItemIndex}
          />
        ),
      );
}
