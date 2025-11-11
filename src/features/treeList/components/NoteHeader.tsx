import { COLORS } from "@/src/constants/theme";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import ContextMenu from "@/src/ui/ContextMenu";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Text, View } from "react-native";
import TagsDropdownItem from "../../sortingAndFiltering/components/TagsDropdownItem";
import treeListStyles from "../styles/treeList.styles";
import { NoteRow } from "../types/noteRow";

interface NoteHeaderProps {
  item: NoteRow;
}

export default function NoteHeader({ item }: NoteHeaderProps) {
  const [isTagsMenuOpened, setIsTagsMenuOpened] = useState(false);
  const { availableTags } = useAvailableTagsStore();

  return (
    <View style={treeListStyles.itemContainerWithGap}>
      <MaterialIcons name="note" size={28} color={COLORS.secondaryLighter} />
      {item.marked && (
        <MaterialIcons
          name="star"
          size={28}
          color={COLORS.accent}
          style={{ marginRight: -3 }}
        />
      )}
      <Text style={treeListStyles.text}>{item.name}</Text>
      {!!item.tags_notes.length && (
        <ContextMenu
          isOpened={isTagsMenuOpened}
          onDismiss={() => setIsTagsMenuOpened(false)}
          anchor={
            <MaterialCommunityIcons
              name="tag"
              size={22}
              color={COLORS.primary}
              onPress={() => setIsTagsMenuOpened(true)}
              style={{ marginLeft: 5 }}
            />
          }
        >
          {item.tags_notes.map(({ tag_id }) => {
            const tag = availableTags.find((tag) => +tag.value === tag_id);

            if (!tag) return null;
            return (
              <TagsDropdownItem
                key={tag_id}
                item={{
                  value: tag_id.toString(),
                  label: tag.label,
                  color: tag.color,
                }}
                readonly
              />
            );
          })}
        </ContextMenu>
      )}
    </View>
  );
}
