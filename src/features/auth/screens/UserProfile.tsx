import { signOut } from "@/src/features/auth/api/auth";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import sharedStyles from "@/src/styles/shared.styles";
import OutlineButton from "@/src/ui/OutlineButton";
import { AuthError } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import Avatar from "../../avatar/components/Avatar";
import DeleteUserButton from "../components/DeleteUserButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import UserStats from "../components/UserStats";
import authStyles from "../styles/auth.styles";
import profileStyles from "../styles/profile.styles";

export default function UserProfile() {
  const { session } = useAuthStore();
  const { showInfoDialog } = useDialogStore();
  const user = session?.user;

  const [coverHeight, setCoverHeight] = useState(0);

  const handleSignOut = useCallback(async () => {
    try {
      const error = await signOut();

      if (error) throw error;
    } catch (error) {
      showInfoDialog("User sign out failed", (error as AuthError).message);
    }
  }, [showInfoDialog]);

  if (!user) return null;

  return (
    <View style={[sharedStyles.container, authStyles.container]}>
      <Card style={{ position: "relative", maxWidth: 640, width: "100%" }}>
        <Card.Cover
          source={require("@/src/assets/images/profile-cover.jpg")}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            setCoverHeight(height);
          }}
        />
        <View style={{ ...profileStyles.cover, height: coverHeight }}>
          <Avatar />

          <Text style={profileStyles.title}>{user.user_metadata.username}</Text>
          <Text style={profileStyles.subtitle}>{user.email}</Text>
        </View>
        <Card.Content style={profileStyles.cardBody}>
          <UpdateProfileForm />

          <Divider style={profileStyles.divider} />

          <UserStats />

          <Divider style={profileStyles.divider} />

          <View style={profileStyles.userControlButtons}>
            <OutlineButton
              icon="logout"
              style={{ flexGrow: 1 }}
              themeColor="secondary"
              onPress={handleSignOut}
            >
              Sign out
            </OutlineButton>

            <DeleteUserButton />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
