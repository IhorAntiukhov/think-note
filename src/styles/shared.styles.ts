import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  container: {
    padding: 20,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
  },
  divider: {
    marginHorizontal: -20,
    marginTop: 10,
    marginBottom: 20,
  },
  imageButton: {
    margin: 0,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
});
