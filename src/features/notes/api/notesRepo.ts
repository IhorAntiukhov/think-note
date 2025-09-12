import supabase from "@/src/api/supabase";

export async function getItemsInFolders(
  userId: string,
  openedFolders: number[],
  sortBy: string,
  ascending: boolean,
  showOnlyMarked: boolean,
) {
  const query = getGeneralQuery(userId, sortBy, ascending, showOnlyMarked);

  const { data, error } = openedFolders.length
    ? await query.or(`depth.eq.1, folder_id.in.(${openedFolders.join(",")})`)
    : await query.eq("depth", 1);

  return { data, error };
}

export async function getAllItems(
  userId: string,
  sortBy: string,
  ascending: boolean,
  showOnlyMarked: boolean,
) {
  const { data, error } = await getGeneralQuery(
    userId,
    sortBy,
    ascending,
    showOnlyMarked,
  );

  return { data, error };
}

export async function getTopFolders(
  userId: string,
  sortBy: string,
  ascending: boolean,
  showOnlyMarked: boolean,
) {
  const { data, error } = await getGeneralQuery(
    userId,
    sortBy,
    ascending,
    showOnlyMarked,
  ).eq("depth", 1);

  return { data, error };
}

export async function getSingleNote(id: number) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function insertFolder(
  folderName: string,
  userId: string,
  parentFolderId: number | null,
  depth: number,
) {
  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        name: folderName,
        type: "folder",
        user_id: userId,
        folder_id: parentFolderId,
        depth,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function insertNote(
  noteName: string,
  userId: string,
  folderId: number,
  depth: number,
  content: string,
  numWords: number,
) {
  const { error } = await supabase.from("notes").insert([
    {
      name: noteName,
      type: "note",
      user_id: userId,
      folder_id: folderId,
      depth,
      content,
      num_words: numWords,
    },
  ]);

  return error;
}

export async function updateNote(
  id: number,
  noteName: string,
  content: string,
  numWords: number,
) {
  const { data, error } = await supabase
    .from("notes")
    .update({ name: noteName, content, num_words: numWords })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function markNote(id: number, isMarked: boolean) {
  const { error } = await supabase
    .from("notes")
    .update({ marked: isMarked })
    .eq("id", id);

  return error;
}

export async function incrementNoteVisits(id: number, numVisits: number) {
  await supabase
    .from("notes")
    .update({ num_visits: numVisits + 1 })
    .eq("id", id);
}

export async function deleteFolder(id: number) {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  return { error };
}

export async function deleteNote(id: number) {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  return error;
}

function getGeneralQuery(
  userId: string,
  sortBy: string,
  ascending: boolean,
  showOnlyMarked: boolean,
) {
  const query = supabase
    .from("notes")
    .select("id, name, marked, folder_id, depth, type")
    .eq("user_id", userId)
    .order(sortBy, { ascending });

  if (!showOnlyMarked) return query;

  return query.or("marked.eq.true, type.eq.folder");
}
