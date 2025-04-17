import { StateCreator } from "zustand";
import { User, UserPreferences, UserStats } from "@/src/types/user";
import { authFetch, clearCachedToken } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HAS_ONBOARDED_KEY = "hasOnboarded";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  preferences: UserPreferences | null;
  stats: UserStats | null;
  authError: string | null;
  isFetchingUser: boolean;
  setAuthError: (error: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  loadOnboardingStatus: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => {
  const initializeStore = async () => {
    try {
      const storedHasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
      if (storedHasOnboarded !== null) {
        set({ hasOnboarded: JSON.parse(storedHasOnboarded) });
      }
    } catch (error) {
      console.error("Failed to load onboarding status:", error);
    }
  };
  
  initializeStore();
  
  return {
    user: null,
    isFetchingUser: false,
    authError: null,
    isAuthenticated: false,
    hasOnboarded: false,
    preferences: null,
    stats: null,

  setAuthError: (error: string) => {
    set({ authError: error });
  },

  getMe: async () => {
    set({ isFetchingUser: true });
    try {
      const response = await authFetch(`/users/me`);
      const data = await response.json();

      if (!data.success) {
        set({ authError: data.message || "Failed to get user" });
        return;
      }

      const payload = data.payload;
      if (!payload) {
        set({ authError: "No payload returned from server" });
        return;
      }

      set({
        user: payload,
        isAuthenticated: true,
        preferences: payload.preferences || null,
        stats: payload.stats || null,
      });
    } catch (error) {
      set({
        authError: "Failed to get user",
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isFetchingUser: false });
    }
  },

  logout: async () => {
    clearCachedToken();

    set({
      user: null,
      isAuthenticated: false,
      preferences: null,
      stats: null,
    });
  },

  updatePreferences: (newPreferences: Partial<UserPreferences>) => {
    const currentPreferences = get().preferences;
    if (currentPreferences) {
      set({
        preferences: {
          ...currentPreferences,
          ...newPreferences,
          updatedAt: new Date(),
        },
      });
    }
  },

  updateStats: (newStats: Partial<UserStats>) => {
    const currentStats = get().stats;
    if (currentStats) {
      set({
        stats: {
          ...currentStats,
          ...newStats,
          updatedAt: new Date(),
        },
      });
      }
    },

    setHasOnboarded: async (hasOnboarded: boolean) => {
      await AsyncStorage.setItem(HAS_ONBOARDED_KEY, JSON.stringify(hasOnboarded));
      set({ hasOnboarded });
    },
    
    loadOnboardingStatus: async () => {
      try {
        const storedHasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
        if (storedHasOnboarded !== null) {
          set({ hasOnboarded: JSON.parse(storedHasOnboarded) });
        }
      } catch (error) {
        console.error("Failed to load onboarding status:", error);
      }
    },
  };
};
