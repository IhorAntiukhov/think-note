import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  listsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  listHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginBottom: 10,
  },
  listNameHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  listName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteCount: {
    fontSize: 14,
    color: "gray",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  noteStat: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  noteFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  newNoteContainer: {
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderColor: COLORS.primary,
    borderWidth: 3,
    borderRadius: 16,
  },
  newNoteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
