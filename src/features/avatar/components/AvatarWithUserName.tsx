import useAuthStore from "@/src/store/authStore";
import { Text, View } from "react-native";
import avatarStyles from "../styles/avatar.styles";
import Avatar from "./Avatar";

export default function AvatarWithUserName() {
  const { user } = useAuthStore().session!;

  return (
    <View style={avatarStyles.avatarContainer}>
      <Avatar minimized />
      <Text style={{ fontSize: 18 }}>{user.user_metadata.username}</Text>
    </View>
  );
}
