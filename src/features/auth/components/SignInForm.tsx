import { signInWithEmailAndPassword, signInWithProvider } from "@/src/api/auth";
import { COLORS } from "@/src/constants/theme";
import Input from "@/src/ui/Input";
import OutlineButton from "@/src/ui/OutlineButton";
import TextButton from "@/src/ui/TextButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@supabase/supabase-js";
import { Image } from "expo-image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import authStyles from "../styles/auth.styles";
import SelectedForm from "../types/selectedForm";
import schema from "../zod/signIn";
import { SignInFormData } from "../types/forms";

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

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      const { error } = await signInWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      if (error) throw error;
    } catch (error) {
      Alert.alert("Sign in failed", (error as AuthError).message, undefined, {
        cancelable: true,
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Text style={authStyles.title}>
        Welcome to <Text style={authStyles.thinkNoteTitle}>Think Note</Text>!
      </Text>

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

      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        Or, use auth providers:
      </Text>

      <View style={authStyles.providers}>
        <TouchableOpacity
          onPress={async () => await signInWithProvider("google")}
        >
          <Image
            style={{ width: 42, height: 42 }}
            source={require("@/src/assets/images/google.svg")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => await signInWithProvider("github")}
        >
          <Image
            style={{ width: 42, height: 42 }}
            source={require("@/src/assets/images/github.svg")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => await signInWithProvider("linkedin")}
        >
          <Image
            style={{ width: 42, height: 42 }}
            source={require("@/src/assets/images/linkedin.svg")}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
