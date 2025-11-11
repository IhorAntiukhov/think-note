import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import useIdeaCategoriesStore from "@/src/store/ideaCategoriesStore";
import DropdownMenu from "@/src/ui/DropdownMenu";
import Input from "@/src/ui/Input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostgrestError } from "@supabase/supabase-js";
import { use, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import NoteInfoContext from "../../notes/context/noteInfoContext";
import { generateIdea } from "../api/geminiClient";
import { deleteIdeaOrCategory, saveIdea } from "../api/ideasRepo";
import noteSummaryStyles from "../styles/noteSummary.styles";
import {
  NewContentFormData,
  newContentFormSchema,
} from "../zod/newContentForm";
import DefaultPromptInput from "./DefaultPromptInput";

export default function NoteSummary() {
  const {
    noteId,
    aiResponseId,
    setAiResponseId,
    aiResponseContent,
    setAiResponseContent,
    aiResponseCategory,
    setAiResponseCategory,
    getNoteContent,
  } = use(NoteInfoContext);

  const { categories } = useIdeaCategoriesStore();
  const { showInfoDialog, showConfirmDialog } = useDialogStore();
  const { user } = useAuthStore().session!;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditAiResponse, setIsEditAiResponse] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<NewContentFormData>({
    resolver: zodResolver(newContentFormSchema),
  });

  const sendPrompt = useCallback(
    async (prompt: string) => {
      setIsLoading(true);

      try {
        const noteContent = await getNoteContent;
        const response = await generateIdea(
          prompt,
          categories.map((category) => category.content),
          noteContent || "",
        );

        if (response) {
          const { summaryOrIdeaContent, category } = JSON.parse(response);

          const folderId = categories.find(
            (availableCategory) => availableCategory.content === category,
          )?.id;

          const { data, error } = await saveIdea(
            summaryOrIdeaContent,
            noteId!,
            user.id,
            folderId,
          );

          if (error) throw error;

          if (data) setAiResponseId?.(data);
          setAiResponseContent?.(summaryOrIdeaContent);
          setAiResponseCategory?.(category);
        }
      } catch (error) {
        showInfoDialog(
          "Idea generation failed",
          (error as PostgrestError)?.message,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      getNoteContent,
      categories,
      showInfoDialog,
      noteId,
      user.id,
      setAiResponseContent,
      setAiResponseCategory,
      setAiResponseId,
    ],
  );

  const onDeleteIdea = useCallback(async () => {
    showConfirmDialog(
      "Idea deletion",
      "Are you sure you want to delete this idea?",
      async () => {
        try {
          const error = await deleteIdeaOrCategory(aiResponseId);

          if (error) throw error;

          setAiResponseContent?.("");
          setAiResponseCategory?.("");
        } catch (error) {
          showInfoDialog(
            "Idea deletion failed",
            (error as PostgrestError).message,
          );
        }
      },
    );
  }, [
    aiResponseId,
    setAiResponseContent,
    setAiResponseCategory,
    showConfirmDialog,
    showInfoDialog,
  ]);

  const updateAiResponse = handleSubmit(
    useCallback(
      async ({ newContent }) => {
        if (
          newContent === aiResponseContent &&
          (!newCategory ||
            aiResponseCategory ===
              categories.find(
                (availableCategory) => availableCategory.id === +newCategory,
              )?.content)
        ) {
          setIsEditAiResponse(false);
          return;
        }

        try {
          const folderId = newCategory
            ? +newCategory
            : categories.find(
                (availableCategory) =>
                  availableCategory.content === aiResponseCategory,
              )?.id;

          const error = await saveIdea(newContent, noteId!, user.id, folderId);

          if (error) throw error;

          setAiResponseContent?.(newContent);
          newCategory &&
            setAiResponseCategory?.(
              categories.find((category) => category.id === +newCategory)
                ?.content || aiResponseCategory,
            );
          setIsEditAiResponse(false);
        } catch (error) {
          showInfoDialog(
            "Idea update failed",
            (error as PostgrestError)?.message,
          );
        }
      },
      [
        showInfoDialog,
        aiResponseContent,
        aiResponseCategory,
        newCategory,
        noteId,
        user.id,
        categories,
        setAiResponseCategory,
        setAiResponseContent,
      ],
    ),
  );

  const onToggleEditIdeaMode = useCallback(() => {
    if (isEditAiResponse) {
      updateAiResponse();
    } else {
      setValue("newContent", aiResponseContent);
      setIsEditAiResponse(true);
    }
  }, [isEditAiResponse, updateAiResponse, setValue, aiResponseContent]);

  return (
    <View style={noteSummaryStyles.container}>
      <DefaultPromptInput mode="generate idea" onPressAction={sendPrompt} />

      {isLoading && <ActivityIndicator size={32} />}

      {!isLoading && !aiResponseContent && (
        <Text style={noteSummaryStyles.noDataText}>
          The AI ​​response hasn&apos;t yet been generated.
        </Text>
      )}

      {!isLoading && aiResponseContent && (
        <>
          <View style={noteSummaryStyles.aiResponseCategoryContainer}>
            {isEditAiResponse ? (
              <View style={{ flex: 1 }}>
                <DropdownMenu
                  label="New category"
                  value={newCategory}
                  options={categories.map((category) => ({
                    value: category.id.toString(),
                    label: category.content,
                  }))}
                  onChange={(value) => setNewCategory(value)}
                />
              </View>
            ) : (
              <>
                <MaterialIcons name="folder" size={28} />
                <Text style={noteSummaryStyles.aiResponseCategoryText}>
                  {aiResponseCategory}
                </Text>
              </>
            )}

            <View
              style={[
                noteSummaryStyles.saveAiResponseContainer,
                { flex: isEditAiResponse ? undefined : 1 },
              ]}
            >
              {!isEditAiResponse && (
                <MaterialIcons name="delete" size={28} onPress={onDeleteIdea} />
              )}
              <MaterialIcons
                name={isEditAiResponse ? "check" : "edit"}
                size={28}
                onPress={onToggleEditIdeaMode}
              />
            </View>
          </View>

          {isEditAiResponse ? (
            <Input
              name="newContent"
              control={control}
              error={!!errors.newContent}
              errorText={errors.newContent?.message}
              icon="pencil"
              label="New AI response"
              type="ascii-capable"
              multiline
            />
          ) : (
            <Text style={noteSummaryStyles.aiResponseText}>
              {aiResponseContent}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
