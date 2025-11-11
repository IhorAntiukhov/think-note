import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function useOpenNewNote(depth: number, folderId: number | null) {
  const router = useRouter();

  return useCallback(() => {
    router.push({
      pathname: "/(notes)/new-note",
      params: {
        folderId,
        depth,
      },
    });
  }, [router, folderId, depth]);
}
