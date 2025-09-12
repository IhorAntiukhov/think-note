import { COLORS } from "@/src/constants/theme";
import { confirmationAlert, errorAlert } from "@/src/utils/alerts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ActivityIndicator, Menu } from "react-native-paper";
import { deleteFolder } from "../api/notesRepo";
import treeListStyles from "../styles/treeList.styles";
import OnCreateFolder from "../types/onCreateFolder";
import { FolderRow } from "../types/rowTypes";
import FolderNameInput from "./FolderNameInput";

interface FolderItemProps {
  item: FolderRow;
  index: number;
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
  isFolderOpened,
  onCreateFolder,
  onFolderToggle,
  onUpdateFolders,
  isLoading,
}: FolderItemProps) {
  const [isFolderCreationStarted, setIsFolderCreationStarted] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const router = useRouter();
  const leftOffset = (item.depth - 1) * 28;

  const toggleFolder = () => {
    onFolderToggle!(!isFolderOpened, item.id, item.folder_id);
  };

  const startFolderCreation = useCallback(() => {
    setIsFolderCreationStarted(true);
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
    confirmationAlert(
      "Folder deletion",
      `Are you sure you want to delete folder "${item?.name}"? This operation is irreversible and will remove all the nested notes and folders.`,
      async () => {
        try {
          const { error } = await deleteFolder(item!.id);

          if (error) throw error;

          onUpdateFolders!();
        } catch (error) {
          errorAlert("Folder deletion failed", error as PostgrestError);
        }
      },
    );
    setIsMenuOpened(false);
  }, [item, onUpdateFolders]);

  return (
    <View style={{ marginLeft: leftOffset }}>
      <View style={treeListStyles.itemContainerWithGap}>
        <Pressable style={treeListStyles.itemContainer} onPress={toggleFolder}>
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
            <Text style={treeListStyles.text}>{item.name}</Text>
          </View>
        </Pressable>
        {isFolderOpened && (
          <Menu
            visible={isMenuOpened}
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
          </Menu>
        )}
        {isLoading && <ActivityIndicator size={28} color={COLORS.secondary} />}
      </View>
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
