import { COLORS } from "@/src/constants/theme";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import useDialogStore from "@/src/store/dialogStore";
import dropdownStyles from "@/src/styles/dropdown.styles";
import TagsDropdownOption from "@/src/types/tagsDropdownOption";
import { PostgrestError } from "@supabase/supabase-js";
import React from "react";
import { GestureResponderEvent, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { deleteTag, updateTag } from "../api/tagsRepo";

interface TagsDropdownItemProps {
  item: TagsDropdownOption;
  readonly?: boolean;
}

export default function TagsDropdownItem({
  item,
  readonly,
}: TagsDropdownItemProps) {
  const { editTag, removeTag } = useAvailableTagsStore();
  const { showInfoDialog, showPromptDialog } = useDialogStore();

  const onEditTag = (event: GestureResponderEvent) => {
    event.stopPropagation();

    showPromptDialog("Edit tag", item.label, "Type tag label", async (text) => {
      try {
        const error = await updateTag(+item.value, text);

        if (error) throw error;

        editTag(item.value, text);
      } catch (error) {
        showInfoDialog("Tag editing failed", (error as PostgrestError).message);
      }
    });
  };

  const onDeleteTag = async (event: GestureResponderEvent) => {
    event.stopPropagation();

    try {
      const error = await deleteTag(+item.value);

      if (error) throw error;

      removeTag(item.value);
    } catch (error) {
      showInfoDialog("Tag deletion failed", (error as PostgrestError).message);
    }
  };

  return (
    <View
      style={[
        dropdownStyles.itemContainer,
        { minWidth: readonly ? 165 : undefined },
      ]}
    >
      {item.color && (
        <View
          style={[
            dropdownStyles.tagColor,
            { backgroundColor: `#${item.color}` },
          ]}
        ></View>
      )}
      <Text style={dropdownStyles.tagLabel}>{item.label}</Text>

      {item.color && !readonly && (
        <View style={dropdownStyles.changeTagButtons}>
          <IconButton
            icon="pencil"
            size={22}
            iconColor={COLORS.secondary}
            style={{ margin: 0 }}
            onPress={onEditTag}
          />
          <IconButton
            icon="delete"
            size={22}
            iconColor={COLORS.secondary}
            style={{ margin: 0 }}
            onPress={onDeleteTag}
          />
        </View>
      )}
    </View>
  );
}
