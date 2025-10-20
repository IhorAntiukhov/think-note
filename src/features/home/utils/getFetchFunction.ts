import {
  getMarkedNotes,
  getMostVisitedNotes,
  getRecentNotes,
  getUncategorizedNotes,
} from "../api/noteListsStore";
import ListName from "../types/listName";

export default function getFetchFunction(
  listName: ListName,
  userId: string,
  sortBy: string,
  isAscending: boolean,
) {
  switch (listName) {
    case "Uncategorized notes":
      return getUncategorizedNotes(userId, sortBy, isAscending);
    case "Marked notes":
      return getMarkedNotes(userId, sortBy, isAscending);
    case "Recent notes":
      return getRecentNotes(userId, sortBy, isAscending);
    case "Most visited notes":
      return getMostVisitedNotes(userId, sortBy, isAscending);
    default:
      return getUncategorizedNotes(userId, sortBy, isAscending);
  }
}
