import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Text,
  Searchbar,
  Surface,
  ActivityIndicator,
  Button,
} from "react-native-paper";
import { useRouter } from "expo-router";
import useTheme from "@/src/hooks/useTheme";
import { useStore } from "@/src/stores/store";
import { WordListCard } from "@/src/components/WordListCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  FadeInUp,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import debounce from "lodash/debounce";

type ViewMode = "browse" | "search";

export default function StoreScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { colors } = useTheme();
  const {
    wordLists,
    wordListPageInfo,
    fetchWordLists,
    isFetchingWordLists,
    addListToUserLists,
    removeListFromUserLists,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const headerHeight = 85;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight / 3],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
      zIndex: 100,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    };
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length > 0) {
        fetchWordLists(1, wordListPageInfo.perPage, query);
      } else {
        fetchWordLists(1, wordListPageInfo.perPage);
      }
    }, 500),
    [wordListPageInfo.perPage]
  );

  useEffect(() => {
    fetchWordLists(wordListPageInfo.page, wordListPageInfo.perPage);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setViewMode("search");
      debouncedSearch(text);
    } else {
      setViewMode("browse");
      fetchWordLists(1, wordListPageInfo.perPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (viewMode === "search") {
      fetchWordLists(page, wordListPageInfo.perPage, searchQuery);
    } else {
      fetchWordLists(page, wordListPageInfo.perPage);
    }
  };

  const renderPaginationControls = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const { page: currentPage, totalPages } = wordListPageInfo;

    if (totalPages <= 1) {
      return [];
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pageNumbers.push(
      <TouchableOpacity
        key="prev"
        disabled={currentPage === 1}
        onPress={() => handlePageChange(currentPage - 1)}
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled,
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={20}
          color={currentPage === 1 ? colors.onSurfaceDisabled : colors.primary}
        />
      </TouchableOpacity>
    );

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={[
            styles.paginationButton,
            currentPage === i && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={{
              color: currentPage === i ? colors.onPrimary : colors.onSurface,
              fontWeight: currentPage === i ? "bold" : "normal",
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    pageNumbers.push(
      <TouchableOpacity
        key="next"
        disabled={currentPage === totalPages}
        onPress={() => handlePageChange(currentPage + 1)}
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationButtonDisabled,
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={
            currentPage === totalPages
              ? colors.onSurfaceDisabled
              : colors.primary
          }
        />
      </TouchableOpacity>
    );

    return pageNumbers;
  };

  const renderListItem = (list: any, index: number) => (
    <View key={list.id}>
      <Animated.View
        entering={FadeInUp.delay(200 + index * 100)
          .duration(600)
          .springify()}
      >
        <WordListCard
          list={list}
          onPress={() => router.push(`/(protected)/list/${list.id}`)}
          shouldShowAddToListButton={true}
          onAddToListPress={() => {
            if (list.inUsersBank) {
              removeListFromUserLists(list.id);
            } else {
              addListToUserLists(list.id);
            }
          }}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {isFetchingWordLists ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Animated.View style={headerAnimatedStyle}>
              <View style={styles.searchContainer}>
                <Animated.View entering={FadeInDown.duration(700).springify()}>
                  <View style={styles.searchOverflowWrapper}>
                    <Surface
                      style={[
                        styles.searchSurface,
                        { backgroundColor: colors.surfaceVariant },
                      ]}
                    >
                      <View style={styles.cardWrapper}>
                        <View style={styles.searchWrapper}>
                          <Searchbar
                            placeholder="Search word lists..."
                            onChangeText={handleSearch}
                            value={searchQuery}
                            style={[
                              styles.searchBar,
                              {
                                backgroundColor: colors.surfaceVariant,
                                borderColor: colors.outline,
                              },
                            ]}
                            elevation={0}
                            inputStyle={{ color: colors.onSurface }}
                            placeholderTextColor={colors.onSurfaceVariant}
                            icon={() => (
                              <MaterialCommunityIcons
                                name="magnify"
                                size={24}
                                color={colors.onSurfaceVariant}
                              />
                            )}
                            clearIcon={() => (
                              <TouchableOpacity
                                onPress={() => handleSearch("")}
                              >
                                <MaterialCommunityIcons
                                  name="close"
                                  size={24}
                                  color={colors.primary}
                                />
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      </View>
                    </Surface>
                  </View>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.ScrollView
              contentContainerStyle={[
                styles.scrollViewContainer,
                { paddingTop: headerHeight + 16 },
              ]}
              scrollEventThrottle={16}
              bounces={true}
              showsVerticalScrollIndicator={false}
              decelerationRate="normal"
              onScroll={scrollHandler}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.contentContainer}>
                {viewMode === "browse" ? (
                  <View style={styles.browseContainer}>
                    <Animated.View
                      entering={FadeInDown.duration(800).springify()}
                    >
                      <View style={styles.recommendedContainer}>
                        <View style={styles.recommendedLists}>
                          {wordLists.map((list, index) =>
                            renderListItem(list, index)
                          )}
                        </View>
                      </View>
                    </Animated.View>
                  </View>
                ) : (
                  <View style={styles.searchResultsContainer}>
                    <Animated.View
                      entering={FadeInDown.duration(800).springify()}
                    >
                      <Text
                        style={[
                          styles.searchResultsText,
                          { color: colors.onSurfaceVariant },
                        ]}
                      >
                        {wordLists.length === 0 && !isFetchingWordLists
                          ? "No results found"
                          : wordLists.length > 0
                          ? `${wordLists.length} results found`
                          : "Searching..."}
                      </Text>
                      {wordLists.length === 0 && !isFetchingWordLists && (
                        <View style={styles.noResultsContainer}>
                          <Button
                            mode="outlined"
                            icon="magnify"
                            onPress={() => handleSearch("")}
                            style={{ marginVertical: 10 }}
                          >
                            Clear Search
                          </Button>
                        </View>
                      )}
                      <View style={styles.searchResults}>
                        {wordLists.map((list, index) =>
                          renderListItem(list, index)
                        )}
                      </View>
                    </Animated.View>
                  </View>
                )}

                <View style={styles.paginationContainer}>
                  <Animated.View
                    entering={FadeInDown.duration(900).springify()}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {renderPaginationControls()}
                    </View>
                  </Animated.View>
                </View>
              </View>
            </Animated.ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchSurface: {
    borderRadius: 12,
  },
  searchWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  searchBar: {
    borderWidth: 0,
    borderRadius: 12,
    elevation: 0,
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  browseContainer: {
    flex: 1,
    gap: 20,
  },
  recommendedContainer: {
    borderRadius: 15,
  },
  recommendedLists: {
    gap: 12,
  },
  searchResultsContainer: {
    flex: 1,
    gap: 10,
  },
  searchResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  searchResults: {
    gap: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  paginationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  cardWrapper: {
    overflow: "hidden",
    borderRadius: 16,
  },
  searchOverflowWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
