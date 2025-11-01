import supabase from "@/src/api/supabase";

export async function getIdeaCategories(userId: string) {
  const { data, error } = await getGeneralQuery(userId);

  return { data, error };
}

export async function getIdeaCategoriesSorted(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await getGeneralQuery(userId, sortBy, ascending);

  return { data, error };
}

export async function getAllIdeas(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await supabase
    .from("ideas")
    .select("id, content")
    .eq("user_id", userId)
    .order(sortBy, { ascending });

  return { data, error };
}

export async function getIdeasInCategories(
  userId: string,
  openedFolders: number[],
  sortBy: string,
  ascending: boolean,
) {
  const query = getGeneralQuery(userId, sortBy, ascending);

  const { data, error } = openedFolders.length
    ? await query.or(`depth.eq.1, folder_id.in.(${openedFolders.join(",")})`)
    : await query.eq("depth", 1);

  return { data, error };
}

export async function saveIdea(
  content: string,
  noteId: number,
  userId: string,
  folderId?: number,
) {
  const { error } = await supabase.rpc("save_idea", {
    content,
    note_id: noteId,
    user_id: userId,
    folder_id: folderId,
  });

  return error;
}

export async function deleteIdea(id: number) {
  const { error } = await supabase.from("ideas").delete().eq("id", id);

  return error;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase.from("ideas").delete().eq("id", id);

  return error;
}

export async function renameCategory(id: number, content: string) {
  const { error } = await supabase
    .from("ideas")
    .update({ content })
    .eq("id", id);

  return error;
}

export async function changeIdeaCategory() {}

function getGeneralQuery(userId: string, sortBy?: string, ascending?: boolean) {
  const query = supabase
    .from("ideas")
    .select("id, content")
    .eq("type", "folder")
    .eq("user_id", userId);

  if (sortBy) {
    query.order(sortBy, { ascending });
  }

  return query;
}
