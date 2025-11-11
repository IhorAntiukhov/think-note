import { NoteFolderRow } from "../types/noteRow";
import { sortItems } from "./sortItems";

export default function filterAndSortItems(
  items: NoteFolderRow[],
  tagIds: string[],
) {
  if (tagIds.length) {
    const filteredItems = items.filter(
      (value) =>
        value.tags_notes.some((tag) =>
          tagIds.includes(tag.tag_id.toString()),
        ) || value.type === "folder",
    );

    return sortItems<NoteFolderRow>(filteredItems);
  }

  return sortItems(items);
}
