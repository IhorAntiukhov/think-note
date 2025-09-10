import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import sharedStyles from "@/src/styles/shared.styles";
import { confirmationAlert, errorAlert, infoAlert } from "@/src/utils/alerts";
import debounce from "@/src/utils/debounce";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { PostgrestError } from "@supabase/supabase-js";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import { Appbar, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { insertNote } from "../api/notesRepo";
import NoteStats from "../components/NoteStats";
import singleNoteStyles from "../styles/singleNote.styles";

const countWords = (text: string) => {
  return text.trim().split(/\s+/).length;
};

export default function SingleNote() {
  const router = useRouter();
  const { folderId, depth } = useLocalSearchParams();

  const { top } = useSafeAreaInsets();

  const [wordCount, setWordCount] = useState(0);
  const [noteTitle, setNoteTitle] = useState("");

  const { user } = useAuthStore().session!;

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    onChange: debounce(async () => {
      const rawText = await editor.getText();

      setWordCount(countWords(rawText));
    }, 1000),
  });

  const onBack = useCallback(async () => {
    const rawText = await editor.getHTML();

    if (rawText !== "<p></p>") {
      confirmationAlert(
        "Go back",
        "You have unsaved changes. Are you sure you want to go back to the notes page?",
        () => router.replace("/(tabs)/notes"),
      );
    } else {
      router.replace("/(tabs)/notes");
    }
  }, [editor, router]);

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

      router.replace("/(tabs)/notes");
    } catch (error) {
      errorAlert("Note creation failed", error as PostgrestError);
    }
  }, [router, noteTitle, depth, editor, folderId, user.id]);

  return (
    <>
      <Appbar.Header
        style={{ backgroundColor: COLORS.secondary, marginTop: -top }}
      >
        <Appbar.BackAction onPress={onBack} iconColor="white" />
        <Appbar.Content title="New page" color="white" />
        <Appbar.Action onPress={onCreateNote} icon="check" iconColor="white" />
      </Appbar.Header>

      <View style={singleNoteStyles.container}>
        <TextInput
          placeholder="Type note name"
          style={singleNoteStyles.noteTitleInput}
          onChangeText={(text) => setNoteTitle(text)}
        />

        <Divider style={sharedStyles.divider} />

        <NoteStats numWords={wordCount} />

        <Divider style={sharedStyles.divider} />

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
