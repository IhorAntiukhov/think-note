import { View } from "react-native";
import AvatarWithUserName from "../../avatar/components/AvatarWithUserName";
import SearchWrapper from "../../search/components/SearchWrapper";
import NotesListHeader from "../components/NotesList";
import LIST_NAMES from "../constants/listNames";
import homeStyles from "../styles/home.styles";

export default function Home() {
  return (
    <View style={homeStyles.container}>
      <SearchWrapper>
        <View style={{ marginBottom: 20 }}>
          <AvatarWithUserName />
        </View>

        <View style={homeStyles.listsContainer}>
          <NotesListHeader listName={LIST_NAMES.UNCATEGORIZED} />
          <NotesListHeader listName={LIST_NAMES.MARKED} />
          <NotesListHeader listName={LIST_NAMES.RECENT} />
          <NotesListHeader listName={LIST_NAMES.MOST_VISITED} />
        </View>
      </SearchWrapper>
    </View>
  );
}
