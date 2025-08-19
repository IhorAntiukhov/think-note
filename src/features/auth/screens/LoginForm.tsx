import { useState } from "react";
import { View } from "react-native";
import { Card } from "react-native-paper";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import authStyles from "../styles/auth.styles";
import SelectedForm from "../types/selectedForm";

export default function LoginForm() {
  const [selectedForm, setSelectedForm] = useState(SelectedForm.SignIn);

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
        </Card.Content>
      </Card>
    </View>
  );
}
