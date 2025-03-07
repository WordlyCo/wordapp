import { StateCreator } from "zustand";
import { User, UserPreferences, UserStats } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
  token: string | null;
  stats: UserStats | null;

  // Methods
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
  isAuthenticated: false,
  preferences: null,
  stats: null,
  token: null,

  //LOGIN USER
  login: async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/users/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      // Store token in AsyncStorage
      await AsyncStorage.setItem("token", data.access_token);

      // Fetch user details after login
      const userResponse = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const user = await userResponse.json();

      set({
        user,
        isAuthenticated: true,
        token: data.access_token, // Save token in Zustand state
        preferences: user.preferences || null,
        stats: user.stats || null,
      });
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  },

  //REGISTER USER
  register: async (email: string, password: string, username: string) => {
    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      // Auto-login after successful registration
      await get().login(email, password);

      // check the token is stored properly
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found after registration");
    } catch (error: any) {
      console.error("Registration failed:", error.message);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token"); // Remove token from storage

    set({
      user: null,
      isAuthenticated: false,
      token: null,
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

  //FETCH USER
  fetchUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        console.error("Session expired. Logging out...");
        await get().logout();
        return;
      }

      if (!response.ok) throw new Error("User fetch failed");

      const user = await response.json();

      set({
        user,
        isAuthenticated: true,
        token,
        preferences: user.preferences || null,
        stats: user.stats || null,
      });
    } catch (error) {
      console.error("Fetching user failed:", error);
      await get().logout();
    }
  },

  //UPDATE USER STATS
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
