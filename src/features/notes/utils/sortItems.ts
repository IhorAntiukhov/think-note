import { TreeItemRow } from "../types/rowTypes";

export default function sortItems(
  items: TreeItemRow[],
  parentFolderId: number | null = null,
) {
  let result: TreeItemRow[] = [];
  const children = items.filter((item) => item.folder_id === parentFolderId);

  children.forEach((item) => {
    result = [...result, item, ...sortItems(items, item.id)];
  });

  return result;
}
