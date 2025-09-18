import { COLORS } from "@/src/constants/theme";
import useAvailableTagsStore from "@/src/store/availableTagsStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Menu } from "react-native-paper";
import treeListStyles from "../styles/treeList.styles";
import { NoteRow } from "../types/rowTypes";
import TagsDropdownItem from "./TagsDropdownItem";

interface NoteItemProps {
  item: NoteRow;
}

export default function NoteItem({ item }: NoteItemProps) {
  const [isTagsMenuOpened, setIsTagsMenuOpened] = useState(false);
  const { availableTags } = useAvailableTagsStore();
  const leftOffset = (item.depth - 1) * 28;

  return (
    <View style={{ marginLeft: leftOffset }}>
      <Link
        href={{
          pathname: "/(notes)/[id]",
          params: {
            id: item.id,
            name: item.name,
            isMarked: item.marked ? "1" : "",
          },
        }}
      >
        <View style={treeListStyles.itemContainerWithGap}>
          <MaterialIcons
            name="note"
            size={28}
            color={COLORS.secondaryLighter}
          />
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
            <Menu
              visible={isTagsMenuOpened}
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
            </Menu>
          )}
        </View>
      </Link>
    </View>
  );
}
