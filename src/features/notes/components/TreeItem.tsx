import { COLORS } from "@/src/constants/theme";
import { Tables } from "@/src/types/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { ActivityIndicator, Menu } from "react-native-paper";
import treeListStyles from "../styles/treeList.styles";

interface TreeItemProps {
  item?: Tables<"notes">;
  index: number;
  onCreateFolder?: (
    folderName: string,
    parentIndex: number,
    parentFolderId: number | null,
    depth: number,
  ) => void;
  onFolderToggle?: (
    isOpened: boolean,
    currentFolderId: number,
    parentFolderId: number | null,
  ) => void;
  isLoading?: boolean;
}

export default function TreeItem({
  item,
  index,
  onCreateFolder,
  onFolderToggle,
  isLoading,
}: TreeItemProps) {
  const [isFolderOpened, setIsFolderOpened] = useState(false);
  const [isFolderCreationStarted, setIsFolderCreationStarted] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const onEndEditing = useCallback(
    (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      setIsFolderCreationStarted(false);
      onCreateFolder!(
        event.nativeEvent.text,
        index,
        item?.id || null,
        (item?.depth || 0) + 1,
      );
    },
    [item, index, onCreateFolder],
  );

  const leftOffset = ((item?.depth || 1) - 1) * 28;

  const toggleFolder = () => {
    setIsFolderOpened((state) => {
      onFolderToggle!(!state, item!.id, item!.folder_id);
      return !state;
    });
  };

  const getFolder = useCallback(
    (isInput: boolean) => {
      const folder = (
        <View style={treeListStyles.itemContainer}>
          <MaterialIcons
            name="folder"
            size={28}
            color={COLORS.secondary}
            style={{
              marginRight: 5,
              marginLeft: isInput ? 28 : 0,
            }}
          />
          {(isInput || !item) && (
            <TextInput
              style={treeListStyles.input}
              placeholder="Enter folder name"
              onEndEditing={onEndEditing}
              maxLength={20}
              autoFocus
            />
          )}
          {item && <Text style={treeListStyles.text}>{item.name}</Text>}
        </View>
      );

      return folder;
    },
    [item, onEndEditing],
  );

  const startFolderCreation = useCallback(() => {
    setIsFolderCreationStarted(true);
    setIsMenuOpened(false);
  }, []);

  return (
    <View style={{ marginLeft: leftOffset }}>
      <View style={treeListStyles.itemContainerWithGap}>
        <Pressable style={treeListStyles.itemContainer} onPress={toggleFolder}>
          {item && (
            <MaterialCommunityIcons
              name={isFolderOpened ? "chevron-down" : "chevron-right"}
              size={28}
            />
          )}
          {getFolder(false)}
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
              onPress={() => {}}
              title="New note"
            />
            <Menu.Item
              leadingIcon="delete"
              onPress={() => {}}
              title="Delete folder"
            />
          </Menu>
        )}
        {isLoading && <ActivityIndicator size={28} color={COLORS.secondary} />}
      </View>
      {isFolderCreationStarted && getFolder(true)}
    </View>
  );
}
