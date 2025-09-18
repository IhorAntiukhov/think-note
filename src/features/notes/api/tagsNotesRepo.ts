import supabase from "@/src/api/supabase";
import { Tables } from "@/src/types/supabase";

export async function getNoteTags(noteId: number) {
  const { data, error } = await supabase
    .from("tags_notes")
    .select("tags ( label, color )")
    .eq("note_id", noteId);

  return { data, error };
}

export async function addTagsToNotes(
  relations: Omit<Tables<"tags_notes">, "id">[],
) {
  const { error } = await supabase.from("tags_notes").insert(relations);

  return error;
}

export async function replaceNoteTags(
  noteId: number,
  relations: Omit<Tables<"tags_notes">, "id">[],
) {
  const { error: deleteError } = await supabase
    .from("tags_notes")
    .delete()
    .eq("note_id", noteId);

  if (deleteError) return deleteError;

  const { error: insertError } = await supabase
    .from("tags_notes")
    .insert(relations);

  if (insertError) return insertError;
}
