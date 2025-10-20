import supabase from "@/src/api/supabase";

export async function getAvailableTags(userId: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("id, label, color")
    .eq("user_id", userId);

  return { data, error };
}

export async function insertTag(userId: string, label: string, color: string) {
  const { data, error } = await supabase
    .from("tags")
    .insert({ user_id: userId, label, color })
    .select()
    .single();

  return { data, error };
}

export async function updateTag(id: number, label: string) {
  const { error } = await supabase.from("tags").update({ label }).eq("id", id);

  return error;
}

export async function deleteTag(id: number) {
  const { error } = await supabase.from("tags").delete().eq("id", id);

  return error;
}
