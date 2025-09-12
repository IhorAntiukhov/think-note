import { COLORS } from "@/src/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import treeListStyles from "../styles/treeList.styles";
import { NoteRow } from "../types/rowTypes";

interface NoteItemProps {
  item: NoteRow;
}

export default function NoteItem({ item }: NoteItemProps) {
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
        </View>
      </Link>
    </View>
  );
}
