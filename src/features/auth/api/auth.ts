import { errorAlert, infoAlert } from "@/src/utils/alerts";
import { AuthError, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import supabase from "../../../api/supabase";
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

export async function updateUser(
  username?: string,
  email?: string,
  password?: string,
  avatar_path?: string,
) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
    data: {
      username,
      avatar_path,
    },
  });

  return { data, error };
}

export async function updateUserWithMessage(
  paramName: FormDataKey,
  username?: string,
  email?: string,
  password?: string,
) {
  try {
    const { error } = await updateUser(username, email, password);

    if (error) throw error;

    const alertMessage = password
      ? "Password updated successfully"
      : `${paramName.charAt(0).toUpperCase()}${paramName.substring(1)} updated to ${username || email || password}`;

    infoAlert("User update succeded", alertMessage);
  } catch (error) {
    errorAlert("User update failed", error as AuthError);
  }
}

export async function deleteUser(user: User) {
  const { data, error } = await supabase.auth.admin.deleteUser(user.id);

  return { data, error };
}
