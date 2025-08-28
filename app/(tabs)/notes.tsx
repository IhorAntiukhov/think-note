import AllNotes from "@/src/features/notes/screens/AllNotes";
import ScreenScrollWrapper from "@/src/navigation/ScreenScrollWrapper";
import React from "react";

export default function NotesPage() {
  return (
    <ScreenScrollWrapper>
      <AllNotes />
    </ScreenScrollWrapper>
  );
}
