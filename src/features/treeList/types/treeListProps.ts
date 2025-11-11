import { IdeaCategoryRow } from "./ideaRow";
import { NoteFolderRow } from "./noteRow";

export interface NotesListProps {
  type: "notes";
  data: NoteFolderRow[];
  setData: (value: NoteFolderRow[]) => void;
  filterOrSortData: (data: NoteFolderRow[], tags: string[]) => NoteFolderRow[];
  showOnlyMarked: boolean;
  setShowOnlyMarked: (value: boolean) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
}

export interface IdeasListProps {
  type: "ideas";
  data: IdeaCategoryRow[];
  setData: (value: IdeaCategoryRow[]) => void;
  filterOrSortData: (data: IdeaCategoryRow[]) => IdeaCategoryRow[];
  showOnlyMarked?: undefined;
  setShowOnlyMarked?: undefined;
  selectedTags?: undefined;
  setSelectedTags?: undefined;
}
