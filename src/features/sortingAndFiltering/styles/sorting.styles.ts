import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sortingAndFilteringContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    columnGap: 20,
    rowGap: 10,
  },
  sortingAndMarkedContainer: {
    flex: 1,
    minWidth: 280,
    maxWidth: 444,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sortingContainer: {
    maxWidth: 444,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
