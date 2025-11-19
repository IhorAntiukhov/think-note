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
    maxWidth: 444,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexGrow: 1,
  },
  sortingContainer: {
    maxWidth: 444,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
