import { StateCreator } from "zustand";
import { User, UserPreferences, UserStats } from "@/types/user";
import {
  API_URL,
  setToken,
  setRefreshToken,
  removeRefreshToken,
  removeToken,
} from "@/lib/api";
export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
  stats: UserStats | null;
  authError: string | null;
  // Methods
  setAuthError: (error: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  authError: null,
  isAuthenticated: false,
  preferences: null,
  stats: null,

  setAuthError: (error: string) => {
    set({ authError: error });
  },

  login: async (email: string, password: string) => {
    set({ authError: null });
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        const errorCode = data.errorCode;
        const message = data.message;
        const payload = data.payload;

        console.log("Login successful:", payload);

        if (errorCode === "INVALID_CREDENTIALS") {
          set({ authError: "Your email or password is incorrect" });
          return;
        }

        if (!payload) {
          set({ authError: "No payload returned from server" });
          return;
        }

        await setToken(payload.token);
        await setRefreshToken(payload.refreshToken);
        set({ user: payload.user, isAuthenticated: true });
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  register: async (email: string, password: string, username: string) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const payload = data.payload;

      if (response.ok) {
        console.log("Registration successful:", payload);
        const { token, refreshToken, user } = payload;
        await setToken(token);
        await setRefreshToken(refreshToken);
        set({ user, isAuthenticated: true });
      } else {
        throw new Error(payload.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  },

  logout: () => {
    removeToken();
    removeRefreshToken();
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
