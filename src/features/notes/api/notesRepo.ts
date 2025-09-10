import supabase from "@/src/api/supabase";

export async function getItemsInFolders(
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

export async function getAllItems(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await getGeneralQuery(userId, sortBy, ascending);

  return { data, error };
}

export async function getTopFolders(
  userId: string,
  sortBy: string,
  ascending: boolean,
) {
  const { data, error } = await getGeneralQuery(userId, sortBy, ascending).eq(
    "depth",
    1,
  );

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

export async function deleteFolder(id: number) {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  return { error };
}

function getGeneralQuery(userId: string, sortBy: string, ascending: boolean) {
  return supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order(sortBy, { ascending });
}
