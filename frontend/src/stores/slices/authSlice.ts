import { StateCreator } from "zustand";
import { User, UserPreferences, UserStats } from "@/src/types/user";
import { API_URL, authFetch, clearCachedToken } from "@/lib/api";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
  stats: UserStats | null;
  authError: string | null;
  isFetchingUser: boolean;
  // Methods
  setAuthError: (error: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  // Note: Clerk handles the actual sign out process,
  // this method just cleans up our local state
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  isFetchingUser: false,
  authError: null,
  isAuthenticated: false,
  preferences: null,
  stats: null,

  setAuthError: (error: string) => {
    set({ authError: error });
  },

  getMe: async () => {
    set({ isFetchingUser: true });
    try {
      // We no longer need to update the token here since AuthContext handles it
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
    // Clear our cached token to prevent further API calls
    clearCachedToken();

    // Reset the app state
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
});
