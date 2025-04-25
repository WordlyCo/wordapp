import { TopUsers } from "@/src/features/progress/components/TopUsers";
import { WordProgressCard } from "@/src/features/progress/components/WordProgressCard";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useStore } from "@/src/stores/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Searchbar,
  Surface,
  Text,
} from "react-native-paper";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type SortOption =
  | "mastery_asc"
  | "mastery_desc"
  | "difficulty_asc"
  | "difficulty_desc";

const HEADER_HEIGHT = 150; // Height of search + filter section
const PER_PAGE = 10;

export default function ProgressScreen() {
  const { colors } = useAppTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("mastery_desc");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const {
    topFiveUsers,
    isFetchingTopFiveUsers,
    fetchTopFiveUsers,
    progressWords,
    isFetchingProgressWords,
    fetchProgressWords,
    progressWordsPageInfo,
  } = useStore();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    fetchProgressWords(page, PER_PAGE);
    fetchTopFiveUsers();
  }, [page, sortBy]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 3],
      Extrapolation.CLAMP
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

  const sortedWords = () => {
    if (!progressWords) return [];

    const filtered = searchQuery
      ? progressWords.filter(
          (word) =>
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.definition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : progressWords;

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "mastery_asc":
          return (
            (a.wordProgress?.recognitionMasteryScore || 0) -
            (b.wordProgress?.recognitionMasteryScore || 0)
          );
        case "mastery_desc":
          return (
            (b.wordProgress?.recognitionMasteryScore || 0) -
            (a.wordProgress?.recognitionMasteryScore || 0)
          );
        case "difficulty_asc":
          return (
            difficultyValue(a.difficultyLevel) -
            difficultyValue(b.difficultyLevel)
          );
        case "difficulty_desc":
          return (
            difficultyValue(b.difficultyLevel) -
            difficultyValue(a.difficultyLevel)
          );
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedWords = sortedWords();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const isActiveFilter = (filter: SortOption) => {
    return sortBy === filter;
  };

  if (isFetchingProgressWords) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (filteredAndSortedWords.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { paddingTop: HEADER_HEIGHT, backgroundColor: colors.background },
        ]}
      >
        <MaterialCommunityIcons
          name="book-open-variant"
          size={64}
          color={colors.onSurfaceVariant}
        />
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          No words found
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.onSurfaceVariant }]}>
          Add words to your lists to start tracking progress
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={headerAnimatedStyle}
        entering={FadeInDown.duration(700).springify()}
      >
        <View style={styles.headerContainer}>
          <View style={styles.searchOverflowWrapper}>
            <Surface
              style={[
                styles.searchSurface,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <Searchbar
                placeholder="Search words..."
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
                  <TouchableOpacity onPress={() => handleSearch("")}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
              />
            </Surface>
          </View>

          <View style={styles.filterContainer}>
            <Surface
              style={[
                styles.searchSurface,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.surfaceVariant },
                ]}
                onPress={() => setShowFilterOptions(!showFilterOptions)}
              >
                <MaterialCommunityIcons
                  name="filter-variant"
                  size={20}
                  color={colors.onSurface}
                />
                <Text
                  style={[styles.filterButtonText, { color: colors.onSurface }]}
                >
                  {getSortLabel(sortBy)}
                </Text>
                <MaterialCommunityIcons
                  name={showFilterOptions ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>

              {showFilterOptions && (
                <Animated.View
                  entering={FadeInDown.springify()}
                  style={[
                    styles.filterOptions,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  {[
                    {
                      value: "mastery_asc",
                      label: "Needs Work",
                      icon: "arrow-up" as const,
                    },
                    {
                      value: "mastery_desc",
                      label: "Mastered",
                      icon: "arrow-down" as const,
                    },
                    {
                      value: "difficulty_asc",
                      label: "Easy First",
                      icon: "sort-ascending" as const,
                    },
                    {
                      value: "difficulty_desc",
                      label: "Hard First",
                      icon: "sort-descending" as const,
                    },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        isActiveFilter(option.value as SortOption) && {
                          backgroundColor: colors.primaryContainer,
                        },
                      ]}
                      onPress={() => {
                        setSortBy(option.value as SortOption);
                        setShowFilterOptions(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={option.icon}
                        size={20}
                        color={
                          isActiveFilter(option.value as SortOption)
                            ? colors.onSurface
                            : colors.onSurfaceVariant
                        }
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color: isActiveFilter(option.value as SortOption)
                              ? colors.onSurface
                              : colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isActiveFilter(option.value as SortOption) && (
                        <MaterialCommunityIcons
                          name="check"
                          size={20}
                          color={colors.onSurface}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </Surface>
          </View>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={filteredAndSortedWords}
        renderItem={({ item, index }) => (
          <WordProgressCard item={item} index={index} colors={colors} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: HEADER_HEIGHT },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <TopUsers
            topFiveUsers={topFiveUsers}
            isFetchingTopFiveUsers={isFetchingTopFiveUsers}
            colors={colors}
          />
        }
        ListFooterComponent={
          <View style={styles.paginationContainer}>
            <IconButton
              icon="chevron-left"
              mode="contained"
              onPress={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              containerColor={colors.primaryContainer}
              iconColor={colors.primary}
            />
            <Text
              style={[styles.paginationText, { color: colors.onBackground }]}
            >
              Page {page} of {progressWordsPageInfo.totalPages}
            </Text>
            <IconButton
              icon="chevron-right"
              mode="contained"
              onPress={() =>
                setPage(Math.min(progressWordsPageInfo.totalPages, page + 1))
              }
              disabled={page === progressWordsPageInfo.totalPages}
              containerColor={colors.primaryContainer}
              iconColor={colors.primary}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },

  searchOverflowWrapper: {
    borderRadius: 12,
  },
  searchSurface: {
    borderRadius: 12,
  },
  cardWrapper: {
    borderRadius: 16,
  },
  searchBar: {
    borderWidth: 0,
    borderRadius: 12,
    elevation: 0,
  },
  filterContainer: {
    position: "relative",
    marginBottom: 8,
    zIndex: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  filterOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderRadius: 12,
    marginTop: 8,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
    gap: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  wordCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  wordCardWrapper: {
    borderRadius: 12,
  },
  wordCardContent: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  wordTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  wordTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  wordTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  wordType: {
    fontSize: 12,
    fontWeight: "600",
  },
  pronounceButton: {
    margin: 0,
    borderRadius: 20,
  },
  definitionContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  definition: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 8,
    gap: 8,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#00000010",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});

const getSortLabel = (sort: SortOption): string => {
  switch (sort) {
    case "mastery_desc":
      return "Sort: Mastered";
    case "mastery_asc":
      return "Sort: Needs Work";
    case "difficulty_asc":
      return "Sort: Easy First";
    case "difficulty_desc":
      return "Sort: Hard First";
    default:
      return "Sort";
  }
};

const difficultyValue = (level: string) => {
  switch (level) {
    case "basic":
      return 1;
    case "intermediate":
      return 2;
    case "advanced":
      return 3;
    default:
      return 0;
  }
};
