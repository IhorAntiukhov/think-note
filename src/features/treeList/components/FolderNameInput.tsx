import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback } from "react";
import { TextInput, TextInputSubmitEditingEvent, View } from "react-native";
import treeListStyles from "../styles/treeList.styles";
import OnCreateFolder from "../types/onCreateFolder";

interface FolderNameInputProps {
  type: "notes" | "ideas";
  nested: boolean;
  onCreateFolder: OnCreateFolder;
  index: number;
  setIsFolderCreationStarted?: (value: boolean) => void;
  itemId?: number;
  itemDepth?: number;
}

export default function FolderNameInput({
  type,
  nested,
  onCreateFolder,
  index,
  setIsFolderCreationStarted,
  itemId,
  itemDepth,
}: FolderNameInputProps) {
  const onEndEditing = useCallback(
    (event: TextInputSubmitEditingEvent) => {
      setIsFolderCreationStarted?.(false);
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
        style={sharedStyles.input}
        placeholder={`Enter ${type === "notes" ? "folder" : "category"} name`}
        onSubmitEditing={onEndEditing}
        maxLength={20}
        autoFocus
      />
    </View>
  );
}
