import { EditorBridge } from "@10play/tentap-editor";

export default async function countWords(editor: EditorBridge) {
  const rawText = await editor.getText();
  const trimmedText = rawText.trim();

  return trimmedText ? trimmedText.split(/\s+/).length : 0;
}
