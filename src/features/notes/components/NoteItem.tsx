import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import useOpenNote from "../hooks/useOpenNote";
import { NoteRow } from "../types/rowTypes";
import NoteHeader from "./NoteHeader";

interface NoteItemProps {
  item: NoteRow;
  index: number;
  selectedIndex: number | null;
  setSelectedIndex?: (index: number | null) => void;
  inSearchResults?: boolean;
}

export default function NoteItem({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  inSearchResults,
}: NoteItemProps) {
  const leftOffset = (item.depth - 1) * 28;

  const openNote = useOpenNote(selectedIndex, item);

  const onSelectNote = useCallback(() => {
    if (selectedIndex === null) {
      setSelectedIndex?.(index);
    } else if (selectedIndex === index) {
      setSelectedIndex?.(null);
    }
  }, [index, selectedIndex, setSelectedIndex]);

  return (
    <TouchableOpacity
      style={{
        marginLeft: leftOffset,
        opacity: selectedIndex === index ? 0.5 : undefined,
      }}
      onPress={openNote}
      onLongPress={inSearchResults ? onSelectNote : undefined}
    >
      <NoteHeader item={item} />
    </TouchableOpacity>
  );
}
