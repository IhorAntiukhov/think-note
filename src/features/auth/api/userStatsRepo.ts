import supabase from "@/src/api/supabase";

export async function getNoteFolderCount(userId: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("type, count()")
    .eq("user_id", userId);

  return { data, error };
}

export async function getIdeaCount(userId: string) {
  const { data, error } = await supabase
    .from("ideas")
    .select("count()")
    .eq("user_id", userId)
    .eq("type", "note");

  return { data, error };
}
