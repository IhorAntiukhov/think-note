import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { use } from "react";
import { Text, View } from "react-native";
import { NoteData } from "../api/noteListsStore";
import homeStyles from "../styles/home.styles";
import { NotesContext } from "./NotesList";

interface NoteProps {
  item: NoteData;
}

export default function NoteFooter({ item }: NoteProps) {
  const sortBy = use(NotesContext);

  return (
    <View style={homeStyles.noteFooter}>
      <View style={homeStyles.noteStat}>
        <MaterialIcons
          name={sortBy === "updated_at" ? "update" : "calendar-month"}
          size={20}
        />
        <Text>
          {formatDate(
            sortBy === "updated_at" ? item.updated_at : item.created_at,
          )}
        </Text>
      </View>

      <View style={homeStyles.noteStat}>
        <MaterialIcons
          name={sortBy === "num_words" ? "edit" : "file-open"}
          size={20}
        />
        <Text>
          {sortBy === "num_words" ? item.num_words : item.num_visits}
          {sortBy === "num_words" ? " words" : " visits"}
        </Text>
      </View>
    </View>
  );
}
