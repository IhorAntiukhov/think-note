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
    .select("*, tags_notes ( tag_id ), ideas ( content, folder_id )")
    .eq("id", id)
    .single();

  return { data, error };
}

export type NoteData = Awaited<ReturnType<typeof getSingleNote>>["data"];

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
  name: string,
  userId: string,
  depth: number,
  content: string,
  numWords: number,
  tagIds: number[],
  folderId?: number,
) {
  const { error } = await supabase.rpc("insert_note", {
    name,
    user_id: userId,
    folder_id: folderId,
    depth,
    content,
    num_words: numWords,
    tag_ids: tagIds,
  });

  return { error };
}

export async function updateNote(
  id: number,
  userId: string,
  name: string,
  content: string,
  numWords: number,
  tagIds: number[],
) {
  const { error } = await supabase.rpc("update_note", {
    noteid: id,
    userid: userId,
    newname: name,
    newcontent: content,
    newnumwords: numWords,
    tagids: tagIds,
  });

  return { error };
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

  return error;
}

export async function renameFolder(id: number, name: string) {
  const { error } = await supabase.from("notes").update({ name }).eq("id", id);

  return error;
}

export async function deleteNote(id: number) {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  return error;
}

export async function changeParentFolder(
  id: number,
  currentDepth: number,
  newFolderId?: number,
) {
  const { error } = await supabase.rpc("move_item", {
    rowid: id,
    currentdepth: currentDepth,
    newfolderid: newFolderId,
  });

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
    .select("id, name, marked, folder_id, depth, type, tags_notes ( tag_id )")
    .eq("user_id", userId)
    .order(sortBy, { ascending });

  if (showOnlyMarked) return query.or("marked.eq.true, type.eq.folder");

  return query;
}
