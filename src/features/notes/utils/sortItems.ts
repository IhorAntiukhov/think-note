import { TreeItemRow } from "../types/rowTypes";

export default function filterAndSortItems(
  items: TreeItemRow[],
  tagIds: string[],
) {
  if (tagIds.length) {
    return sortItems(
      items.filter(
        (value) =>
          value.tags_notes.some((tag) =>
            tagIds.includes(tag.tag_id.toString()),
          ) || value.type === "folder",
      ),
    );
  }

  return sortItems(items);
}

function sortItems(items: TreeItemRow[], parentFolderId: number | null = null) {
  let result: TreeItemRow[] = [];
  const children = items.filter((item) => item.folder_id === parentFolderId);

  children.forEach((item) => {
    result = [...result, item, ...sortItems(items, item.id)];
  });

  return result;
}
