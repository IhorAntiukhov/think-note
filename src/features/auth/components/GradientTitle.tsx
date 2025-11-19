import { COLORS } from "@/src/constants/theme";
import { Text, View } from "react-native";
import { GradientText } from "universal-gradient-text";
import authStyles from "../styles/auth.styles";

export default function GradientTitle() {
  return (
    <View style={authStyles.titleWrapper}>
      <Text style={authStyles.titleParts}>Welcome to </Text>
      <GradientText
        colors={[COLORS.accent, COLORS.accentGradient]}
        direction="rtl"
        style={authStyles.thinkNoteTitle}
      >
        ThinkNote
      </GradientText>
      <Text style={authStyles.titleParts}>!</Text>
    </View>
  );
}
