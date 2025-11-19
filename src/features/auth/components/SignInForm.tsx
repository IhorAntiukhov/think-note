import { COLORS } from "@/src/constants/theme";
import { signInWithEmailAndPassword } from "@/src/features/auth/api/auth";
import Input from "@/src/ui/Input";
import OutlineButton from "@/src/ui/OutlineButton";
import TextButton from "@/src/ui/TextButton";
import { zodResolver } from "@hookform/resolvers/zod";
import useDialogStore from "@/src/store/dialogStore";
import { AuthError } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import authStyles from "../styles/auth.styles";
import { SignInFormData } from "../types/forms";
import SelectedForm from "../types/selectedForm";
import schema from "../zod/signIn";
import GradientTitle from "./GradientTitle";

interface SignInFormProps {
  switchForm: React.Dispatch<React.SetStateAction<SelectedForm>>;
}

export default function SignInForm({ switchForm }: SignInFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showInfoDialog } = useDialogStore();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      const { error } = await signInWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      if (error) throw error;
    } catch (error) {
      showInfoDialog("Sign in failed", (error as AuthError).message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <GradientTitle />

      <Input
        name="email"
        control={control}
        error={!!errors.email}
        errorText={errors.email?.message}
        icon="email"
        label="Email"
        type="email-address"
        outerStyle={{ marginBottom: 5 }}
      />
      <Input
        name="password"
        control={control}
        error={!!errors.password}
        errorText={errors.password?.message}
        icon="lock"
        label="Password"
        type="password"
      />
      <TextButton
        textColor={COLORS.secondary}
        style={authStyles.resetPassword}
        onPress={() => switchForm(SelectedForm.ResetPassword)}
      >
        Reset password
      </TextButton>

      <OutlineButton
        onPress={onSubmit}
        style={{ marginBottom: 10 }}
        loading={isLoading}
        disabled={isLoading}
      >
        Sign in
      </OutlineButton>

      <View style={authStyles.helperSubtitle}>
        <Text>Don&apos;t have an account yet?</Text>
        <TextButton
          textColor={COLORS.primary}
          onPress={() => switchForm(SelectedForm.SignUp)}
        >
          Sign up
        </TextButton>
      </View>
    </>
  );
}
