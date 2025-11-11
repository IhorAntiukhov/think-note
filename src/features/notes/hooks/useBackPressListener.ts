import useDialogStore from "@/src/store/dialogStore";
import { EditorBridge } from "@10play/tentap-editor";
import { EventArg, NavigationAction } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";

export default function useBackPressListener(
  editor: EditorBridge,
  oldNoteContent: string,
  disableSaveCheck: React.RefObject<boolean>,
) {
  const navigation = useNavigation();
  const { showConfirmDialog } = useDialogStore();

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
          showConfirmDialog(
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
  }, [navigation, editor, oldNoteContent, showConfirmDialog, disableSaveCheck]);
}
