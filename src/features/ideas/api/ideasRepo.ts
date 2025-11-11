import supabase from "@/src/api/supabase";

export async function getIdeaCategories(userId: string) {
  const { data, error } = await supabase
    .from("ideas")
    .select("id, content")
    .eq("type", "folder")
    .eq("user_id", userId);

  return { data, error };
}

export async function getIdeaCategoriesSorted(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await getGeneralQuery(userId, sortBy, ascending).eq(
    "type",
    "folder",
  );

  return { data, error };
}

export async function getAllIdeas(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await getGeneralQuery(userId, sortBy, ascending);

  return { data, error };
}

function getGeneralQuery(userId: string, sortBy: string, ascending: boolean) {
  return supabase
    .from("ideas")
    .select("id, folder_id, type, content, notes ( id, name, marked )")
    .eq("user_id", userId)
    .order(sortBy, { ascending })
    .order("content", { ascending });
}

type IdeaList = NonNullable<
  Awaited<ReturnType<typeof getGeneralQuery>>["data"]
>;
export type IdeaData = IdeaList[number];

export async function getIdeasInCategories(
  userId: string,
  openedFolders: number[],
  sortBy: string,
  ascending: boolean,
) {
  const query = getGeneralQuery(userId, sortBy, ascending);

  const { data, error } = openedFolders.length
    ? await query.or(
        `type.eq.folder, folder_id.in.(${openedFolders.join(",")})`,
      )
    : await query.eq("type", "folder");

  return { data, error };
}

export async function saveIdea(
  content: string,
  noteId: number,
  userId: string,
  folderId?: number,
) {
  const { data, error } = await supabase.rpc("save_idea", {
    content,
    note_id: noteId,
    user_id: userId,
    folder_id: folderId,
  });

  return { data, error };
}

export async function insertCategory(content: string, userId: string) {
  const { data, error } = await supabase
    .from("ideas")
    .insert([{ type: "folder", content, user_id: userId }])
    .select("id, folder_id, type, content, notes ( id, name, marked )")
    .single();

  return { data, error };
}

export async function deleteIdeaOrCategory(id: number) {
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

export async function changeIdeaCategory(id: number, newCategoryid: number) {
  const { error } = await supabase
    .from("ideas")
    .update({ folder_id: newCategoryid })
    .eq("id", id);

  return error;
}
