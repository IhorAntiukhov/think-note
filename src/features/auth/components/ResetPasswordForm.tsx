import { resetPassword } from "@/src/api/auth";
import { COLORS } from "@/src/constants/theme";
import Input from "@/src/ui/Input";
import OutlineButton from "@/src/ui/OutlineButton";
import TextButton from "@/src/ui/TextButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import authStyles from "../styles/auth.styles";
import { EmailFormData } from "../types/forms";
import SelectedForm from "../types/selectedForm";
import { emailFormSchema } from "../zod/separatedUserForms";

interface ResetPasswordFormProps {
  switchForm: React.Dispatch<React.SetStateAction<SelectedForm>>;
}

export default function ResetPasswordForm({
  switchForm,
}: ResetPasswordFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      const { error } = await resetPassword(formData.email);

      if (error) throw error;

      Alert.alert("Password reset", "Check your email", undefined, {
        cancelable: true,
      });
    } catch (error) {
      Alert.alert(
        "Password reset failed",
        (error as AuthError).message,
        undefined,
        {
          cancelable: true,
        },
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Text style={authStyles.title}>Reset password</Text>

      <Input
        name="email"
        control={control}
        icon="email"
        label="Email"
        error={!!errors.email}
        errorText={errors.email?.message}
        type="email-address"
        outerStyle={{ marginBottom: 19 }}
      />

      <OutlineButton
        style={{ marginBottom: 10 }}
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        Send reset password email
      </OutlineButton>

      <View style={authStyles.helperSubtitle}>
        <Text>Remembered your password?</Text>
        <TextButton
          textColor={COLORS.primary}
          onPress={() => switchForm(SelectedForm.SignIn)}
        >
          Sign in
        </TextButton>
      </View>
    </>
  );
}
