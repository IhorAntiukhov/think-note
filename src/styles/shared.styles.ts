import StyleSheet from "react-native-media-query";
import { COLORS } from "../constants/theme";

export const { ids: sharedStylesIds, styles: sharedStyles } = StyleSheet.create(
  {
    container: {
      padding: 20,
    },
    mediumText: {
      fontSize: 18,
    },
    largeText: {
      fontSize: 24,
    },
    divider: {
      marginHorizontal: -20,
      marginTop: 10,
      marginBottom: 20,
    },
    imageButton: {
      margin: 0,
      borderRadius: "50%",
      borderWidth: 2,
      borderColor: COLORS.secondary,
    },
    input: {
      outlineWidth: 0,
      fontSize: 18,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
      paddingStart: 0,
      paddingBottom: 5,
    },
  },
);
