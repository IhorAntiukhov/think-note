import supabase from "@/src/api/supabase";

export async function getFromStorage(path: string) {
  const { data, error } = await supabase.storage.from("Avatars").download(path);

  return { data, error };
}
