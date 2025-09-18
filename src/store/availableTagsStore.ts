import { create } from "zustand";
import TagsDropdownOption from "../types/tagsDropdownOption";

interface AvailableTagsStore {
  availableTags: TagsDropdownOption[];
  setAvailableTags: (availableTags: TagsDropdownOption[]) => void;
  addTag: (tag: TagsDropdownOption) => void;
  editTag: (tagId: string, label: string) => void;
  removeTag: (tagId: string) => void;
}

const useAvailableTagsStore = create<AvailableTagsStore>((set) => ({
  availableTags: [],
  setAvailableTags: (availableTags) => set(() => ({ availableTags })),
  addTag: (tag) =>
    set((state) => ({
      availableTags: [...state.availableTags, tag],
    })),
  editTag: (tagId, label) =>
    set(({ availableTags }) => {
      const index = availableTags.findIndex((tag) => tag.value === tagId);
      const oldItem = availableTags[index];
      oldItem.label = label;

      return {
        availableTags: availableTags.toSpliced(index, 1, oldItem),
      };
    }),
  removeTag: (tagId) =>
    set(({ availableTags }) => ({
      availableTags: availableTags.toSpliced(
        availableTags.findIndex((tag) => tag.value === tagId),
        1,
      ),
    })),
}));

export default useAvailableTagsStore;
