import { createContext } from "react";

interface NoteInfoData {
  noteId?: number;
  createdAt?: string;
  updatedAt?: string;
  numVisits?: number;
  numWords: number;
  getNoteContent?: Promise<string>;
  aiResponseId: number;
  setAiResponseId?: (value: number) => void;
  aiResponseContent: string;
  setAiResponseContent?: (value: string) => void;
  aiResponseCategory: string;
  setAiResponseCategory?: (value: string) => void;
}

const NoteInfoContext = createContext<NoteInfoData>({
  createdAt: "",
  updatedAt: "",
  numWords: 0,
  aiResponseId: 0,
  aiResponseContent: "",
  aiResponseCategory: "",
});

export default NoteInfoContext;
