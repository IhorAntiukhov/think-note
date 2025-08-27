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
  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    position: "relative",
  },
  editAvatarIcon: {
    position: "absolute",
    width: 28,
    bottom: 0,
    right: 0,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    boxShadow: `0 2px 7px 2px ${COLORS.primary}`,
    objectFit: "cover",
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardBody: {
    paddingVertical: 20,
  },
  divider: {
    marginHorizontal: -16,
    marginBottom: 10,
  },
  updatePassword: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  stat: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  userControlButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
