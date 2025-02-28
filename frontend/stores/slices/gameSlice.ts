import { StateCreator } from "zustand";
import {
  WordProgress,
  SessionWord,
  WordCategory,
  UserWordList,
  PracticeSession,
} from "../types";
import { categories } from "../mockData";
import { SessionType } from "../enums";
import uuid from "react-native-uuid";
import { wordData } from "../mockData";
import { shuffleArray } from "@/utils";

export interface GameSlice {
  isLoading: boolean;
  categories: WordCategory[];
  selectedCategory: WordCategory | null;
  currentSession: PracticeSession | null;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  startSession: (sessionType: SessionType) => Promise<void>;
}

export const createGameSlice: StateCreator<GameSlice> = (set, get) => ({
  isLoading: false,
  categories: [],
  selectedCategory: null,
  currentSession: null,

  fetchCategories: async () => {
    // TODO: Fetch categories from backend
    // This is simulating the backend response
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ categories: categories });
    set({ isLoading: false });
  },

  fetchCategory: async (id: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({
      selectedCategory: categories.find((category) => category.id === id),
    });
    set({ isLoading: false });
  },

  startSession: async (sessionType: SessionType) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    const end = Math.random() * (wordData.length - 0) + 0;
    const begin = Math.random() * (end - 0) + 0;

    const shuffledWords = shuffleArray(wordData);

    set({
      currentSession: {
        id: uuid.v4(),
        startTime: new Date(),
        sessionType,
        userId: "1",
        endTime: new Date(),
        totalQuestions: 0,
        correctAnswers: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        sessionWords: shuffledWords.slice(0, 10).map((word) => ({
          ...word,
          wasCorrect: false,
          timeTaken: 0,
        })),
      },
    });
    set({ isLoading: false });
  },
});
