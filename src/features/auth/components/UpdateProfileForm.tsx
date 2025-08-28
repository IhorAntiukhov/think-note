import { COLORS } from "@/src/constants/theme";
import { updateUserWithMessage } from "@/src/features/auth/api/auth";
import Input from "@/src/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import profileStyles from "../styles/profile.styles";
import {
  EmailFormData,
  IdeaWordsNumFormData,
  PasswordFormData,
  UsernameFormData,
} from "../types/forms";
import {
  emailFormSchema,
  ideaWordsNumFormSchema,
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

  const {
    control: ideaWordsNumControl,
    formState: { errors: ideaWordsNumErrors },
    handleSubmit: handleIdeaWordsNumSubmit,
  } = useForm<IdeaWordsNumFormData>({
    resolver: zodResolver(ideaWordsNumFormSchema),
  });

  const updateUsername = handleUsernameSubmit(async (formData) => {
    await updateUserWithMessage("username", formData.username);
  });

  const updateEmail = handleEmailSubmit(async (formData) => {
    await updateUserWithMessage("email", undefined, formData.email);
  });

  const updatePassword = handlePasswordSubmit(async (formData) => {
    await updateUserWithMessage(
      "password",
      undefined,
      undefined,
      formData.password,
    );
  });

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
          outerStyle={{ flexGrow: 1 }}
        />
        <IconButton
          icon="sync"
          iconColor={COLORS.primary}
          onPress={updatePassword}
        />
      </View>

      <Input
        name="ideaWordsNum"
        control={ideaWordsNumControl}
        error={!!ideaWordsNumErrors.ideaWordsNum}
        errorText={ideaWordsNumErrors.ideaWordsNum?.message}
        icon="lightbulb"
        label="Number of words in ideas"
        type="number-pad"
        outerStyle={{ marginBottom: 20 }}
      />
    </>
  );
}
