import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createWordAppSlice, WordAppSlice } from "./slice";

export const useStore = create<WordAppSlice>()(
  persist(
    (...a) => ({
      ...createWordAppSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);
