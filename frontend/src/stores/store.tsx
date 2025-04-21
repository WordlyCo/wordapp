import { create } from "zustand";
import { createWordAppSlice } from "./slice";

export const useWordAppStore = create(createWordAppSlice);

export const useStore = () => {
  const {
    // User Lists
    userLists,
    fetchUserLists,
    addListToUserLists,
    removeListFromUserLists,
    isFetchingUserLists,

    // Word Lists
    wordLists,
    wordListPageInfo,
    fetchWordLists,
    isFetchingWordLists,

    // Other state and actions
    // ...
  } = useWordAppStore();

  return {
    // User Lists
    userLists,
    fetchUserLists,
    addListToUserLists,
    removeListFromUserLists,
    isFetchingUserLists,

    // Word Lists
    wordLists,
    wordListPageInfo,
    fetchWordLists,
    isFetchingWordLists,

    // Other exported state and actions
    // ...
  };
};
