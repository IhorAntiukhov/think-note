import useAuthStore from "@/src/store/authStore";
import { View } from "react-native";
import SearchWrapper from "../../search/components/SearchWrapper";
import TreeList from "../components/TreeList";
import allNotesStyles from "../styles/allNotes.styles";

export default function AllNotes() {
  const { session } = useAuthStore();
  if (!session?.user) return null;

  return (
    <View style={allNotesStyles.container}>
      <SearchWrapper>
        <TreeList />
      </SearchWrapper>
    </View>
  );
}
