import { authFetch, clearCachedToken } from "@/lib/api";
import { WordListCategory, WordList } from "@/src/types/lists";
import { Word, WordProgressUpdate } from "@/src/types/words";
import {
  UserPreferences,
  UserStats,
  User,
  TopFiveUsers,
} from "@/src/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HAS_ONBOARDED_KEY } from "@/constants";
import { StateCreator } from "zustand";

type QuizStats = {
  currentIndex: number;
  score: number;
  selectedAnswer: string;
  startTime: number;
  correctAnswers: number;
  totalTime: number;
  answerResults: Record<number, boolean>;
};
export interface WordAppSlice {
  // USER
  user: User | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  authError: string | null;
  isFetchingUser: boolean;
  topFiveUsers: TopFiveUsers[];
  isFetchingTopFiveUsers: boolean;
  setAuthError: (error: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setHasOnboarded: (hasOnboarded: boolean) => void;
  loadOnboardingStatus: () => Promise<void>;
  fetchTopFiveUsers: () => Promise<void>;

  // GENERAL
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
  isFetchingDailyQuiz: boolean;
  quizWordsError: string | null;
  quizStats: QuizStats;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  fetchListsByCategory: (id: string) => Promise<void>;
  fetchWordLists: (
    page: number,
    perPage: number,
    searchQuery?: string
  ) => Promise<void>;
  addListToUserLists: (listId: string) => Promise<string | void>;
  updateListFavoriteStatus: (
    listId: string,
    isFavorite: boolean
  ) => Promise<void>;
  removeListFromUserLists: (listId: string) => Promise<string | void>;
  fetchUserLists: ({
    searchQuery,
    filterBy,
  }: {
    searchQuery?: string;
    filterBy?: string | null;
  }) => Promise<void>;
  fetchDailyQuiz: () => Promise<void>;
  setQuizStats: (newState: QuizStats) => Promise<void>;
  setQuizWords: (newState: Word[]) => Promise<void>;
  updateWordProgress: (wordProgress: WordProgressUpdate) => Promise<void>;
  updateDiamonds: (amount: number) => void;
  updateStreak: () => void;
  updatePracticeTime: (minutes: number) => void;
  updateAccuracy: (correct: boolean) => void;

  // User lists state
  isFetchingUserLists: boolean;
}

export const createWordAppSlice: StateCreator<WordAppSlice> = (set, get) => {
  const initializeStore = async () => {
    try {
      const storedHasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
      if (storedHasOnboarded !== null) {
        set({ hasOnboarded: JSON.parse(storedHasOnboarded) });
      }
    } catch (error) {
      console.error("Failed to load onboarding status:", error);
    }
  };

  initializeStore();

  return {
    // USER
    user: null,
    isFetchingUser: false,
    authError: null,
    isAuthenticated: false,
    hasOnboarded: false,
    topFiveUsers: [],
    isFetchingTopFiveUsers: false,

    // GENERAL
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
    isFetchingDailyQuiz: false,
    quizWordsError: null,
    quizStats: {
      currentIndex: 0,
      score: 0,
      selectedAnswer: "",
      startTime: 0,
      correctAnswers: 0,
      totalTime: 0,
      answerResults: {},
    },

    // User lists state
    isFetchingUserLists: false,

    // USER FUNCTIONS
    setAuthError: (error: string) => {
      set({ authError: error });
    },

    getMe: async () => {
      set({ isFetchingUser: true });
      try {
        const response = await authFetch(`/users/me`);
        const data = await response.json();

        if (!data.success) {
          set({ authError: data.message || "Failed to get user" });
          return;
        }

        const payload = data.payload;
        if (!payload) {
          set({ authError: "No payload returned from server" });
          return;
        }

        set({
          user: payload,
          isAuthenticated: true,
        });
      } catch (error) {
        console.log("Failed to get user", error);
        set({
          authError: "Failed to get user",
          user: null,
          isAuthenticated: false,
        });
      } finally {
        set({ isFetchingUser: false });
      }
    },

    fetchTopFiveUsers: async () => {
      set({ isFetchingTopFiveUsers: true });
      try {
        const response = await authFetch("/users/top-five-users");
        const data = await response.json();
        if (data.success) {
          set({ topFiveUsers: data.payload });
        } else {
          console.error("Error fetching top five users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching top five users:", error);
      } finally {
        set({ isFetchingTopFiveUsers: false });
      }
    },

    logout: async () => {
      clearCachedToken();

      set({
        user: null,
        isAuthenticated: false,
      });
    },

    updatePreferences: async (newPreferences: Partial<UserPreferences>) => {
      const state = get();
      const currentUser = state.user;

      if (currentUser && currentUser.preferences) {
        set({
          user: {
            ...currentUser,
            preferences: {
              ...currentUser.preferences,
              ...newPreferences,
              updatedAt: new Date(),
            },
          },
        });
      }
    },

    updateStats: (newStats: Partial<UserStats>) => {
      const state = get();
      const currentUser = state.user;

      if (currentUser && currentUser.userStats) {
        const newUser: User = {
          ...currentUser,
          userStats: {
            ...currentUser.userStats,
            totalWordsLearned: newStats.totalWordsLearned || 0,
            currentStreak: newStats.currentStreak || 0,
            longestStreak: newStats.longestStreak || 0,
            totalPracticeTime: newStats.totalPracticeTime || 0,
            averageAccuracy: newStats.averageAccuracy || 0,
          },
        };
        set({
          user: newUser,
        });
      }
    },

    setHasOnboarded: async (hasOnboarded: boolean) => {
      await AsyncStorage.setItem(
        HAS_ONBOARDED_KEY,
        JSON.stringify(hasOnboarded)
      );
      set({ hasOnboarded });
    },

    loadOnboardingStatus: async () => {
      try {
        const storedHasOnboarded = await AsyncStorage.getItem(
          HAS_ONBOARDED_KEY
        );
        if (storedHasOnboarded !== null) {
          set({ hasOnboarded: JSON.parse(storedHasOnboarded) });
        }
      } catch (error) {
        console.error("Failed to load onboarding status:", error);
      }
    },

    // GENERAL FUNCTIONS

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

          const state = get();
          const currentUser = state.user;
          if (currentUser && currentUser.userStats) {
            const newUserStats = {
              ...currentUser.userStats,
              dailyProgress: {
                ...currentUser.userStats.dailyProgress,
                wordsPracticed:
                  currentUser.userStats.dailyProgress.wordsPracticed + 1,
              },
            };
            set({
              user: {
                ...currentUser,
                userStats: newUserStats,
              },
            });
          }

          const recognitionScore = wordProgress.recognitionMasteryScore;
          const previousScore =
            updatedQuizWords[wordIndex].wordProgress?.recognitionMasteryScore ||
            0;

          if (recognitionScore && recognitionScore >= 3 && previousScore < 3) {
            const state = get();
            const currentUser = state.user;

            if (currentUser && currentUser.userStats) {
              const newUser: User = {
                ...currentUser,
                userStats: {
                  ...currentUser.userStats,
                  learningInsights: {
                    ...currentUser.userStats.learningInsights,
                    wordsMastered:
                      currentUser.userStats.learningInsights.wordsMastered + 1,
                  },
                },
              };
              set({
                user: newUser,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error updating word progress:", error);
      }
    },

    fetchUserLists: async ({
      searchQuery,
      filterBy,
    }: {
      searchQuery?: string;
      filterBy?: string | null;
    }) => {
      try {
        let queryParams: Record<string, string> = {};
        if (searchQuery) {
          queryParams["search_query"] = searchQuery;
        }
        if (filterBy) {
          queryParams["filter_by"] = filterBy;
        }
        let url = `/users/lists`;

        if (Object.keys(queryParams).length > 0) {
          url += `?${new URLSearchParams(queryParams).toString()}`;
        }

        set({ isFetchingUserLists: true });
        const response = await authFetch(url);
        const data = await response.json();

        if (data.success) {
          set({ userLists: data.payload });
        } else {
          console.error("Error fetching user lists:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user lists:", error);
      } finally {
        set({ isFetchingUserLists: false });
      }
    },

    addListToUserLists: async (listId: string) => {
      const state = get();
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

        const newSelectedList = state.selectedList
          ? { ...state.selectedList, inUsersBank: true }
          : null;

        const newWordLists = state.wordLists.map((list) =>
          list.id === listId ? { ...list, inUsersBank: true } : list
        );

        set({ selectedList: newSelectedList, wordLists: newWordLists });
        await get().fetchUserLists({ filterBy: null });
      } catch (error) {
        console.error("Error adding list to user lists:", error);
      }
    },

    updateListFavoriteStatus: async (listId: string, isFavorite: boolean) => {
      const state = get();
      const userLists = state.userLists;

      try {
        const response = await authFetch(`/users/lists/${listId}`, {
          method: "PUT",
          body: JSON.stringify({ isFavorite }),
        });

        const data = await response.json();
        const success = data.success;
        const message = data.message;
        const errorCode = data.errorCode;

        if (!success) {
          console.error("Failed to update list favorite status:", message);
          return errorCode;
        }

        if (!userLists) {
          return;
        }

        const newUserLists = userLists.map((list) =>
          list.id === listId ? { ...list, isFavorite } : list
        );

        set({ userLists: newUserLists });
      } catch (error) {
        console.error("Error updating list favorite status:", error);
      }
    },

    removeListFromUserLists: async (listId: string) => {
      const state = get();
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

        const newSelectedList = state.selectedList
          ? { ...state.selectedList, inUsersBank: false }
          : null;

        const newWordLists = state.wordLists.map((list) =>
          list.id === listId ? { ...list, inUsersBank: false } : list
        );

        set({ selectedList: newSelectedList, wordLists: newWordLists });
        await get().fetchUserLists({ filterBy: null });
      } catch (error) {
        console.error("Error removing list from user lists:", error);
      }
    },

    fetchWordLists: async (
      page: number = 1,
      perPage: number = 10,
      searchQuery?: string
    ) => {
      set({ isFetchingWordLists: true });
      try {
        const url = `/lists/?page=${page}&per_page=${perPage}${
          searchQuery ? `&search_query=${encodeURIComponent(searchQuery)}` : ""
        }`;
        const response = await authFetch(url);
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
      set({ isFetchingDailyQuiz: true });
      set({ quizWordsError: null });
      try {
        const response = await authFetch("/quizzes/daily-quiz");
        const data = await response.json();
        const success = data.success;
        const payload = data.payload;

        if (!success) {
          set({ quizWordsError: "No daily quiz found" });
          return;
        }

        set({ quizWords: payload });
      } catch (error) {
        console.error("Error fetching daily quiz:", error);
        set({ quizWordsError: "Error fetching daily quiz" });
      } finally {
        set({ isFetchingDailyQuiz: false });
      }
    },

    updateDiamonds: async (amount: number) => {
      const state = get();
      const currentUser = state.user;

      if (currentUser && currentUser.userStats) {
        const newUser: User = {
          ...currentUser,
          userStats: {
            ...currentUser.userStats,
            diamonds: currentUser.userStats.diamonds + amount,
          },
        };
        set({ user: newUser });
      }

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
        const response = await authFetch("/users/stats/streak/update", {
          method: "PUT",
        });

        const data = await response.json();
        if (data.success) {
          await get().getMe();
        }
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    },

    updatePracticeTime: async (minutes: number) => {
      const state = get();
      const currentUser = state.user;

      if (currentUser && currentUser.userStats) {
        const newUser: User = {
          ...currentUser,
          userStats: {
            ...currentUser.userStats,
            dailyProgress: {
              ...currentUser.userStats.dailyProgress,
              practiceTime:
                currentUser.userStats.dailyProgress.practiceTime + minutes,
            },
          },
        };
        set({ user: newUser });
      }

      try {
        await authFetch(
          `/users/practice-session?practice_time=${minutes}&session_type=quiz`,
          {
            method: "POST",
          }
        );
      } catch (error) {
        console.error("Error recording practice time:", error);
      }
    },

    updateAccuracy: async (correct: boolean) => {
      const state = get();
      const currentUser = state.user;
      const totalAttempts = Object.keys(state.quizStats.answerResults).length;
      const correctAnswers = Object.values(
        state.quizStats.answerResults
      ).filter((result) => result === true).length;
      const newAccuracy =
        totalAttempts > 0
          ? Math.round((correctAnswers / totalAttempts) * 100)
          : 0;

      if (currentUser && currentUser.userStats) {
        const newUser: User = {
          ...currentUser,
          userStats: {
            ...currentUser.userStats,
            learningInsights: {
              ...currentUser.userStats.learningInsights,
              accuracy: newAccuracy,
            },
          },
        };
        set({ user: newUser });
      }

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
  };
};
