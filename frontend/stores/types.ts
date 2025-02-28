import {
  DifficultyLevel,
  NotificationType,
  SessionType,
  Theme,
  DIFFICULTY_LEVELS,
  PARTS_OF_SPEECH,
} from "./enums";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

// Base type for common fields
export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = BaseEntity & {
  email: string;
  username: string;
  passwordHash: string; // stored in DB only
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
};

export type UserStats = BaseEntity & {
  userId: string;
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number;
  averageAccuracy: number;
};

// Word Types

export type WordCategory = BaseEntity & {
  icon?: IconSource;
  name: string;
  description: string;
  category: string;
  difficultyLevel: DifficultyLevel;
  words: Word[];
};

export type Word = BaseEntity & {
  word: string;
  definition: string;
  difficultyLevel: DifficultyLevel;
  partOfSpeech: string;
  exampleSentences: string[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  usageNotes?: string;
  tags: string[];
  audioUrl?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
  wordProgress?: WordProgress;
};

export type UserWordList = BaseEntity & {
  userId: string;
  name: string;
  description: string;
  words: Word[];
};

export type WordProgress = BaseEntity & {
  userId: string;
  wordId: string;
  recognitionLevel: number;
  usageLevel: number;
  masteryScore: number;
  practiceCount: number;
  successCount: number;
  lastPracticed: Date;
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

// Frontend Types

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

export interface WordList {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];
  wordCount: number;
}
