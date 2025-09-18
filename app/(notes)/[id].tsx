import { getSingleNote, NoteData } from "@/src/features/notes/api/notesRepo";
import SingleNote from "@/src/features/notes/screens/SingleNote";
import ScreenScrollWrapper from "@/src/navigation/ScreenScrollWrapper";
import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError } from "@supabase/supabase-js";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function EditNote() {
  const { id, name, isMarked } = useLocalSearchParams();
  const [noteData, setNoteData] = useState<NoteData | null>(null);

  const { showInfoDialog } = useDialogStore();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await getSingleNote(+(id as string));

        if (error) throw error;

        if (data) setNoteData(data);
      } catch (error) {
        showInfoDialog("Fetch failed", (error as PostgrestError).message);
      }
    };

    fetchNote();
  }, [id, showInfoDialog]);

  return (
    <ScreenScrollWrapper>
      <SingleNote
        type="editNote"
        noteData={noteData}
        noteName={name as string}
        isMarked={!!(isMarked as string)}
      />
    </ScreenScrollWrapper>
  );
}
