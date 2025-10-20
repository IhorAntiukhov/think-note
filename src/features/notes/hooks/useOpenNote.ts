import { useRouter, useSegments } from "expo-router";
import { useCallback } from "react";

interface NoteData {
  id: number;
  name: string;
  marked: boolean;
  [key: string]: any;
}

export default function useOpenNote(
  selectedIndex: number | null,
  item: NoteData,
) {
  const router = useRouter();
  const pathname = useSegments();

  const openNote = useCallback(() => {
    if (selectedIndex === null && pathname[pathname.length - 1] !== "[id]") {
      router.push({
        pathname: "/(notes)/[id]",
        params: {
          id: item.id,
          name: item.name,
          isMarked: item.marked ? "1" : "",
        },
      });
    }
  }, [selectedIndex, router, pathname, item.id, item.name, item.marked]);

  return openNote;
}
