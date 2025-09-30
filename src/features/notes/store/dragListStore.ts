import { create } from "zustand";

interface AuthStore {
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  currentIndex: 0,
  setCurrentIndex: (currentIndex) =>
    set(() => ({
      currentIndex,
    })),
}));

export default useAuthStore;
