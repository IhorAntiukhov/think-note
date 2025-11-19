import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  itemContainerWithGap: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ideaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  text: {
    fontSize: 18,
    flexShrink: 1,
  },
  noDataWrapper: {
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  input: {
    fontSize: 18,
    width: "100%",
    paddingStart: 0,
  },
  iconButton: {
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: COLORS.primary,
    margin: 0,
    marginRight: 5,
  },
  mainDirectory: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  controlButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: COLORS.primary,
    margin: 0,
  },
});
