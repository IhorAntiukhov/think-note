import { COLORS } from "@/src/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import useOpenNote from "../hooks/useOpenNote";
import treeListStyles from "../styles/treeList.styles";
import { IdeaRow } from "../types/ideaRow";

interface IdeaItemProps {
  item: IdeaRow;
  index: number;
  selectedIndex: number | null;
  setSelectedIndex?: (index: number | null) => void;
  inSearchResults?: boolean;
}

export default function IdeaItem({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  inSearchResults,
}: IdeaItemProps) {
  const { id, name, marked } = item.notes!;
  const openNote = useOpenNote(null, { id, name, marked });

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
        marginLeft: inSearchResults ? undefined : 28,
      }}
      onPress={openNote}
      onLongPress={inSearchResults ? undefined : onSelectNote}
    >
      <Card style={{ shadowColor: "transparent" }}>
        <Card.Content>
          <View style={treeListStyles.ideaContainer}>
            <View style={treeListStyles.itemContainerWithGap}>
              <MaterialIcons
                name="lightbulb"
                size={28}
                color={COLORS.secondaryLighter}
              />
              {marked && (
                <MaterialIcons
                  name="star"
                  size={28}
                  color={COLORS.accent}
                  style={{ marginRight: -3 }}
                />
              )}
              <Text style={treeListStyles.text}>{name}</Text>
            </View>

            <Text style={treeListStyles.text}>{item.content}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
