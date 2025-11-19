import { COLORS } from "@/src/constants/theme";
import { sharedStyles } from "@/src/styles/shared.styles";
import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { use } from "react";
import { Text, View } from "react-native";
import NoteInfoContext from "../context/noteInfoContext";
import singleNoteStyles from "../styles/singleNote.styles";

export default function NoteStats() {
  const { createdAt, updatedAt, numVisits, numWords } = use(NoteInfoContext);

  return (
    <>
      {createdAt && (
        <View style={singleNoteStyles.noteStat}>
          <MaterialIcons
            name="calendar-month"
            size={22}
            color={COLORS.secondary}
          />
          <Text style={sharedStyles.mediumText}>
            Created at {formatDate(createdAt)}
          </Text>
        </View>
      )}
      {updatedAt && (
        <View style={singleNoteStyles.noteStat}>
          <MaterialIcons name="update" size={22} color={COLORS.secondary} />
          <Text style={sharedStyles.mediumText}>
            Updated at {formatDate(updatedAt)}
          </Text>
        </View>
      )}
      {numVisits !== undefined && (
        <View style={singleNoteStyles.noteStat}>
          <MaterialIcons name="file-open" size={22} color={COLORS.secondary} />
          <Text style={sharedStyles.mediumText}>
            Visited {numVisits + 1} times
          </Text>
        </View>
      )}
      <View style={singleNoteStyles.noteStat}>
        <MaterialIcons name="abc" size={22} color={COLORS.secondary} />
        <Text style={sharedStyles.mediumText}>{numWords} words</Text>
      </View>
    </>
  );
}
