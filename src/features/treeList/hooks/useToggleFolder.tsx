import { use, useCallback } from "react";
import TreeListContext from "../context/treeListContext";

export default function useToggleFolder() {
  const {
    type,
    data,
    setData,
    openedFolders,
    setOpenedFolders,
    setLoadingFolderId,
  } = use(TreeListContext)!;

  return useCallback(
    (
      isOpened: boolean,
      currentFolderId: number,
      parentFolderId: number | null,
    ) => {
      if (isOpened) {
        setOpenedFolders((state) => [
          ...state,
          { currentFolderId, parentFolderId },
        ]);
        setLoadingFolderId(currentFolderId);
      } else {
        if (type === "notes") {
          let previousFolderId = 0;

          const newFolders = [...openedFolders];
          const filteredFolders = newFolders.filter(
            ({
              currentFolderId: currentOpenedFolderId,
              parentFolderId: parentOpenedFolderId,
            }) => {
              if (currentOpenedFolderId === currentFolderId) {
                previousFolderId = currentOpenedFolderId;
                return false;
              }
              if (parentOpenedFolderId === previousFolderId) {
                previousFolderId = currentOpenedFolderId;
                return false;
              }
              return true;
            },
          );

          setOpenedFolders(filteredFolders);

          const newData = [...data];
          setData(
            newData.filter(
              (item) =>
                !(
                  item.depth !== 1 &&
                  (item.folder_id === currentFolderId ||
                    filteredFolders.findIndex(
                      (openedFolder) =>
                        item.folder_id === openedFolder.currentFolderId,
                    ) === -1)
                ),
            ),
          );
        } else {
          setOpenedFolders(
            openedFolders.filter(
              ({ currentFolderId: currentOpenedFolderId }) =>
                currentOpenedFolderId !== currentFolderId,
            ),
          );

          const newData = [...data];
          setData(newData.filter((item) => item.folder_id !== currentFolderId));
        }
      }
    },
    [type, data, setData, openedFolders, setLoadingFolderId, setOpenedFolders],
  );
}
