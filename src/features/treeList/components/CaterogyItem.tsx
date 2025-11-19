import { COLORS } from "@/src/constants/theme";
import useDialogStore from "@/src/store/dialogStore";
import { sharedStyles } from "@/src/styles/shared.styles";
import ContextMenu from "@/src/ui/ContextMenu";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PostgrestError } from "@supabase/supabase-js";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Menu } from "react-native-paper";
import {
  deleteIdeaOrCategory,
  renameCategory,
} from "../../ideas/api/ideasRepo";
import { deleteFolder, renameFolder } from "../../notes/api/notesRepo";
import FolderInputState from "../../notes/types/folderInputState";
import { CategoryRow } from "../../treeList/types/ideaRow";
import { FolderRow } from "../../treeList/types/noteRow";
import treeListStyles from "../styles/treeList.styles";
import CategoryItemRef from "../types/categoryItemRef";

interface SharedProps {
  index: number;
  selectedIndex: number | null;
  moveItem: (index: number) => void;
  isFolderOpened: boolean;
  onFolderToggle: (
    isOpened: boolean,
    currentFolderId: number,
    parentFolderId: number | null,
  ) => void;
  onUpdateFolders: () => void;
  isLoading: boolean;
  isFolderCreationStarted?: boolean;
  additionalMenuItems?: React.ReactNode;
  onSelectFolder?: () => void;
}

interface FolderItemProps extends SharedProps {
  type: "folder";
  item: FolderRow;
}

interface CategoryItemProps extends SharedProps {
  type: "category";
  item: CategoryRow;
}

type FolderCategoryItemProps = FolderItemProps | CategoryItemProps;

const CategoryItem = forwardRef<CategoryItemRef, FolderCategoryItemProps>(
  (
    {
      type,
      item,
      index,
      selectedIndex,
      moveItem,
      isFolderOpened,
      onFolderToggle,
      onUpdateFolders,
      isLoading,
      isFolderCreationStarted,
      additionalMenuItems,
      onSelectFolder,
    },
    ref,
  ) => {
    const typeCapitalized = type.at(0)?.toUpperCase() + type.slice(1);

    const [folderInputState, setFolderInputState] = useState(
      FolderInputState.closed,
    );
    const [isMenuOpened, setIsMenuOpened] = useState(false);

    const { showInfoDialog, showConfirmDialog } = useDialogStore();

    useImperativeHandle(ref, () => ({
      setIsMenuOpened,
    }));

    useEffect(() => {
      if (isFolderCreationStarted) setIsMenuOpened(false);
    }, [isFolderCreationStarted]);

    const toggleFolder = () => {
      if (selectedIndex === null) {
        onFolderToggle!(!isFolderOpened, item.id, item.folder_id);
      } else if (selectedIndex !== index) {
        moveItem(index);
      }
    };

    const onDeleteFolder = useCallback(async () => {
      showConfirmDialog(
        `${typeCapitalized} deletion`,
        `Are you sure you want to delete ${type} "${type === "folder" ? item?.name : item?.content}"? This operation is irreversible and will remove all the nested ${type === "folder" ? "notes and folders" : "ideas"}.`,
        async () => {
          try {
            const error = await (
              type === "folder" ? deleteFolder : deleteIdeaOrCategory
            )(item!.id);

            if (error) throw error;

            onUpdateFolders!();
          } catch (error) {
            showInfoDialog(
              `${typeCapitalized} deletion failed`,
              (error as PostgrestError).message,
            );
          }
        },
      );
      setIsMenuOpened(false);
    }, [
      type,
      typeCapitalized,
      item,
      onUpdateFolders,
      showConfirmDialog,
      showInfoDialog,
    ]);

    const startFolderEdition = useCallback(() => {
      setFolderInputState(FolderInputState.renameFolder);
      setIsMenuOpened(false);
    }, []);

    const onRenameFolder = useCallback(
      async (event: TextInputSubmitEditingEvent) => {
        try {
          const error = await (
            type === "folder" ? renameFolder : renameCategory
          )(item!.id, event.nativeEvent.text);

          if (error) throw error;

          onUpdateFolders!();
          setFolderInputState(FolderInputState.closed);
        } catch (error) {
          showInfoDialog(
            `${typeCapitalized} edition failed`,
            (error as PostgrestError).message,
          );
        }
      },
      [type, item, typeCapitalized, onUpdateFolders, showInfoDialog],
    );

    return (
      <View
        style={[
          treeListStyles.itemContainerWithGap,
          selectedIndex === index && { opacity: 0.5 },
        ]}
      >
        <TouchableOpacity
          style={treeListStyles.itemContainer}
          onPress={
            folderInputState !== FolderInputState.renameFolder
              ? toggleFolder
              : undefined
          }
          onLongPress={
            folderInputState !== FolderInputState.renameFolder
              ? onSelectFolder
              : undefined
          }
        >
          <MaterialCommunityIcons
            name={isFolderOpened ? "chevron-down" : "chevron-right"}
            size={28}
          />
          <View style={treeListStyles.itemContainer}>
            <MaterialIcons
              name="folder"
              size={28}
              color={COLORS.secondaryLight}
              style={{ marginRight: 5 }}
            />
            {folderInputState === FolderInputState.renameFolder ? (
              <TextInput
                style={[sharedStyles.input, { paddingVertical: 0 }]}
                placeholder={`Enter ${type} name`}
                defaultValue={type === "folder" ? item.name : item.content}
                onSubmitEditing={onRenameFolder}
                maxLength={20}
                autoFocus
              />
            ) : (
              <Text style={treeListStyles.text}>
                {type === "folder" ? item.name : item.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        {isFolderOpened && (
          <ContextMenu
            isOpened={isMenuOpened}
            onDismiss={() => setIsMenuOpened(false)}
            anchor={
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={COLORS.primary}
                onPress={() => setIsMenuOpened(true)}
              />
            }
          >
            {additionalMenuItems}
            <Menu.Item
              leadingIcon="delete"
              onPress={onDeleteFolder}
              title={`Delete ${type}`}
            />
            <Menu.Item
              leadingIcon="pencil"
              onPress={startFolderEdition}
              title={`Rename ${type}`}
            />
          </ContextMenu>
        )}
        {isLoading && <ActivityIndicator size={28} color={COLORS.secondary} />}
      </View>
    );
  },
);

CategoryItem.displayName = "CategoryItem";

export default CategoryItem;
