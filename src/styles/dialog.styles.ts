import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  textInput: {
    width: "100%",
    fontSize: 18,
    marginBottom: 15,
    paddingStart: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    color: COLORS.primary,
  },
});
