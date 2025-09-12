import { Tables } from "@/src/types/supabase";

type RowWithoutContent = Omit<
  Tables<"notes">,
  | "user_id"
  | "created_at"
  | "updated_at"
  | "content"
  | "num_words"
  | "num_visits"
>;

export interface FolderRow extends RowWithoutContent {
  type: "folder";
}

export interface NoteRow extends RowWithoutContent {
  type: "note";
}

export type TreeItemRow = FolderRow | NoteRow;
