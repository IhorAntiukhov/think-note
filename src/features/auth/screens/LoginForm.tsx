import supabase from "@/src/api/supabase";
import * as Linking from "expo-linking";
import { useState } from "react";
import { View } from "react-native";
import { Card } from "react-native-paper";
import ResetPasswordForm from "../components/ResetPasswordForm";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import authStyles from "../styles/auth.styles";
import SelectedForm from "../types/selectedForm";

export default function LoginForm() {
  const [selectedForm, setSelectedForm] = useState(SelectedForm.SignIn);

  Linking.addEventListener("url", async (event) => {
    const parsedUrl = Linking.parse(event.url.replaceAll("#", "?"));
    console.log(event.url.replaceAll("#", "?"));
    console.log(parsedUrl);

    if (parsedUrl.queryParams) {
      const { access_token, refresh_token } = parsedUrl.queryParams;

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        });
      }
    }
  });

  return (
    <View style={authStyles.container}>
      <Card>
        <Card.Content>
          {selectedForm === SelectedForm.SignIn && (
            <SignInForm switchForm={setSelectedForm} />
          )}
          {selectedForm === SelectedForm.SignUp && (
            <SignUpForm switchForm={setSelectedForm} />
          )}
          {selectedForm === SelectedForm.ResetPassword && (
            <ResetPasswordForm switchForm={setSelectedForm} />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
