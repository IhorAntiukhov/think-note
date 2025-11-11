import useIdeaCategoriesStore from "@/src/store/ideaCategoriesStore";
import { EditorBridge } from "@10play/tentap-editor";
import { useEffect } from "react";
import { incrementNoteVisits, NoteData } from "../api/notesRepo";

export default function useSetNoteData(
  editor: EditorBridge,
  noteName: string | undefined,
  noteData: NoteData | null | undefined,
  setWordCount: (value: number) => void,
  setOldNoteContent: (value: string) => void,
  setSelectedTags: (value: string[]) => void,
  setAiResponseId: (value: number) => void,
  setAiResponseContent: (value: string) => void,
  setAiResponseCategory: (value: string) => void,
) {
  const { categories } = useIdeaCategoriesStore();

  useEffect(() => {
    const setNoteData = async () => {
      if (noteData && noteName) {
        setWordCount(noteData.num_words || 0);
        setOldNoteContent(noteData.content);
        setSelectedTags(
          noteData.tags_notes.map((tagNote) => tagNote.tag_id.toString()),
        );

        if (noteData.ideas.length) {
          setAiResponseId(noteData.ideas[0].id);
          setAiResponseContent(noteData.ideas[0].content);
          setAiResponseCategory(
            categories.find(
              (category) => category.id === noteData.ideas[0].folder_id,
            )?.content || "",
          );
        }

        editor.setContent(noteData.content);

        await incrementNoteVisits(noteData.id, noteData.num_visits || 0);
      }
    };

    setNoteData();
  }, [
    editor,
    noteName,
    noteData,
    categories,
    setWordCount,
    setOldNoteContent,
    setSelectedTags,
    setAiResponseId,
    setAiResponseContent,
    setAiResponseCategory,
  ]);
}
