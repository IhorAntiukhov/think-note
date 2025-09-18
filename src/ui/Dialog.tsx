import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Dialog, Portal } from "react-native-paper";
import useDialogStore from "../store/dialogStore";
import dialogStyles from "../styles/dialog.styles";
import sharedStyles from "../styles/shared.styles";
import DialogType from "../types/dialogType";

export default function DialogModal() {
  const {
    dialogType,
    title,
    content,
    placeholder,
    onConfirm,
    maxLength,
    hideDialog,
  } = useDialogStore();

  const [value, setValue] = useState("");
  const setDefaultValueFlag = useRef(false);

  useEffect(() => {
    if (dialogType === DialogType.prompt && !setDefaultValueFlag.current) {
      setValue(content || "");

      setDefaultValueFlag.current = true;
    }
  }, [content, dialogType]);

  const onOk = () => {
    if (dialogType === DialogType.prompt && !value) return;

    hideDialog();

    const oldValue = value;
    setValue("");
    setDefaultValueFlag.current = false;
    onConfirm?.(oldValue);
  };

  const onHide = () => {
    setDefaultValueFlag.current = false;
    hideDialog();
  };

  return (
    <Portal>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <Dialog visible={dialogType !== DialogType.unvisible}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            {dialogType === DialogType.prompt ? (
              <TextInput
                value={value}
                onChangeText={(text) => setValue(text)}
                placeholder={placeholder}
                maxLength={maxLength}
                style={dialogStyles.textInput}
              />
            ) : (
              <Text style={sharedStyles.mediumText}>{content}</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            {(dialogType === DialogType.confirm ||
              dialogType === DialogType.prompt) && (
              <TouchableOpacity onPress={onHide}>
                <Text style={dialogStyles.button}>CANCEL</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onOk}>
              <Text style={dialogStyles.button}>OK</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  );
}
