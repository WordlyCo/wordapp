import { StateCreator } from "zustand";
import { authFetch } from "@/lib/api";
import { WordListCategory, WordList } from "@/src/types/lists";
import { Word, WordProgressUpdate } from "@/src/types/words";

type QuizStats = {
  currentIndex: number;
  score: number;
  selectedAnswer: string;
  startTime: number;
  correctAnswers: number;
  totalTime: number;
  answerResults: Record<number, boolean>;
};
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
  quizWords: Word[];
  quizStats: QuizStats;
  userStats: {
    diamonds: number;
    streak: number;
    lastActive: Date | null;
    dailyProgress: {
      wordsPracticed: number;
      totalWordsGoal: number;
      practiceTime: number; // in minutes
      practiceTimeGoal: number; // in minutes
    };
    learningInsights: {
      wordsMastered: number;
      accuracy: number; // percentage
    };
  };
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  fetchListsByCategory: (id: string) => Promise<void>;
  fetchWordLists: (page: number, perPage: number) => Promise<void>;
  addListToUserLists: (listId: string) => Promise<string | void>;
  removeListFromUserLists: (listId: string) => Promise<string | void>;
  fetchUserLists: () => Promise<void>;
  fetchDailyQuiz: () => Promise<void>;
  setQuizStats: (newState: QuizStats) => Promise<void>;
  setQuizWords: (newState: Word[]) => Promise<void>;
  updateWordProgress: (wordProgress: WordProgressUpdate) => Promise<void>;
  updateDiamonds: (amount: number) => void;
  updateStreak: () => void;
  fetchUserStats: () => Promise<void>;
  updatePracticeTime: (minutes: number) => void;
  updateAccuracy: (correct: boolean) => void;
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
  quizWords: [],
  quizStats: {
    currentIndex: 0,
    score: 0,
    selectedAnswer: "",
    startTime: 0,
    correctAnswers: 0,
    totalTime: 0,
    answerResults: {},
  },
  userStats: {
    diamonds: 0,
    streak: 0,
    lastActive: null,
    dailyProgress: {
      wordsPracticed: 0,
      totalWordsGoal: 10,
      practiceTime: 0,
      practiceTimeGoal: 30,
    },
    learningInsights: {
      wordsMastered: 0,
      accuracy: 0,
    },
  },

  setQuizWords: async (newState: Word[]) => {
    set({ quizWords: newState });
  },

  setQuizStats: async (newState) => {
    set({ quizStats: newState });
  },

  updateWordProgress: async (wordProgress: WordProgressUpdate) => {
    try {
      const response = await authFetch(
        `/users/progress/words/${wordProgress.wordId}`,
        {
          method: "PUT",
          body: JSON.stringify(wordProgress),
        }
      );

      const data = await response.json();
      const success = data.success;
      const message = data.message;

      if (!success) {
        console.error("Failed to update word progress:", message);
        return;
      }

      const state = get();
      const updatedQuizWords = [...state.quizWords];

      const wordIndex = updatedQuizWords.findIndex(
        (word) => word.id === wordProgress.wordId
      );

      if (wordIndex !== -1) {
        updatedQuizWords[wordIndex] = {
          ...updatedQuizWords[wordIndex],
          wordProgress: {
            ...updatedQuizWords[wordIndex].wordProgress,
            ...wordProgress,
          },
        };

        set({ quizWords: updatedQuizWords });

        const { userStats } = get();
        set({
          userStats: {
            ...userStats,
            dailyProgress: {
              ...userStats.dailyProgress,
              wordsPracticed: userStats.dailyProgress.wordsPracticed + 1,
            },
          },
        });

        const recognitionScore = wordProgress.recognitionMasteryScore;
        const previousScore =
          updatedQuizWords[wordIndex].wordProgress?.recognitionMasteryScore ||
          0;

        if (recognitionScore && recognitionScore >= 3 && previousScore < 3) {
          set({
            userStats: {
              ...userStats,
              learningInsights: {
                ...userStats.learningInsights,
                wordsMastered: userStats.learningInsights.wordsMastered + 1,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating word progress:", error);
    }
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
      const errorCode = data.errorCode;

      if (!success) {
        return errorCode;
      }
    } catch (error) {
      console.error("Error adding list to user lists:", error);
    }
  },

  removeListFromUserLists: async (listId: string) => {
    try {
      const response = await authFetch(`/users/lists/${listId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const errorCode = data.errorCode;

      if (!success) {
        console.error("Failed to remove list from user lists:", message);
        return errorCode;
      }
    } catch (error) {
      console.error("Error removing list from user lists:", error);
    }
  },

  fetchWordLists: async (page: number = 1, perPage: number = 10) => {
    set({ isFetchingWordLists: true });
    try {
      const response = await authFetch(
        `/lists/?page=${page}&per_page=${perPage}`
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
        return;
      }

      const payload = data.payload;
      const items = payload.items;
      set({ categories: items });
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      const message = data.message;
      const payload = data.payload;

      if (!success) {
        console.error("Failed to fetch category:", message);
        return;
      }

      set({ selectedCategory: payload });
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyQuiz: async () => {
    try {
      const response = await authFetch("/quizzes/daily-quiz");
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;

      if (!success) {
        console.error("Failed to fetch daily quiz:", message);
        return;
      }

      console.log("Daily quiz:", payload);

      set({ quizWords: payload });
    } catch (error) {
      console.error("Error fetching daily quiz:", error);
    }
  },

  updateDiamonds: async (amount: number) => {
    const { userStats } = get();

    // Update local state first for instant feedback
    set({
      userStats: {
        ...userStats,
        diamonds: userStats.diamonds + amount,
      },
    });

    // Then update backend
    try {
      await authFetch(`/users/stats/diamonds/${amount}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error updating diamonds:", error);
    }
  },

  updateStreak: async () => {
    try {
      // Call backend endpoint to update streak
      const response = await authFetch("/users/stats/streak/update", {
        method: "PUT",
      });

      const data = await response.json();
      if (data.success) {
        // Get user stats to refresh with updated streak
        await get().fetchUserStats();
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  },

  fetchUserStats: async () => {
    try {
      const response = await authFetch("/users/stats");
      const data = await response.json();
      const success = data.success;
      const message = data.message;
      const payload = data.payload;

      console.log("User stats:", payload);
      if (!success) {
        console.error("Failed to fetch user stats:", message);
        return;
      }

      // Backend response now matches our store format exactly
      set({ userStats: payload });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Initialize with default values if fetch fails
      const { userStats } = get();
      if (!userStats.lastActive) {
        set({
          userStats: {
            ...userStats,
            lastActive: new Date(),
            dailyProgress: {
              wordsPracticed: 0,
              totalWordsGoal: 10,
              practiceTime: 0,
              practiceTimeGoal: 30,
            },
            learningInsights: {
              wordsMastered: 0,
              accuracy: 0,
            },
          },
        });
      }
    }
  },

  updatePracticeTime: async (minutes: number) => {
    const { userStats } = get();

    // Update local state first
    set({
      userStats: {
        ...userStats,
        dailyProgress: {
          ...userStats.dailyProgress,
          practiceTime: userStats.dailyProgress.practiceTime + minutes,
        },
      },
    });

    // Then update backend
    try {
      await authFetch("/users/practice-session", {
        method: "POST",
        body: JSON.stringify({
          practice_time: minutes,
          session_type: "quiz",
        }),
      });
    } catch (error) {
      console.error("Error recording practice time:", error);
    }
  },

  updateAccuracy: async (correct: boolean) => {
    const { userStats } = get();
    const totalAttempts = Object.keys(get().quizStats.answerResults).length;
    const correctAnswers = Object.values(get().quizStats.answerResults).filter(
      (result) => result === true
    ).length;
    const newAccuracy =
      totalAttempts > 0
        ? Math.round((correctAnswers / totalAttempts) * 100)
        : 0;

    // Update local state
    set({
      userStats: {
        ...userStats,
        learningInsights: {
          ...userStats.learningInsights,
          accuracy: newAccuracy,
        },
      },
    });

    // Update backend
    try {
      await authFetch("/users/stats", {
        method: "PUT",
        body: JSON.stringify({
          average_accuracy: newAccuracy,
        }),
      });
    } catch (error) {
      console.error("Error updating accuracy:", error);
    }
  },
});
