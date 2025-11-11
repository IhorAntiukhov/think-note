import { useCallback, useState } from "react";
import { View } from "react-native";
import { Menu } from "react-native-paper";
import useOpenNewNote from "../hooks/useOpenNewNote";
import { FolderRow } from "../types/noteRow";
import OnCreateFolder from "../types/onCreateFolder";
import CategoryItem from "./CaterogyItem";
import FolderNameInput from "./FolderNameInput";

interface FolderItemProps {
  item: FolderRow;
  index: number;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  moveItem: (index: number) => void;
  isFolderOpened: boolean;
  onCreateFolder: OnCreateFolder;
  onFolderToggle: (
    isOpened: boolean,
    currentFolderId: number,
    parentFolderId: number | null,
  ) => void;
  onUpdateFolders: () => void;
  isLoading: boolean;
}

export default function FolderItem({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  moveItem,
  isFolderOpened,
  onCreateFolder,
  onFolderToggle,
  onUpdateFolders,
  isLoading,
}: FolderItemProps) {
  const [isFolderCreationStarted, setIsFolderCreationStarted] = useState(false);

  const openNoteCreationPage = useOpenNewNote(item.depth, item.id);

  const leftOffset = (item.depth - 1) * 28;

  const startFolderCreation = useCallback(() => {
    setIsFolderCreationStarted(true);
  }, []);

  const onSelectFolder = useCallback(() => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    }
  }, [index, selectedIndex, setSelectedIndex]);

  return (
    <View style={{ marginLeft: leftOffset }}>
      <CategoryItem
        type="folder"
        item={item}
        index={index}
        selectedIndex={selectedIndex}
        moveItem={moveItem}
        isFolderOpened={isFolderOpened}
        onFolderToggle={onFolderToggle}
        onUpdateFolders={onUpdateFolders}
        isLoading={isLoading}
        isFolderCreationStarted={isFolderCreationStarted}
        additionalMenuItems={
          <>
            <Menu.Item
              leadingIcon="folder-plus"
              onPress={startFolderCreation}
              title="New folder"
            />
            <Menu.Item
              leadingIcon="note-plus"
              onPress={openNoteCreationPage}
              title="New note"
            />
          </>
        }
        onSelectFolder={onSelectFolder}
      />
      {isFolderCreationStarted && (
        <FolderNameInput
          nested
          setIsFolderCreationStarted={setIsFolderCreationStarted}
          onCreateFolder={onCreateFolder}
          index={index}
          itemId={item.id}
          itemDepth={item.depth}
        />
      )}
    </View>
  );
}
