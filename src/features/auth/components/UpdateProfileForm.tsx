import { COLORS } from "@/src/constants/theme";
import { updateUserWithMessage } from "@/src/features/auth/api/auth";
import useDialogStore from "@/src/store/dialogStore";
import Input from "@/src/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import DefaultPromptInput from "../../ideas/components/DefaultPromptInput";
import profileStyles from "../styles/profile.styles";
import {
  EmailFormData,
  PasswordFormData,
  UsernameFormData,
} from "../types/forms";
import {
  emailFormSchema,
  passwordFormSchema,
  usernameFormSchema,
} from "../zod/separatedUserForms";

export default function UpdateProfileForm() {
  const {
    control: usernameControl,
    formState: { errors: usernameErrors },
    handleSubmit: handleUsernameSubmit,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
  });

  const {
    control: emailControl,
    formState: { errors: emailErrors },
    handleSubmit: handleEmailSubmit,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
  });

  const {
    control: passwordControl,
    formState: { errors: passwordErrors },
    handleSubmit: handlePasswordSubmit,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  const { showInfoDialog } = useDialogStore();

  const updateUsername = handleUsernameSubmit(
    useCallback(
      async (formData) => {
        await updateUserWithMessage({
          paramName: "username",
          showInfoDialog,
          username: formData.username,
        });
      },
      [showInfoDialog],
    ),
  );

  const updateEmail = handleEmailSubmit(
    useCallback(
      async (formData) => {
        await updateUserWithMessage({
          paramName: "email",
          showInfoDialog,
          email: formData.email,
        });
      },
      [showInfoDialog],
    ),
  );

  const updatePassword = handlePasswordSubmit(
    useCallback(
      async (formData) => {
        await updateUserWithMessage({
          paramName: "password",
          showInfoDialog,
          password: formData.password,
        });
      },
      [showInfoDialog],
    ),
  );

  const updateDefaultPrompt = useCallback(
    async (defaultPrompt: string) => {
      await updateUserWithMessage({
        paramName: "defaultPrompt",
        showInfoDialog,
        defaultPrompt,
      });
    },
    [showInfoDialog],
  );

  return (
    <>
      <Text style={profileStyles.formTitle}>Update profile</Text>

      <Input
        name="username"
        control={usernameControl}
        icon="account-circle"
        label="Username"
        error={!!usernameErrors.username}
        errorText={usernameErrors.username?.message}
        type="ascii-capable"
        outerStyle={{ marginBottom: 5 }}
        right={
          <TextInput.Icon
            icon="sync"
            color={COLORS.primary}
            onPress={updateUsername}
          />
        }
      />

      <Input
        name="email"
        control={emailControl}
        error={!!emailErrors.email}
        errorText={emailErrors.email?.message}
        icon="email"
        label="Email"
        type="email-address"
        outerStyle={{ marginBottom: 5 }}
        right={
          <TextInput.Icon
            icon="sync"
            color={COLORS.primary}
            onPress={updateEmail}
          />
        }
      />

      <Input
        name="password"
        control={passwordControl}
        error={!!passwordErrors.password}
        errorText={passwordErrors.password?.message}
        icon="lock"
        label="Password"
        type="password"
        outerStyle={{ marginBottom: 5 }}
      />
      <View style={profileStyles.updatePassword}>
        <Input
          name="confirmPassword"
          control={passwordControl}
          error={!!passwordErrors.confirmPassword}
          errorText={passwordErrors.confirmPassword?.message}
          icon="lock"
          label="Confirm password"
          type="password"
          outerStyle={{ flex: 1, minWidth: 0 }}
        />
        <IconButton
          icon="sync"
          iconColor={COLORS.primary}
          onPress={updatePassword}
        />
      </View>

      <DefaultPromptInput
        mode="update user"
        onPressAction={updateDefaultPrompt}
      />
    </>
  );
}
