import supabase from "@/src/api/supabase";

export async function getAllItems(
  userId: string,
  openedFolders: number[],
  sortBy?: string,
  ascending?: boolean,
) {
  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .or(`depth.eq.1, folder_id.in.(${openedFolders.join(",")})`);

  if (sortBy && ascending) query = query.order("created_at", { ascending });

  const { data, error } = openedFolders.length
    ? await query.or(`depth.eq.1, folder_id.in.(${openedFolders.join(",")})`)
    : await query.eq("depth", 1);

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

export async function deleteFolder(id: number) {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  return { error };
}
