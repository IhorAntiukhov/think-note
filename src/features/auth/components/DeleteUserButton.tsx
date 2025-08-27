import { deleteUser, signOut } from "@/src/api/auth";
import supabase from "@/src/api/supabase";
import useAuthStore from "@/src/store/authStore";
import OutlineButton from "@/src/ui/OutlineButton";
import { AuthError } from "@supabase/supabase-js";
import { useCallback } from "react";
import { Alert } from "react-native";

export default function DeleteUserButton() {
  const session = useAuthStore().session;
  const user = session?.user;

  const showUserDeletionDialog = useCallback(() => {
    Alert.alert(
      "User deletion",
      "Are you sure you want to delete your account? This operation is irreversible and will remove all the notes.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const { error: StorageError } = await supabase.storage
                .from("Avatars")
                .remove([user!.id]);
              if (StorageError) throw StorageError;

              const { error: AuthError } = await deleteUser(user!);
              if (AuthError) throw AuthError;

              await signOut();
            } catch (error) {
              Alert.alert(
                "User deletion failed",
                (error as AuthError).message,
                undefined,
                { cancelable: true },
              );
            }
          },
        },
      ],
    );
  }, [user]);

  return (
    <OutlineButton
      icon="delete"
      style={{ flexGrow: 1 }}
      onPress={showUserDeletionDialog}
    >
      Delete user
    </OutlineButton>
  );
}
