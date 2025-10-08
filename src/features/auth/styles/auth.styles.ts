import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 20,
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  titleParts: {
    fontSize: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  thinkNoteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  thinkNoteTitleTransparent: {
    fontSize: 24,
    fontWeight: "bold",
    opacity: 0,
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
