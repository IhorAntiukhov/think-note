import { IdeaData } from "../../ideas/api/ideasRepo";

export interface CategoryRow extends IdeaData {
  type: "folder";
}

export interface IdeaRow extends IdeaData {
  type: "note";
}

export type IdeaCategoryRow = CategoryRow | IdeaRow;
