import { createContext } from "react";
import SORTING_OPTIONS from "../../sortingAndFiltering/constants/sortingOptions";

interface NotesContextValue {
  sortBy: string;
}

const NotesContext = createContext<NotesContextValue>({
  sortBy: SORTING_OPTIONS[0].value,
});

export default NotesContext;
