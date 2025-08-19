import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  thinkNoteTitle: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  resetPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  helperSubtitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  providers: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
