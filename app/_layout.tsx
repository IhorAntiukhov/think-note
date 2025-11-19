import { COLORS } from "@/src/constants/theme";
import AuthLayout from "@/src/navigation/AuthLayout";
import * as SplashScreen from "expo-splash-screen";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import ModalDialog from "../src/ui/ModalDialog";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
  },
};

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthLayout />
      <ModalDialog />
    </PaperProvider>
  );
}
