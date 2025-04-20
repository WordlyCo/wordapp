import { BaseEntity } from "./base";
import { DifficultyLevel, NotificationType, SessionType } from "./enums";
import { Word } from "./words";
import { StatusBarStyle } from "expo-status-bar";

export type User = BaseEntity & {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  clerkId?: string;
  profilePictureUrl?: string;
  preferences?: UserPreferences;
  userStats?: FullUserStats;
};

export type UserPreferences = BaseEntity & {
  userId: string;
  dailyWordGoal: number;
  difficultyLevel: DifficultyLevel;
  notificationEnabled: boolean;
  notificationType: NotificationType;
  theme: StatusBarStyle;
  profileBackgroundColorIndex: number;
  timeZone: string;
};

export type DailyProgress = BaseEntity & {
  wordsPracticed: number;
  totalWordsGoal: number;
  practiceTime: number;
  practiceTimeGoal: number;
};

export type LearningInsights = BaseEntity & {
  wordsMastered: number;
  accuracy: number;
};

export type FullUserStats = BaseEntity & {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number;
  averageAccuracy: number;
  dailyProgress: DailyProgress;
  learningInsights: LearningInsights;
  diamonds: number;
  streak: number;
  lastActive: Date;
};

export type UserStats = BaseEntity & {
  userId: string;
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number;
  averageAccuracy: number;
};

export type Achievement = BaseEntity & {
  name: string;
  description: string;
  criteria: string;
  points: number;
  iconUrl?: string;
  iconName?: string;
};

export type UserAchievement = BaseEntity & {
  userId: string;
  achievementId: string;
  achievedAt: Date;
};

export type PracticeSession = BaseEntity & {
  userId: string;
  sessionType: SessionType;
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  sessionWords: SessionWord[];
};

export type SessionWord = BaseEntity &
  Word & {
    wasCorrect: boolean;
    timeTaken: number;
  };

export type WordList = BaseEntity & {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  difficultyLevel: DifficultyLevel;
  words: Word[];
};
