import LIST_NAMES from "../constants/listNames";

type ListNameKeys = keyof typeof LIST_NAMES;
type ListName = (typeof LIST_NAMES)[ListNameKeys];

export default ListName;
