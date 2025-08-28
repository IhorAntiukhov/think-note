import useAuthStore from "@/src/store/authStore";
import { useState } from "react";
import { Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import Avatar from "../../auth/components/Avatar";
import allNotesStyles from "../styles/allNotes.styles";

export default function AllNotes() {
  const { session } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!session?.user) return null;
  const { user } = session;

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
    </View>
  );
}
