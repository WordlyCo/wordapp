import { StateCreator } from "zustand";
import { categories } from "../mockData";
import { authFetch } from "@/lib/api";
import { WordListCategory, WordList } from "@/src/types/lists";
import { Quiz } from "@/src/types/quiz";
export interface GameSlice {
  isLoading: boolean;
  isFetchingCategories: boolean;
  categories: WordListCategory[];
  wordLists: WordList[];
  isFetchingWordLists: boolean;
  selectedList: WordList | null;
  selectedCategory: WordListCategory | null;
  selectedListsByCategory: WordList[];
  isFetchingList: boolean;
  isFetchingListsByCategory: boolean;
  wordListPageInfo: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  userLists: WordList[];
  currentQuiz: Quiz | null;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  fetchListsByCategory: (id: string) => Promise<void>;
  fetchWordLists: (page: number, perPage: number) => Promise<void>;
  addListToUserLists: (listId: string) => Promise<void>;
  fetchUserLists: () => Promise<void>;
  initializeQuiz: () => void;
}

export const createGameSlice: StateCreator<GameSlice> = (set, get) => ({
  isLoading: false,
  categories: [],
  wordLists: [],
  wordListPageInfo: {
    page: 1,
    perPage: 5,
    totalItems: 0,
    totalPages: 0,
  },
  isFetchingCategories: false,
  isFetchingWordLists: false,
  selectedCategory: null,
  selectedList: null,
  isFetchingList: false,
  selectedListsByCategory: [],
  isFetchingListsByCategory: false,
  userLists: [],
  currentQuiz: null,

  initializeQuiz: () => {
    const mockQuiz: Quiz = {
      id: 1,
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      questions: [
        {
          id: 1,
          word: {
            id: "1",
            createdAt: new Date("2021-01-01"),
            updatedAt: new Date("2021-01-01"),
            word: "hello",
            definition: "a greeting",
            difficultyLevel: "beginner",
            partOfSpeech: "noun",
            synonyms: ["hi", "hey", "greeting"],
            antonyms: ["bye", "goodbye", "farewell"],
            examples: ["Hello, how are you?", "Hello, my name is John."],
            usageNotes: "Hello is a common greeting used in English.",
            tags: ["word", "greeting"],
            audioUrl: "https://example.com/hello.mp3",
            imageUrl: "https://example.com/hello.jpg",
            wordProgress: {
              id: "1",
              createdAt: new Date("2021-01-01"),
              updatedAt: new Date("2021-01-01"),
              userId: "1",
              wordId: "1",
              recognitionLevel: 0,
              usageLevel: 0,
              masteryScore: 0,
              practiceCount: 0,
              successCount: 0,
            },
          },
          type: "mcq",
          question: "What is the definition of hello?",
          options: [
            {
              id: 1,
              createdAt: "2021-01-01",
              updatedAt: "2021-01-01",
              option: "a greeting",
              questionId: 1,
            },
          ],
          correctAnswerIds: [1],
          createdAt: "2021-01-01",
          updatedAt: "2021-01-01",
        },
      ],
    };
    set({ currentQuiz: mockQuiz });
  },

  fetchUserLists: async () => {
    try {
      const response = await authFetch(`/users/lists`);
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;

      if (!success) {
        console.error("Failed to fetch user lists:", message);
        return;
      }

      set({ userLists: payload });
    } catch (error) {
      console.error("Error fetching user lists:", error);
    }
  },

  addListToUserLists: async (listId: string) => {
    try {
      const response = await authFetch(`/users/lists`, {
        method: "POST",
        body: JSON.stringify({ listId }),
      });

      const data = await response.json();
      const success = data.success;
      const message = data.message;

      if (!success) {
        console.error("Failed to add list to user lists:", message);
        return;
      }
    } catch (error) {
      console.error("Error adding list to user lists:", error);
    }
  },

  fetchWordLists: async (page: number = 1, perPage: number = 10) => {
    set({ isFetchingWordLists: true });
    try {
      const response = await authFetch(
        `/lists?page=${page}&per_page=${perPage}`
      );
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;

      if (!success) {
        console.error("Failed to fetch word lists:", message);
        return;
      }

      const pageInfo = payload.pageInfo;
      const items = payload.items;

      set({ wordLists: items, wordListPageInfo: pageInfo });
    } catch (error) {
      console.error("Error fetching word lists:", error);
    } finally {
      set({ isFetchingWordLists: false });
    }
  },

  fetchList: async (id: string) => {
    set({ isFetchingList: true });
    try {
      const response = await authFetch(`/lists/${id}`);
      const data = await response.json();
      const success = data.success;
      const message = data.message;

      if (!success) {
        console.error("Failed to fetch list:", message);
        return;
      }

      const payload = data.payload;
      set({ selectedList: payload });
    } catch (error) {
      console.error("Error fetching list:", error);
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

      if (!success) {
        console.error("Failed to fetch lists by category:", message);
        return;
      }

      const payload = data.payload;
      const items = payload.items;
      set({ selectedListsByCategory: items });
    } catch (error) {
      console.error("Error fetching lists by category:", error);
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

      if (!success) {
        console.error("Failed to fetch categories:", message);
        // Fall back to mock data if API fails
        set({ categories: categories });
        return;
      }

      const payload = data.payload;
      const items = payload.items;
      set({ categories: items });
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fall back to mock data if API errors
      set({ categories: categories });
    } finally {
      set({ isFetchingCategories: false });
    }
  },

  fetchCategory: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await authFetch(`/lists/categories/${id}`);
      const data = await response.json();
      const success = data.success;

      if (success) {
        set({ selectedCategory: data.payload });
      } else {
        // Fall back to mock data if API fails
        set({
          selectedCategory: categories.find((category) => category.id === id),
        });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      // Fall back to mock data
      set({
        selectedCategory: categories.find((category) => category.id === id),
      });
    } finally {
      set({ isLoading: false });
    }
  },
});
