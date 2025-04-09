import { BaseEntity } from "./base";
import { DifficultyLevel, NotificationType, SessionType, Theme } from "./enums";
import { Word } from "./words";

export type User = BaseEntity & {
  email: string;
  username: string;
  password: string;
  preferences: UserPreferences;
  stats: UserStats;
};

export type UserPreferences = BaseEntity & {
  userId: string;
  dailyWordGoal: number;
  difficultyLevel: DifficultyLevel;
  notificationEnabled: boolean;
  notificationType: NotificationType;
  theme: Theme;
  profileBackgroundColorIndex: number;
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
