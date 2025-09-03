import { Tables } from "@/src/types/supabase";

export default function sortItems(
  items: Tables<"notes">[],
  parentFolderId: number | null = null,
) {
  let result: Tables<"notes">[] = [];
  const children = items.filter((item) => item.folder_id === parentFolderId);

  children.forEach((item) => {
    result = [...result, item, ...sortItems(items, item.id)];
  });

  return result;
}
