import { View } from "react-native";
import AvatarWithUserName from "../../avatar/components/AvatarWithUserName";
import SearchWrapper from "../../search/components/SearchWrapper";
import NotesList from "../components/NotesList";
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
          <NotesList listName={LIST_NAMES.UNCATEGORIZED} />
          <NotesList listName={LIST_NAMES.MARKED} />
          <NotesList listName={LIST_NAMES.RECENT} />
          <NotesList listName={LIST_NAMES.MOST_VISITED} />
        </View>
      </SearchWrapper>
    </View>
  );
}
