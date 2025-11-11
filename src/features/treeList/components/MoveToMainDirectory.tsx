import OutlineButton from "@/src/ui/OutlineButton";
import { use } from "react";
import useMoveItem from "../hooks/useMoveItem";
import TreeListContext from "../context/treeListContext";

export default function MoveToMainDirectory() {
  const { data, selectedItemIndex } = use(TreeListContext)!;
  const moveItem = useMoveItem();

  return selectedItemIndex !== null &&
    data[selectedItemIndex].type === "folder" &&
    data[selectedItemIndex].folder_id !== null ? (
    <OutlineButton
      onPress={() => moveItem(null)}
      style={{
        alignSelf: "flex-start",
      }}
      icon="folder"
    >
      Move to the main directory
    </OutlineButton>
  ) : null;
}
