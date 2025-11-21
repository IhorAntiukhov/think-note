import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  container: {
    maxWidth: 400,
    backgroundColor: COLORS.background,
    cursor: "pointer",
  },
  multiselectContainer: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    cursor: "pointer",
  },
  dropdown: {
    height: 45,
    borderColor: "black",
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
  placeholder: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 17,
    paddingVertical: 14,
  },
  tagLabel: {
    fontSize: 16,
    flexGrow: 1,
  },
  tagColor: {
    width: 22,
    height: 22,
    borderRadius: "50%",
  },
  changeTagButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  selectedItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
});
