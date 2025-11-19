import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  aiResponseCategoryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  saveAiResponseContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  aiResponseCategoryText: {
    fontSize: 18,
    flexShrink: 1,
  },
  aiResponseText: {
    fontSize: 16,
  },
  newIdeaContentInput: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
});
