type OnCreateFolder = (
  folderName: string,
  parentIndex: number,
  parentFolderId: number | null,
  depth: number,
) => void;

export default OnCreateFolder;
