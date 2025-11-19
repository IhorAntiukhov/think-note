import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  textEditorContainer: {
    borderWidth: 4,
    borderColor: "black",
    flexShrink: 1,
  },
  toolbar: {
    display: "flex",
    marginHorizontal: -20,
    paddingBottom: 10,
    alignItems: "center",
  },
  noteTitleInput: {
    fontSize: 24,
    fontWeight: "bold",
    paddingStart: 0,
    borderBottomWidth: 0,
  },
  noteContentInput: {
    fontSize: 18,
    height: "100%",
    textAlignVertical: "top",
  },
  noteStatsHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  noteStatsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  noteStat: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
