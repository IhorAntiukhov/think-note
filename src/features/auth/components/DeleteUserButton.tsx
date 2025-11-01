import { deleteUser, signOut } from "@/src/features/auth/api/auth";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import OutlineButton from "@/src/ui/OutlineButton";
import { AuthError } from "@supabase/supabase-js";
import { useCallback } from "react";
import { deleteUserData } from "../api/userRepo";

export default function DeleteUserButton() {
  const { user } = useAuthStore().session!;
  const { showInfoDialog, showConfirmDialog } = useDialogStore();
  const { setAvatarUrl } = useAuthStore();

  const showUserDeletionDialog = useCallback(() => {
    showConfirmDialog(
      "User deletion",
      "Are you sure you want to delete your account? This operation is irreversible and will remove all the notes.",
      async () => {
        try {
          const databaseError = await deleteUserData(user.id);
          if (databaseError) throw databaseError;

          setAvatarUrl(null);

          const authError = await deleteUser(user!);
          if (authError) throw authError;

          const signOutError = await signOut();
          if (signOutError) throw signOutError;
        } catch (error) {
          showInfoDialog("User deletion failed", (error as AuthError).message);
        }
      },
    );
  }, [user, showConfirmDialog, showInfoDialog, setAvatarUrl]);

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
