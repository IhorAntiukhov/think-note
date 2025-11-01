import { createContext } from "react";

interface NoteInfoData {
  noteId?: number;
  createdAt?: string;
  updatedAt?: string;
  numVisits?: number;
  numWords: number;
  getNoteContent?: Promise<string>;
  aiResponseContent: string;
  aiResponseCategory: string;
  setAiResponseContent?: (value: string) => void;
  setAiResponseCategory?: (value: string) => void;
}

const NoteInfoContext = createContext<NoteInfoData>({
  createdAt: "",
  updatedAt: "",
  numWords: 0,
  aiResponseContent: "",
  aiResponseCategory: "",
});

export default NoteInfoContext;
