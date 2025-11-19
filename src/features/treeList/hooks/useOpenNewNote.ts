import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function useOpenNewNote(
  depth: number,
  folderId?: number | null,
  setIsMenuOpened?: (value: boolean) => void,
) {
  const router = useRouter();

  return useCallback(() => {
    router.push({
      pathname: "/(notes)/new-note",
      params: {
        folderId,
        depth,
      },
    });
    setIsMenuOpened?.(false);
  }, [router, folderId, depth, setIsMenuOpened]);
}
