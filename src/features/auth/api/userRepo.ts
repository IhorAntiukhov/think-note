import supabase from "@/src/api/supabase";

export async function deleteUserData(userId: string) {
  const { error: storageError } = await supabase.storage
    .from("Avatars")
    .remove([`/${userId}`, `/${userId}/avatar.jpeg`]);

  if (storageError) return storageError;

  const { error: tableError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  return tableError;
}
