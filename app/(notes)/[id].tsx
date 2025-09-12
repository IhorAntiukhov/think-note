import { getSingleNote } from "@/src/features/notes/api/notesRepo";
import SingleNote from "@/src/features/notes/screens/SingleNote";
import ScreenScrollWrapper from "@/src/navigation/ScreenScrollWrapper";
import { Tables } from "@/src/types/supabase";
import { errorAlert } from "@/src/utils/alerts";
import { PostgrestError } from "@supabase/supabase-js";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function EditNote() {
  const { id, name, isMarked } = useLocalSearchParams();
  const [noteData, setNoteData] = useState<Tables<"notes"> | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await getSingleNote(+(id as string));

        if (error) throw error;
        if (data) setNoteData(data);
      } catch (error) {
        errorAlert("Fetch failed", error as PostgrestError);
      }
    };

    fetchNote();
  }, [id]);

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
