import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import debounce from "@/src/utils/debounce";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Divider } from "react-native-paper";
import { NoteData } from "../api/notesRepo";
import NoteInfo from "../components/NoteInfo";
import TopBar from "../components/TopBar";
import NoteInfoContext from "../context/noteInfoContext";
import useBackPressListener from "../hooks/useBackPressListener";
import useKeyboardListener from "../hooks/useKeyboardListener";
import useSetNoteData from "../hooks/useSetNodeData";
import singleNoteStyles from "../styles/singleNote.styles";
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
  const [oldNoteContent, setOldNoteContent] = useState("<p></p>");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aiResponseId, setAiResponseId] = useState(0);
  const [aiResponseContent, setAiResponseContent] = useState("");
  const [aiResponseCategory, setAiResponseCategory] = useState("");

  const disableSaveCheck = useRef(false);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    onChange: debounce(async () => {
      const numWords = await countWords(editor);

      setWordCount(numWords);
    }, 50),
  });

  useSetNoteData(
    editor,
    noteName,
    noteData,
    setWordCount,
    setOldNoteContent,
    setSelectedTags,
    setAiResponseId,
    setAiResponseContent,
    setAiResponseCategory,
  );

  useKeyboardListener(editor, setHideNoteStats);

  useBackPressListener(editor, oldNoteContent, disableSaveCheck);

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
        setOldNoteContent={setOldNoteContent}
      />

      <View style={singleNoteStyles.container}>
        <TextInput
          placeholder="Type note name"
          style={singleNoteStyles.noteTitleInput}
          value={noteTitle}
          onChangeText={(text) => setNoteTitle(text)}
        />

        {hideNoteStats && <Text>{wordCount} words</Text>}

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
