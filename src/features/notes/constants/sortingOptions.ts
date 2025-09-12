import DropdownOption from "@/src/types/dropdownOption";

const SORTING_OPTIONS: DropdownOption[] = [
  { label: "Created at", value: "created_at" },
  { label: "Updated at", value: "updated_at" },
  { label: "Alphabet", value: "name" },
  { label: "Words quantity", value: "num_words" },
  { label: "Visits", value: "num_visits" },
];

export default SORTING_OPTIONS;
