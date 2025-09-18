import { create } from "zustand";
import DialogType from "../types/dialogType";

type OnConfirm = (text: string) => unknown;

interface DialogStore {
  dialogType: DialogType;
  title?: string;
  content?: string;
  placeholder?: string;
  onConfirm?: OnConfirm;
  maxLength?: number;
  showInfoDialog: (title: string, content: string) => void;
  showConfirmDialog: (
    title: string,
    content: string,
    onConfirm: OnConfirm,
  ) => void;
  showPromptDialog: (
    title: string,
    content: string,
    placeholder: string,
    onConfirm: OnConfirm,
    maxLength?: number,
  ) => void;
  hideDialog: () => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  dialogType: DialogType.unvisible,
  title: undefined,
  content: undefined,
  onConfirm: undefined,
  showInfoDialog: (title, content) =>
    set(() => ({
      dialogType: DialogType.info,
      title,
      content,
    })),
  showConfirmDialog: (title, content, onConfirm) =>
    set(() => ({
      dialogType: DialogType.confirm,
      title,
      content,
      onConfirm,
    })),
  showPromptDialog: (title, content, placeholder, onConfirm, maxLength) =>
    set(() => ({
      dialogType: DialogType.prompt,
      title,
      content,
      placeholder,
      onConfirm,
      maxLength,
    })),
  hideDialog: () => set(() => ({ dialogType: DialogType.unvisible })),
}));

export default useDialogStore;
