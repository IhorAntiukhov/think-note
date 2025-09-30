import { COLORS } from "@/src/constants/theme";
import AuthLayout from "@/src/navigation/AuthLayout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
      <GestureHandlerRootView>
        <AuthLayout />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
