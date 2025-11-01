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
    gap: 10,
    marginBottom: 5,
  },
  saveAiResponseContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  aiResponseCategoryText: {
    fontSize: 18,
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
