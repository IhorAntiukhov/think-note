import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function useOpenNewNote(
  depth: number,
  folderId?: number,
  setIsMenuOpened?: (value: boolean) => void,
) {
  const router = useRouter();

  return useCallback(() => {
    setIsMenuOpened?.(false);
    router.push({
      pathname: "/(notes)/new-note",
      params: {
        folderId,
        depth,
      },
    });
  }, [router, folderId, depth, setIsMenuOpened]);
}
