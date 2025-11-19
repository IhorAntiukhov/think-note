import supabase from "@/src/api/supabase";

export async function deleteUserData(userId: string) {
  const { error: tableError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (tableError) return tableError;

  const { error: storageError } = await supabase.storage
    .from("Avatars")
    .remove([`${userId}/avatar.jpeg`]);

  if (storageError) return storageError;
}
