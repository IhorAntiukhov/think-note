import { createContext } from "react";
import SORTING_OPTIONS from "../../sortingAndFiltering/constants/sortingOptions";

const NotesContext = createContext<string>(SORTING_OPTIONS[0].value);

export default NotesContext;
