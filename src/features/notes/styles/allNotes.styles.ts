import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainDirectory: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  treeListControlButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  treeListControlButton: {
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: COLORS.primary,
    margin: 0,
  },
});
