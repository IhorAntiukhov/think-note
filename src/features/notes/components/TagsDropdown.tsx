import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import useDialogStore from "@/src/store/dialogStore";
import dropdownStyles from "@/src/styles/dropdown.styles";
import TagsDropdownOption from "@/src/types/tagsDropdownOption";
import ImageButton from "@/src/ui/ImageButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { insertTag } from "../api/tagsRepo";
import TAGS_COLORS from "../constants/tagsColors";
import TagsDropdownItem from "./TagsDropdownItem";
import TagsDropdownSelectedItem from "./TagsDropdownSelectedItem";

interface TagsDropdownProps {
  selectedTags: string[];
  onChangeSelectedTags: (value: string[]) => void;
}

export default function TagsDropdown({
  selectedTags,
  onChangeSelectedTags,
}: TagsDropdownProps) {
  const [isFocus, setIsFocus] = useState(false);
  const { addTag, availableTags } = useAvailableTagsStore();
  const { showInfoDialog, showPromptDialog } = useDialogStore();
  const { user } = useAuthStore().session!;

  const createTag = useCallback(
    async (label: string) => {
      try {
        const maxIndex = 11;
        const minIndex = 0;

        const tagColor =
          TAGS_COLORS[
            Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex
          ].substring(1);

        const { data, error } = await insertTag(user.id, label, tagColor);

        if (error) throw error;
        if (data)
          addTag({
            label: data.label,
            color: data.color,
            value: data.id.toString(),
          });
      } catch (error) {
        showInfoDialog(
          "Tag addition failed",
          (error as PostgrestError).message,
        );
      }
    },
    [user.id, addTag, showInfoDialog],
  );

  const openAddTagDialog = () => {
    showPromptDialog("Add tag", "", "Type tag label", createTag, 20);
  };

  return (
    <View style={dropdownStyles.multiselectContainer}>
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <MultiSelect
          style={[
            dropdownStyles.dropdown,
            isFocus && { borderColor: COLORS.primary },
          ]}
          placeholderStyle={dropdownStyles.placeholder}
          selectedTextStyle={dropdownStyles.selectedText}
          data={availableTags}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select tags"
          value={selectedTags}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(value) => {
            onChangeSelectedTags([...value]);
          }}
          renderLeftIcon={() => (
            <MaterialCommunityIcons
              name="tag-plus"
              size={20}
              style={dropdownStyles.icon}
            />
          )}
          renderItem={(item: TagsDropdownOption) => (
            <TagsDropdownItem item={item} />
          )}
          renderSelectedItem={(item: TagsDropdownOption, unSelect) => (
            <TagsDropdownSelectedItem item={item} unSelect={unSelect} />
          )}
        />
      </View>
      <View style={{ marginTop: 5 }}>
        <ImageButton icon="tag-plus" onPress={openAddTagDialog} />
      </View>
    </View>
  );
}
