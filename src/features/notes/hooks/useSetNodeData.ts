import useIdeaCategoriesStore from "@/src/store/ideaCategoriesStore";
import { EditorBridge } from "@10play/tentap-editor";
import { useEffect } from "react";
import { incrementNoteVisits, NoteData } from "../api/notesRepo";
import OldNoteData from "../types/oldNoteData";

export default function useSetNoteData(
  editor: EditorBridge,
  noteName: string | undefined,
  noteData: NoteData | null | undefined,
  setWordCount: (value: number) => void,
  setOldNoteData: (value: OldNoteData) => void,
  setSelectedTags: (value: string[]) => void,
  setAiResponseId: (value: number) => void,
  setAiResponseContent: (value: string) => void,
  setAiResponseCategory: (value: string) => void,
  isInitialDataSet: React.RefObject<boolean>,
) {
  const { categories } = useIdeaCategoriesStore();

  useEffect(() => {
    const setNoteData = async () => {
      if (
        editor.getEditorState().isReady &&
        noteData &&
        noteName &&
        !isInitialDataSet.current
      ) {
        const tags = noteData.tags_notes.map((tagNote) =>
          tagNote.tag_id.toString(),
        );

        setWordCount(noteData.num_words || 0);
        setOldNoteData({ content: noteData.content, title: noteName, tags });
        setSelectedTags(tags);

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
        isInitialDataSet.current = true;

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
    setOldNoteData,
    setSelectedTags,
    setAiResponseId,
    setAiResponseContent,
    setAiResponseCategory,
    isInitialDataSet,
  ]);
}
