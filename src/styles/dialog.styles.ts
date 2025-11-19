import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  dialogWindow: {
    maxWidth: 600,
    alignSelf: "center",
  },
  textInput: {
    width: "100%",
    minWidth: 260,
    marginBottom: 15,
    borderBottomColor: COLORS.primary,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    color: COLORS.primary,
  },
});
