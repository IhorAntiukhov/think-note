import { COLORS } from "@/src/constants/theme";
import AuthLayout from "@/src/navigation/AuthLayout";
import DialogModal from "@/src/ui/Dialog";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthLayout />
      <DialogModal />
    </PaperProvider>
  );
}
