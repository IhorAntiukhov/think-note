import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingStart: 14,
    paddingEnd: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: COLORS.background,
    left: 8,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
