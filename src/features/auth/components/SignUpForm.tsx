import { signUp } from "@/src/api/auth";
import { COLORS } from "@/src/constants/theme";
import Input from "@/src/ui/Input";
import OutlineButton from "@/src/ui/OutlineButton";
import TextButton from "@/src/ui/TextButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import authStyles from "../styles/auth.styles";
import SelectedForm from "../types/selectedForm";
import schema, { SignUpFormData } from "../zod/signUp";

interface SignUpFormProps {
  switchForm: React.Dispatch<React.SetStateAction<SelectedForm>>;
}

export default function SignUpForm({ switchForm }: SignUpFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.username,
      );

      if (error) throw error;

      Alert.alert(
        "Sign up succeded",
        "Check your email to confirm sign up",
        undefined,
        {
          cancelable: true,
        },
      );
    } catch (error) {
      Alert.alert("Sign up failed", (error as AuthError).message, undefined, {
        cancelable: true,
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Text style={authStyles.title}>Create an account</Text>

      <Input
        name="username"
        control={control}
        icon="account-circle"
        label="Username"
        error={!!errors.username}
        errorText={errors.username?.message}
        type="ascii-capable"
        outerStyle={{ marginBottom: 5 }}
      />
      <Input
        name="email"
        control={control}
        icon="email"
        label="Email"
        error={!!errors.email}
        errorText={errors.email?.message}
        type="email-address"
        outerStyle={{ marginBottom: 10 }}
      />

      <Input
        name="password"
        control={control}
        error={!!errors.password}
        errorText={errors.password?.message}
        icon="lock"
        label="Password"
        type="password"
        outerStyle={{ marginBottom: 5 }}
      />
      <Input
        name="confirmPassword"
        control={control}
        error={!!errors.confirmPassword}
        errorText={errors.confirmPassword?.message}
        icon="lock"
        label="Confirm password"
        type="password"
        outerStyle={{ marginBottom: 19 }}
      />

      <OutlineButton
        style={{ marginBottom: 10 }}
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        Sign up
      </OutlineButton>

      <View style={authStyles.helperSubtitle}>
        <Text>Already have an account?</Text>
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
