interface Row {
  id: number;
  folder_id: number | null;
}

export function sortItems<T extends Row>(
  items: T[],
  parentFolderId: number | null = null,
) {
  let result: typeof items = [];
  const children = items.filter((item) => item.folder_id === parentFolderId);

  children.forEach((item) => {
    result = [...result, item, ...sortItems(items, item.id)];
  });

  return result;
}
