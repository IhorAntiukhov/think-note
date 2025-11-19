import { View } from "react-native";
import AvatarWithUserName from "../../avatar/components/AvatarWithUserName";
import SearchWrapper from "../../search/components/SearchWrapper";
import NotesList from "../components/NotesList";
import LIST_NAMES from "../constants/listNames";
import homeStyles from "../styles/home.styles";
import { sharedStyles, sharedStylesIds } from "@/src/styles/shared.styles";

export default function Home() {
  return (
    <View
      style={[homeStyles.container, sharedStyles.container]}
      dataSet={{ media: sharedStylesIds.container }}
    >
      <SearchWrapper type="notes">
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
