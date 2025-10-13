import { COLORS } from "@/src/constants/theme";
import useDialogStore from "@/src/store/dialogStore";
import ContextMenu from "@/src/ui/ContextMenu";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  TextInput,
  TextInputEndEditingEvent,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Menu } from "react-native-paper";
import { deleteFolder, renameFolder } from "../api/notesRepo";
import treeListStyles from "../styles/treeList.styles";
import FolderInputState from "../types/folderInputState";
import OnCreateFolder from "../types/onCreateFolder";
import { FolderRow } from "../types/rowTypes";
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
  const [folderInputState, setFolderInputState] = useState(
    FolderInputState.closed,
  );
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const { showInfoDialog, showConfirmDialog } = useDialogStore();

  const router = useRouter();
  const leftOffset = (item.depth - 1) * 28;

  const toggleFolder = () => {
    if (selectedIndex === null) {
      onFolderToggle!(!isFolderOpened, item.id, item.folder_id);
    } else if (selectedIndex !== index) {
      moveItem(index);
    }
  };

  const startFolderCreation = useCallback(() => {
    setFolderInputState(FolderInputState.createFolder);
    setIsMenuOpened(false);
  }, []);

  const openNoteCreationPage = useCallback(() => {
    setIsMenuOpened(false);
    router.push({
      pathname: "/(notes)/new-note",
      params: {
        folderId: item.id,
        depth: item.depth,
      },
    });
  }, [router, item.id, item.depth]);

  const onDeleteFolder = useCallback(async () => {
    showConfirmDialog(
      "Folder deletion",
      `Are you sure you want to delete folder "${item?.name}"? This operation is irreversible and will remove all the nested notes and folders.`,
      async () => {
        try {
          const error = await deleteFolder(item!.id);

          if (error) throw error;

          onUpdateFolders!();
        } catch (error) {
          showInfoDialog(
            "Folder deletion failed",
            (error as PostgrestError).message,
          );
        }
      },
    );
    setIsMenuOpened(false);
  }, [item, onUpdateFolders, showConfirmDialog, showInfoDialog]);

  const startFolderEdition = useCallback(() => {
    setFolderInputState(FolderInputState.renameFolder);
    setIsMenuOpened(false);
  }, []);

  const onRenameFolder = useCallback(
    async (event: TextInputEndEditingEvent) => {
      try {
        const error = await renameFolder(item!.id, event.nativeEvent.text);

        if (error) throw error;

        onUpdateFolders!();
        setFolderInputState(FolderInputState.closed);
      } catch (error) {
        showInfoDialog(
          "Folder edition failed",
          (error as PostgrestError).message,
        );
      }
    },
    [item, onUpdateFolders, showInfoDialog],
  );

  const onSelectFolder = useCallback(() => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    }
  }, [index, selectedIndex, setSelectedIndex]);

  return (
    <View style={{ marginLeft: leftOffset }}>
      <View
        style={[
          treeListStyles.itemContainerWithGap,
          selectedIndex === index && { opacity: 0.5 },
        ]}
      >
        <TouchableOpacity
          style={treeListStyles.itemContainer}
          onPress={toggleFolder}
          onLongPress={onSelectFolder}
        >
          <MaterialCommunityIcons
            name={isFolderOpened ? "chevron-down" : "chevron-right"}
            size={28}
          />
          <View style={treeListStyles.itemContainer}>
            <MaterialIcons
              name="folder"
              size={28}
              color={COLORS.secondaryLight}
              style={{ marginRight: 5 }}
            />
            {folderInputState === FolderInputState.renameFolder ? (
              <TextInput
                style={[treeListStyles.input, { paddingVertical: 0 }]}
                placeholder="Enter folder name"
                defaultValue={item.name}
                onEndEditing={onRenameFolder}
                maxLength={20}
                autoFocus
              />
            ) : (
              <Text style={treeListStyles.text}>{item.name}</Text>
            )}
          </View>
        </TouchableOpacity>
        {isFolderOpened && (
          <ContextMenu
            isOpened={isMenuOpened}
            onDismiss={() => setIsMenuOpened(false)}
            anchor={
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={COLORS.primary}
                onPress={() => setIsMenuOpened(true)}
              />
            }
          >
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
            <Menu.Item
              leadingIcon="delete"
              onPress={onDeleteFolder}
              title="Delete folder"
            />
            <Menu.Item
              leadingIcon="pencil"
              onPress={startFolderEdition}
              title="Rename folder"
            />
          </ContextMenu>
        )}
        {isLoading && <ActivityIndicator size={28} color={COLORS.secondary} />}
      </View>
      {folderInputState === FolderInputState.createFolder && (
        <FolderNameInput
          nested
          setIsFolderCreationStarted={setFolderInputState}
          onCreateFolder={onCreateFolder}
          index={index}
          itemId={item.id}
          itemDepth={item.depth}
        />
      )}
    </View>
  );
}
