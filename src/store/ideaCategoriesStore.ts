import { create } from "zustand";

interface Category {
  id: number;
  content: string;
}

interface IdeaCategories {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const useIdeaCategoriesStore = create<IdeaCategories>((set) => ({
  categories: [],
  setCategories: (categories) => set(() => ({ categories })),
}));

export default useIdeaCategoriesStore;
