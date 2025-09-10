import supabase from "@/src/api/supabase";
import { deleteUser, signOut } from "@/src/features/auth/api/auth";
import useAuthStore from "@/src/store/authStore";
import OutlineButton from "@/src/ui/OutlineButton";
import { confirmationAlert, errorAlert } from "@/src/utils/alerts";
import { AuthError } from "@supabase/supabase-js";
import { useCallback } from "react";

export default function DeleteUserButton() {
  const { session } = useAuthStore();
  const user = session?.user;

  const showUserDeletionDialog = useCallback(() => {
    confirmationAlert(
      "User deletion",
      "Are you sure you want to delete your account? This operation is irreversible and will remove all the notes.",
      async () => {
        try {
          const { error: StorageError } = await supabase.storage
            .from("Avatars")
            .remove([user!.id]);
          if (StorageError) throw StorageError;

          const { error: AuthError } = await deleteUser(user!);
          if (AuthError) throw AuthError;

          await signOut();
        } catch (error) {
          errorAlert("User deletion failed", error as AuthError);
        }
      },
    );
  }, [user]);

  return (
    <OutlineButton
      icon="delete"
      themeColor="error"
      style={{ flexGrow: 1 }}
      onPress={showUserDeletionDialog}
    >
      Delete user
    </OutlineButton>
  );
}
