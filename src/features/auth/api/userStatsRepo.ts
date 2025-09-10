import supabase from "@/src/api/supabase";

export async function getUserStats(id: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("type, count()")
    .eq("user_id", id);

  return { data, error };
}
