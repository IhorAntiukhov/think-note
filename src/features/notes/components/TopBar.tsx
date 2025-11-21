import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import { EditorBridge } from "@10play/tentap-editor";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  deleteNote,
  insertNote,
  markNote,
  NoteData,
  updateNote,
} from "../api/notesRepo";
import OldNoteData from "../types/oldNoteData";
import countWords from "../utils/countWords";

interface TopBarProps {
  type: "newNote" | "editNote";
  noteData: NoteData | null | undefined;
  isMarked: boolean | undefined;
  editor: EditorBridge;
  disableSaveCheck: React.RefObject<boolean>;
  noteTitle: string;
  folderId: string;
  depth: string;
  selectedTags: string[];
  setOldNoteData: (value: OldNoteData) => void;
}

export default function TopBar({
  type,
  noteData,
  isMarked,
  editor,
  disableSaveCheck,
  noteTitle,
  folderId,
  depth,
  selectedTags,
  setOldNoteData,
}: TopBarProps) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const { showInfoDialog, showConfirmDialog } = useDialogStore();
  const { user } = useAuthStore().session!;

  const [isNoteMarked, setIsNoteMarked] = useState(isMarked || false);

  const onMarkNote = useCallback(async () => {
    if (!noteData) return;

    try {
      const error = await markNote(noteData.id, !isNoteMarked);

      if (error) throw error;

      setIsNoteMarked(!isNoteMarked);
    } catch (error) {
      showInfoDialog("Failed to mark note", (error as PostgrestError).message);
    }
  }, [isNoteMarked, noteData, showInfoDialog]);

  const onDeleteNote = useCallback(() => {
    if (!noteData) return;

    showConfirmDialog(
      "Note deletion",
      "Are you sure you want to delete this note? This action will also delete the idea generated from this note.",
      async () => {
        try {
          const error = await deleteNote(noteData.id);

          if (error) throw error;

          disableSaveCheck.current = true;
          router.back();
        } catch (error) {
          showInfoDialog(
            "Failed to delete note",
            (error as PostgrestError).message,
          );
        }
      },
    );
  }, [noteData, router, showConfirmDialog, showInfoDialog, disableSaveCheck]);

  const onCreateNote = useCallback(async () => {
    if (!noteTitle) {
      showInfoDialog("Note creation", "Enter the title of your note");
      return;
    }

    try {
      const rawText = await editor.getHTML();
      const numWords = await countWords(editor);

      const { error } = await insertNote(
        noteTitle,
        user.id,
        +(depth as string) + 1,
        rawText,
        numWords,
        selectedTags.map((tagId) => +tagId),
        folderId !== undefined ? +(folderId as string) : undefined,
      );

      if (error) throw error;

      disableSaveCheck.current = true;
      router.back();
    } catch (error) {
      showInfoDialog("Note creation failed", (error as PostgrestError).message);
    }
  }, [
    router,
    noteTitle,
    depth,
    editor,
    folderId,
    user.id,
    selectedTags,
    showInfoDialog,
    disableSaveCheck,
  ]);

  const onUpdateNote = useCallback(async () => {
    if (!noteData) return;

    if (!noteTitle) {
      showInfoDialog("Note creation", "Enter the title of your note");
      return;
    }

    try {
      const rawText = await editor.getHTML();
      const numWords = await countWords(editor);

      const { error: noteError } = await updateNote(
        noteData.id,
        user.id,
        noteTitle,
        rawText,
        numWords,
        selectedTags.map((tagId) => +tagId),
      );

      if (noteError) throw noteError;

      setOldNoteData({
        content: rawText,
        title: noteTitle,
        tags: selectedTags,
      });

      showInfoDialog("Note updation", "Note successfully updated");
    } catch (error) {
      showInfoDialog("Note updation failed", (error as PostgrestError).message);
    }
  }, [
    editor,
    noteData,
    noteTitle,
    selectedTags,
    user.id,
    setOldNoteData,
    showInfoDialog,
  ]);

  const onSaveNote = useCallback(async () => {
    if (type === "newNote") await onCreateNote();
    else await onUpdateNote();
  }, [type, onCreateNote, onUpdateNote]);

  return (
    <Appbar.Header
      style={{ backgroundColor: COLORS.secondary, marginTop: -top }}
    >
      <Appbar.BackAction onPress={() => router.back()} iconColor="white" />
      <Appbar.Content
        title={type === "newNote" ? "New note" : "Edit note"}
        color="white"
      />

      {type === "editNote" && (
        <>
          <Appbar.Action
            onPress={onMarkNote}
            icon={isNoteMarked ? "star" : "star-outline"}
            iconColor="white"
          />
          <Appbar.Action
            onPress={onDeleteNote}
            icon="delete"
            iconColor="white"
          />
        </>
      )}
      <Appbar.Action onPress={onSaveNote} icon="check" iconColor="white" />
    </Appbar.Header>
  );
}
