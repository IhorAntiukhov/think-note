import supabase from "@/src/api/supabase";

export async function searchNotes(query: string, userId: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("id, name, marked, tags_notes ( tag_id )")
    .eq("user_id", userId)
    .eq("type", "note")
    .ilike("name", `%${query}%`);

  return { data, error };
}

export type SearchNoteData = Awaited<ReturnType<typeof searchNotes>>["data"];
