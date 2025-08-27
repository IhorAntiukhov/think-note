import LoginForm from "@/src/features/auth/screens/LoginForm";
import ScreenScrollWrapper from "@/src/navigation/ScreenScrollWrapper";

export default function AuthForm() {
  return (
    <ScreenScrollWrapper>
      <LoginForm />
    </ScreenScrollWrapper>
  );
}
