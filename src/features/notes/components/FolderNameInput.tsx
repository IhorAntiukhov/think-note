import { COLORS } from "@/src/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import treeListStyles from "../styles/treeList.styles";
import OnCreateFolder from "../types/onCreateFolder";
import FolderInputState from "../types/folderInputState";

interface FolderNameInputProps {
  nested: boolean;
  onCreateFolder: OnCreateFolder;
  index: number;
  setIsFolderCreationStarted?: (value: FolderInputState) => void;
  itemId?: number;
  itemDepth?: number;
}

export default function FolderNameInput({
  nested,
  onCreateFolder,
  index,
  setIsFolderCreationStarted,
  itemId,
  itemDepth,
}: FolderNameInputProps) {
  const onEndEditing = useCallback(
    (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      setIsFolderCreationStarted?.(FolderInputState.closed);
      onCreateFolder!(
        event.nativeEvent.text,
        index,
        itemId || null,
        (itemDepth || 0) + 1,
      );
    },
    [index, itemDepth, itemId, onCreateFolder, setIsFolderCreationStarted],
  );

  return (
    <View style={treeListStyles.itemContainer}>
      <MaterialIcons
        name="folder"
        size={28}
        color={COLORS.secondaryLight}
        style={{
          marginRight: 5,
          marginLeft: nested ? 28 : 0,
        }}
      />
      <TextInput
        style={treeListStyles.input}
        placeholder="Enter folder name"
        onEndEditing={onEndEditing}
        maxLength={20}
        autoFocus
      />
    </View>
  );
}
