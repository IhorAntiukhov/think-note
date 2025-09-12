import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import sharedStyles from "@/src/styles/shared.styles";
import { Tables } from "@/src/types/supabase";
import { confirmationAlert, errorAlert, infoAlert } from "@/src/utils/alerts";
import debounce from "@/src/utils/debounce";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { EventArg, NavigationAction } from "@react-navigation/native";
import { PostgrestError } from "@supabase/supabase-js";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { Appbar, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  deleteNote,
  incrementNoteVisits,
  insertNote,
  markNote,
  updateNote,
} from "../api/notesRepo";
import NoteStats from "../components/NoteStats";
import singleNoteStyles from "../styles/singleNote.styles";

const countWords = (text: string) => {
  return text.trim().split(/\s+/).length;
};

interface NewNote {
  type: "newNote";
  noteData?: undefined;
  noteName?: undefined;
  isMarked?: undefined;
}

interface EditNote {
  type: "editNote";
  noteData: Tables<"notes"> | null;
  noteName: string;
  isMarked: boolean;
}

type SingleNoteProps = NewNote | EditNote;

export default function SingleNote({
  type,
  noteData,
  noteName,
  isMarked,
}: SingleNoteProps) {
  const router = useRouter();
  const { folderId, depth } = useLocalSearchParams();
  const navigation = useNavigation();

  const { top } = useSafeAreaInsets();

  const [wordCount, setWordCount] = useState(0);
  const [noteTitle, setNoteTitle] = useState(noteName || "");
  const [hideNoteStats, setHideNoteStats] = useState(false);
  const [oldNoteContent, setOldNoteContent] = useState("<p></p>");
  const [isNoteMarked, setIsNoteMarked] = useState(isMarked || false);

  const isInitialDataSet = useRef(false);
  const disableSaveCheck = useRef(false);

  const { user } = useAuthStore().session!;

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    onChange: debounce(async () => {
      const rawText = await editor.getText();

      setWordCount(countWords(rawText));
    }, 1000),
  });

  useEffect(() => {
    const loadNoteData = async () => {
      if (noteData && noteName && !isInitialDataSet.current) {
        setWordCount(noteData.num_words || 0);
        setOldNoteContent(noteData.content);
        editor.setContent(noteData.content || "");

        await incrementNoteVisits(noteData.id, noteData.num_visits || 0);

        isInitialDataSet.current = true;
      }
    };

    loadNoteData();
  }, [editor, noteName, noteData]);

  useEffect(() => {
    const callback = async (
      event: EventArg<
        "beforeRemove",
        true,
        {
          action: NavigationAction;
        }
      >,
    ) => {
      if (event.data.action.type === "GO_BACK") {
        if (disableSaveCheck.current) return;
        event.preventDefault();

        const rawText = await editor.getHTML();

        if (rawText !== oldNoteContent) {
          confirmationAlert(
            "Go back",
            "You have unsaved changes. Are you sure you want to go back to the notes page?",
            () => navigation.dispatch(event.data.action),
          );
        } else {
          navigation.dispatch(event.data.action);
        }
      }
    };

    navigation.addListener("beforeRemove", callback);

    return () => {
      navigation.removeListener("beforeRemove", callback);
    };
  }, [navigation, editor, oldNoteContent]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setHideNoteStats(true);
    });

    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      async () => {
        setHideNoteStats(false);

        const rawText = await editor.getText();
        setWordCount(countWords(rawText));
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [editor]);

  const onMarkNote = useCallback(async () => {
    if (!noteData) return;

    try {
      const error = await markNote(noteData.id, !isNoteMarked);

      if (error) throw error;

      setIsNoteMarked(!isNoteMarked);
    } catch (error) {
      errorAlert("Failed to mark note", error as PostgrestError);
    }
  }, [isNoteMarked, noteData]);

  const onDeleteNote = useCallback(() => {
    if (!noteData) return;

    confirmationAlert(
      "Note deletion",
      "Are you sure you want to delete this note?",
      async () => {
        try {
          const error = await deleteNote(noteData.id);

          if (error) throw error;

          disableSaveCheck.current = true;
          router.back();
        } catch (error) {
          errorAlert("Failed to delete note", error as PostgrestError);
        }
      },
    );
  }, [noteData, router]);

  const onCreateNote = useCallback(async () => {
    if (!noteTitle) {
      infoAlert("Note creation", "Enter the title of your note");
      return;
    }

    try {
      const rawText = await editor.getHTML();

      const error = await insertNote(
        noteTitle,
        user.id,
        +(folderId as string),
        +(depth as string) + 1,
        rawText,
        countWords(rawText),
      );

      if (error) throw error;

      disableSaveCheck.current = true;
      router.back();
    } catch (error) {
      errorAlert("Note creation failed", error as PostgrestError);
    }
  }, [router, noteTitle, depth, editor, folderId, user.id]);

  const onUpdateNote = useCallback(async () => {
    if (!noteData) return;

    if (!noteTitle) {
      infoAlert("Note creation", "Enter the title of your note");
      return;
    }

    try {
      const rawText = await editor.getHTML();

      const { data, error } = await updateNote(
        noteData.id,
        noteTitle,
        rawText,
        countWords(rawText),
      );

      if (error) throw error;

      if (data) setOldNoteContent(data.content);

      infoAlert("Note updation", "Note successfully updated");
    } catch (error) {
      errorAlert("Note updation failed", error as PostgrestError);
    }
  }, [editor, noteData, noteTitle]);

  const onSaveNote = useCallback(async () => {
    if (type === "newNote") await onCreateNote();
    else await onUpdateNote();
  }, [onCreateNote, onUpdateNote, type]);

  return (
    <>
      <Appbar.Header
        style={{ backgroundColor: COLORS.secondary, marginTop: -top }}
      >
        <Appbar.BackAction onPress={() => router.back()} iconColor="white" />
        <Appbar.Content
          title={type === "newNote" ? "New note" : "Edit note"}
          color="white"
        />
        <Appbar.Action
          onPress={onMarkNote}
          icon={isNoteMarked ? "star" : "star-outline"}
          iconColor="white"
        />
        <Appbar.Action onPress={onDeleteNote} icon="delete" iconColor="white" />
        <Appbar.Action onPress={onSaveNote} icon="check" iconColor="white" />
      </Appbar.Header>

      <View style={singleNoteStyles.container}>
        <TextInput
          placeholder="Type note name"
          style={singleNoteStyles.noteTitleInput}
          value={noteTitle}
          onChangeText={(text) => setNoteTitle(text)}
        />

        {hideNoteStats && <Text>{wordCount} words</Text>}

        <Divider style={sharedStyles.divider} />

        {!hideNoteStats && (
          <>
            <NoteStats
              createdAt={noteData?.created_at}
              updatedAt={noteData?.updated_at}
              numVisits={noteData?.num_visits}
              numWords={wordCount}
            />

            <Divider style={sharedStyles.divider} />
          </>
        )}

        <RichText
          editor={editor}
          style={{
            backgroundColor: COLORS.background,
          }}
        />

        <View style={{ marginHorizontal: -20, paddingBottom: 10 }}>
          <Toolbar editor={editor} />
        </View>
      </View>
    </>
  );
}
