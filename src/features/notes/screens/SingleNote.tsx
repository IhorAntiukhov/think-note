import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import concatNumberString from "@/src/utils/concatNumberString";
import debounce from "@/src/utils/debounce";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { Divider } from "react-native-paper";
import { NoteData } from "../api/notesRepo";
import NoteInfo from "../components/NoteInfo";
import TopBar from "../components/TopBar";
import NoteInfoContext from "../context/noteInfoContext";
import useBackPressListener from "../hooks/useBackPressListener";
import useKeyboardListener from "../hooks/useKeyboardListener";
import useSetNoteData from "../hooks/useSetNodeData";
import singleNoteStyles from "../styles/singleNote.styles";
import OldNoteData from "../types/oldNoteData";
import countWords from "../utils/countWords";

interface NewNote {
  type: "newNote";
  noteData?: undefined;
  noteName?: undefined;
  isMarked?: undefined;
}

interface EditNote {
  type: "editNote";
  noteData: NoteData | null;
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
  const { folderId, depth } = useLocalSearchParams();

  const [wordCount, setWordCount] = useState(0);
  const [noteTitle, setNoteTitle] = useState(noteName || "");
  const [hideNoteStats, setHideNoteStats] = useState(false);
  const [oldNoteData, setOldNoteData] = useState<OldNoteData>({
    content: "<p></p>",
    title: noteName || "",
    tags: [],
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aiResponseId, setAiResponseId] = useState(0);
  const [aiResponseContent, setAiResponseContent] = useState("");
  const [aiResponseCategory, setAiResponseCategory] = useState("");

  const isInitialDataSet = useRef(false);
  const disableSaveCheck = useRef(false);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    onChange: debounce(async () => {
      const numWords = await countWords(editor);

      setWordCount(numWords);
    }, 50),
    initialContent: noteData?.content,
  });

  useSetNoteData(
    editor,
    noteName,
    noteData,
    setWordCount,
    setOldNoteData,
    setSelectedTags,
    setAiResponseId,
    setAiResponseContent,
    setAiResponseCategory,
    isInitialDataSet,
  );

  useKeyboardListener(editor, setHideNoteStats);

  useBackPressListener(
    editor,
    noteTitle,
    selectedTags,
    oldNoteData,
    disableSaveCheck,
  );

  return (
    <>
      <TopBar
        type={type}
        noteData={noteData}
        isMarked={isMarked}
        editor={editor}
        disableSaveCheck={disableSaveCheck}
        noteTitle={noteTitle}
        folderId={folderId as string}
        depth={depth as string}
        selectedTags={selectedTags}
        setOldNoteData={setOldNoteData}
      />

      <View style={[sharedStyles.container, singleNoteStyles.container]}>
        <TextInput
          placeholder="Type note name"
          style={[sharedStyles.input, singleNoteStyles.noteTitleInput]}
          value={noteTitle}
          onChangeText={(text) => setNoteTitle(text)}
          maxLength={40}
          placeholderTextColor="gray"
        />

        {hideNoteStats && <Text>{concatNumberString(wordCount, "word")}</Text>}

        <Divider style={sharedStyles.divider} />

        <View style={{ display: hideNoteStats ? "none" : "contents" }}>
          <NoteInfoContext
            value={{
              noteId: noteData?.id,
              createdAt: noteData?.created_at,
              updatedAt: noteData?.updated_at,
              numVisits: noteData?.num_visits,
              numWords: wordCount,
              getNoteContent: editor.getText(),
              aiResponseId,
              setAiResponseId,
              aiResponseContent,
              setAiResponseContent,
              aiResponseCategory,
              setAiResponseCategory,
            }}
          >
            <NoteInfo
              selectedTags={selectedTags}
              onChangeSelectedTags={setSelectedTags}
            />
          </NoteInfoContext>

          <Divider style={sharedStyles.divider} />
        </View>

        {Platform.OS === "web" && (
          <View style={[singleNoteStyles.toolbar, { marginHorizontal: 0 }]}>
            <Toolbar editor={editor} />
          </View>
        )}

        <RichText
          editor={editor}
          style={{
            backgroundColor: COLORS.background,
          }}
        />

        {Platform.OS !== "web" && (
          <View style={singleNoteStyles.toolbar}>
            <Toolbar editor={editor} />
          </View>
        )}
      </View>
    </>
  );
}
