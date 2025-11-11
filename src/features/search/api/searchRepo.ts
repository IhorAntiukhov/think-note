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

export async function searchIdeas(query: string, userId: string) {
  const { data, error } = await supabase
    .from("ideas")
    .select("id, folder_id, content, notes ( id, name, marked )")
    .eq("user_id", userId)
    .eq("type", "note")
    .ilike("content", `%${query}%`);

  return { data, error };
}

export type SearchNoteData = Awaited<ReturnType<typeof searchNotes>>["data"];
export type SearchIdeaData = Awaited<ReturnType<typeof searchIdeas>>["data"];
