import { createContext } from "react";
import { IdeasListProps, NotesListProps } from "../types/treeListProps";
import LoadingAllState from "../types/loadingAllState";
import OpenedFolderType from "../types/openedFolderType";

interface SharedParams {
  userId: string;
  sortBy: string;
  isAscending: boolean;
  loadingAllState: LoadingAllState;
  setLoadingAllState: (value: LoadingAllState) => void;
  openedFolders: OpenedFolderType[];
  setOpenedFolders: React.Dispatch<React.SetStateAction<OpenedFolderType[]>>;
  selectedItemIndex: number | null;
  setSelectedItemIndex: (value: number | null) => void;
  newFolderDepth: number | null;
  setNewFolderDepth: (value: number | null) => void;
  loadingFolderId: number | null;
  setLoadingFolderId: (value: number | null) => void;
}

type NotesListParams = SharedParams & NotesListProps;

type IdeasListParams = SharedParams & IdeasListProps;

export type Params = NotesListParams | IdeasListParams | null;

const TreeListContext = createContext<Params>(null);

export default TreeListContext;
