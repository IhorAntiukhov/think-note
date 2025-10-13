import { COLORS } from "@/src/constants/theme";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import ContextMenu from "@/src/ui/ContextMenu";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, useSegments } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import treeListStyles from "../styles/treeList.styles";
import { NoteRow } from "../types/rowTypes";
import TagsDropdownItem from "./TagsDropdownItem";

interface NoteItemProps {
  item: NoteRow;
  index: number;
  selectedIndex: number | null;
  setSelectedIndex?: (index: number | null) => void;
  inSearchResults?: boolean;
}

export default function NoteItem({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  inSearchResults,
}: NoteItemProps) {
  const [isTagsMenuOpened, setIsTagsMenuOpened] = useState(false);
  const { availableTags } = useAvailableTagsStore();

  const router = useRouter();
  const pathname = useSegments();

  const leftOffset = (item.depth - 1) * 28;

  const openNote = useCallback(() => {
    if (selectedIndex === null && pathname[pathname.length - 1] !== "[id]") {
      router.push({
        pathname: "/(notes)/[id]",
        params: {
          id: item.id,
          name: item.name,
          isMarked: item.marked ? "1" : "",
        },
      });
    }
  }, [selectedIndex, router, pathname, item.id, item.name, item.marked]);

  const onSelectNote = useCallback(() => {
    if (selectedIndex === null) {
      setSelectedIndex?.(index);
    } else if (selectedIndex === index) {
      setSelectedIndex?.(null);
    }
  }, [index, selectedIndex, setSelectedIndex]);

  return (
    <TouchableOpacity
      style={{
        marginLeft: leftOffset,
        opacity: selectedIndex === index ? 0.5 : undefined,
      }}
      onPress={openNote}
      onLongPress={inSearchResults ? onSelectNote : undefined}
    >
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
    </TouchableOpacity>
  );
}
