import { StateCreator } from "zustand";
import { User, UserPreferences, UserStats } from "../types";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
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

      // Store token in localStorage for persistence
      localStorage.setItem("token", data.access_token);

      // Fetch user details after successful login
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
        preferences: user.preferences || null,
        stats: user.stats || null,
      });
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  },

  register: async (email: string, password: string, username: string) => {
    // TODO: Implement actual registration logic with backend
    const mockUser: User = {
      id: Math.random().toString(),
      email,
      username,
      passwordHash: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        id: Math.random().toString(),
        userId: "1",
        dailyWordGoal: 5,
        difficultyLevel: "beginner",
        notificationEnabled: true,
        notificationType: "daily",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      stats: {
        id: Math.random().toString(),
        userId: "1",
        totalWordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPracticeTime: 0,
        averageAccuracy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    set({
      user: mockUser,
      isAuthenticated: true,
      preferences: mockUser.preferences,
      stats: mockUser.stats,
    });
  },

  logout: () => {
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
