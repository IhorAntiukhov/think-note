import React, { use } from "react";
import TreeListContext from "../context/treeListContext";
import useCreateFolder from "../hooks/useCreateFolder";
import FolderNameInput from "./FolderNameInput";

export default function MainDirectoryFolderInput() {
  const { newFolderDepth } = use(TreeListContext)!;
  const createFolder = useCreateFolder();

  return newFolderDepth ? (
    <FolderNameInput nested={false} index={0} onCreateFolder={createFolder} />
  ) : null;
}
