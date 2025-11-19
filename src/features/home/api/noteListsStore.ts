import supabase from "@/src/api/supabase";

const SELECT_STATEMENT = "*, tags_notes ( tag_id )" as const;

export async function getUncategorizedNotes(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await supabase
    .from("notes")
    .select(SELECT_STATEMENT)
    .eq("user_id", userId)
    .eq("type", "note")
    .eq("depth", 1)
    .order(sortBy, { ascending });

  return { data, error };
}

type NoteDataList = Awaited<ReturnType<typeof getUncategorizedNotes>>["data"];
export type NoteData = NonNullable<NoteDataList>[number];

export async function getMarkedNotes(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await supabase
    .from("notes")
    .select(SELECT_STATEMENT)
    .eq("user_id", userId)
    .eq("type", "note")
    .eq("marked", true)
    .neq("depth", 1)
    .order(sortBy, { ascending });

  return { data, error };
}

export async function getRecentNotes(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await supabase
    .from("notes")
    .select(SELECT_STATEMENT)
    .eq("user_id", userId)
    .eq("type", "note")
    .neq("depth", 1)
    .limit(10)
    .order(sortBy, { ascending });

  return { data, error };
}

export async function getMostVisitedNotes(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await supabase
    .from("notes")
    .select(SELECT_STATEMENT)
    .eq("user_id", userId)
    .eq("type", "note")
    .limit(10)
    .neq("depth", 1)
    .order(`num_visits`, { ascending: false })
    .order(sortBy, { ascending });

  return { data, error };
}
