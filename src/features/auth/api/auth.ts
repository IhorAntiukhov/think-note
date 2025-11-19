import { AuthError, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import supabase from "../../../api/supabase";
import DEFAULT_PROMPT from "../constants/defaultPrompt";
import { FormDataKey } from "../types/forms";

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        default_prompt: DEFAULT_PROMPT,
      },
      emailRedirectTo: Linking.createURL("/(auth)/login"),
    },
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  return error;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: Linking.createURL("/(auth)/login"),
  });

  return { data, error };
}

interface UpdateUserParams {
  username?: string;
  email?: string;
  password?: string;
  avatarPath?: string;
  defaultPrompt?: string;
}

export async function updateUser({
  username,
  email,
  password,
  avatarPath,
  defaultPrompt,
}: UpdateUserParams) {
  const { data, error } = await supabase.auth.updateUser(
    {
      email,
      password,
      data: {
        username,
        avatar_path: avatarPath,
        default_prompt: defaultPrompt,
      },
    },
    {
      emailRedirectTo: Linking.createURL("/(tabs)/profile"),
    },
  );

  return { data, error };
}

interface UpdateUserWithMessageParams extends UpdateUserParams {
  paramName: FormDataKey;
  showInfoDialog: (title: string, content: string) => void;
}

export async function updateUserWithMessage({
  paramName,
  showInfoDialog,
  username,
  email,
  password,
  avatarPath,
  defaultPrompt,
}: UpdateUserWithMessageParams) {
  try {
    const { error } = await updateUser({
      username,
      email,
      password,
      avatarPath,
      defaultPrompt,
    });

    if (error) throw error;

    const alertMessage = password
      ? "Password updated successfully"
      : `${defaultPrompt ? "Default prompt" : paramName.charAt(0).toUpperCase() + paramName.substring(1)} updated to "${username || email || password || defaultPrompt}"`;

    showInfoDialog("User update succeded", alertMessage);
  } catch (error) {
    showInfoDialog("User update failed", (error as AuthError)?.message);
  }
}

export async function deleteUser(user: User) {
  const { error } = await supabase.auth.admin.deleteUser(user.id);

  return error;
}
