import { StateCreator } from "zustand";
import { PracticeSession } from "@/types/user";
import { categories } from "../mockData";
import { SessionType } from "../enums";
import uuid from "react-native-uuid";
import { wordData } from "../mockData";
import { shuffleArray } from "@/utils";
import { authFetch, API_URL } from "@/lib/api";
import { WordListCategory, WordList } from "@/types/lists";

export interface GameSlice {
  isLoading: boolean;
  isFetchingCategories: boolean;
  categories: WordListCategory[];
  selectedList: WordList | null;
  selectedCategory: WordListCategory | null;
  selectedListsByCategory: WordList[];
  isFetchingList: boolean;
  isFetchingListsByCategory: boolean;
  currentSession: PracticeSession | null;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  fetchListsByCategory: (id: string) => Promise<void>;
  startSession: (sessionType: SessionType) => Promise<void>;
}

export const createGameSlice: StateCreator<GameSlice> = (set, get) => ({
  isLoading: false,
  categories: [],
  isFetchingCategories: false,
  selectedCategory: null,
  currentSession: null,
  selectedList: null,
  isFetchingList: false,
  selectedListsByCategory: [],
  isFetchingListsByCategory: false,
  fetchList: async (id: string) => {
    set({ isFetchingList: true });
    try {
      const response = await authFetch(`/lists/${id}`);
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;
      const list = payload;

      if (response.ok) {
        if (success) {
          console.log("List fetched successfully", list);
          set({ selectedList: list });
        }
      } else {
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isFetchingList: false });
    }
  },

  fetchListsByCategory: async (id: string) => {
    set({ isFetchingListsByCategory: true });
    try {
      const response = await authFetch(`/lists/by-category/${id}`);
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;
      const items = payload.items;

      if (response.ok) {
        if (success) {
          console.log("Lists fetched successfully", items);
          set({ selectedListsByCategory: items });
        }
      } else {
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isFetchingListsByCategory: false });
    }
  },

  fetchCategories: async (page: number = 1, perPage: number = 10) => {
    set({ isFetchingCategories: true });
    try {
      const response = await authFetch(
        `/lists/categories?page=${page}&per_page=${perPage}`
      );
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;
      const items = payload.items;

      if (response.ok) {
        if (success) {
          console.log("Categories fetched successfully", items);
          set({ categories: items });
          return;
        }
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isFetchingCategories: false });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ categories: categories });
    set({ isFetchingCategories: false });
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
