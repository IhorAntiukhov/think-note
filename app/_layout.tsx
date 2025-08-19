import { COLORS } from "@/src/constants/theme";
import InitialLayout from "@/src/navigation/InitialLayout";
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
      <InitialLayout />
    </PaperProvider>
  );
}
