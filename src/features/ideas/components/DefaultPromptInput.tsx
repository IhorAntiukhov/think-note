import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import Input from "@/src/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { DefaultPromptFormData } from "../../auth/types/forms";
import defaultPromptFormSchema from "../zod/defaultPromptForm";

interface DefaultPromptInputProps {
  mode: "update user" | "generate idea";
  onPressAction: (prompt: string) => void;
}

export default function DefaultPromptInput({
  mode,
  onPressAction,
}: DefaultPromptInputProps) {
  const { user } = useAuthStore().session!;

  const {
    control: defaultPromptControl,
    formState: { errors: defaultPromptErrors },
    handleSubmit: handleDefaultPromptSubmit,
  } = useForm<DefaultPromptFormData>({
    resolver: zodResolver(defaultPromptFormSchema),
    defaultValues: {
      defaultPrompt: user.user_metadata.default_prompt,
    },
  });

  const updateDefaultPrompt = handleDefaultPromptSubmit(async (formData) => {
    onPressAction(formData.defaultPrompt);
  });

  return (
    <Input
      name="defaultPrompt"
      control={defaultPromptControl}
      error={!!defaultPromptErrors.defaultPrompt}
      errorText={defaultPromptErrors.defaultPrompt?.message}
      icon="lightbulb"
      label={mode === "update user" ? "Default prompt for AI" : "Prompt for AI"}
      type="ascii-capable"
      outerStyle={{ marginBottom: 20 }}
      multiline
      right={
        <TextInput.Icon
          icon={mode === "update user" ? "sync" : "send"}
          color={COLORS.primary}
          onPress={updateDefaultPrompt}
          forceTextInputFocus={false}
        />
      }
    />
  );
}
