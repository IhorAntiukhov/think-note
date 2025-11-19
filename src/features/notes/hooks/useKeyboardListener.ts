import { EditorBridge, useBridgeState } from "@10play/tentap-editor";
import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";

export default function useKeyboardListener(
  editor: EditorBridge,
  setHideNoteStats: (value: boolean) => void,
) {
  const editorState = useBridgeState(editor);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      if (editorState.isFocused) setHideNoteStats(true);
    });

    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      async () => {
        setHideNoteStats(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [editor, editorState.isFocused, setHideNoteStats]);
}
