import useAuthStore from "@/src/store/authStore";
import { useState } from "react";
import { Text, View } from "react-native";
import { Divider, Searchbar } from "react-native-paper";
import Avatar from "../../auth/components/Avatar";
import TreeList from "../components/TreeList";
import allNotesStyles from "../styles/allNotes.styles";

export default function AllNotes() {
  const [searchQuery, setSearchQuery] = useState("");

  const { session } = useAuthStore();
  const { user } = session!;

  return (
    <View style={allNotesStyles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 20 }}
      />

      <View style={allNotesStyles.mainDirectory}>
        <Avatar minimized />
        <Text style={{ fontSize: 18 }}>{user.user_metadata.username}</Text>
      </View>

      <Divider style={{ marginHorizontal: -20, marginBottom: 10 }} />

      <TreeList />
    </View>
  );
}
