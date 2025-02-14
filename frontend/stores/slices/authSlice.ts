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
    // TODO: Implement actual login logic with backend
    const mockUser: User = {
      id: "1",
      email,
      username: email.split("@")[0],
      passwordHash: "", // Not stored in frontend
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        id: "1",
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
        id: "1",
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
