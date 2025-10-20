import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    boxShadow: `0 2px 7px 2px ${COLORS.accentGradient}`,
    objectFit: "cover",
  },
  avatarImageMinimized: {
    width: 48,
    height: 48,
    borderRadius: 24,
    objectFit: "cover",
  },
});
