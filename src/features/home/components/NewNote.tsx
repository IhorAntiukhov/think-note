import { COLORS } from "@/src/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, TouchableOpacity } from "react-native";
import useOpenNewNote from "../../treeList/hooks/useOpenNewNote";
import homeStyles from "../styles/home.styles";

export default function NewNote() {
  const openNoteCreationPage = useOpenNewNote(0);

  return (
    <TouchableOpacity
      style={homeStyles.newNoteContainer}
      onPress={openNoteCreationPage}
    >
      <MaterialCommunityIcons name="plus" size={32} color={COLORS.primary} />
      <Text style={homeStyles.newNoteText}>New note</Text>
    </TouchableOpacity>
  );
}
