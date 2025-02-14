import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAuthSlice, AuthSlice } from "./slices/authSlice";
import { createGameSlice, GameSlice } from "./slices/gameSlice";

interface StoreState extends AuthSlice, GameSlice {}

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createGameSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        stats: state.stats,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
        currentSession: state.currentSession,
      }),
    }
  )
);
