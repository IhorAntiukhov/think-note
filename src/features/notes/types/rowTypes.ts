import { NoteData } from "../api/notesRepo";

type RowWithoutContent = Omit<
  NonNullable<NoteData>,
  | "user_id"
  | "created_at"
  | "updated_at"
  | "content"
  | "num_words"
  | "num_visits"
  | "ideas"
>;

export interface FolderRow extends RowWithoutContent {
  type: "folder";
}

export interface NoteRow extends RowWithoutContent {
  type: "note";
}

export type TreeItemRow = FolderRow | NoteRow;
