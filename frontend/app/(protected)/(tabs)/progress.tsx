import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Text,
  ActivityIndicator,
  Searchbar,
  Surface,
  IconButton,
  Avatar,
} from "react-native-paper";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import useTheme from "@/src/hooks/useTheme";
import { authFetch } from "@/lib/api";
import { WordProgressCard } from "@/src/features/progress/WordProgressCard";
import { useStore } from "@/src/stores/store";

type SortOption =
  | "mastery_asc"
  | "mastery_desc"
  | "difficulty_asc"
  | "difficulty_desc";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const [words, setWords] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("mastery_desc");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const { topFiveUsers, isFetchingTopFiveUsers, fetchTopFiveUsers } =
    useStore();

  const scrollY = useSharedValue(0);
  const headerHeight = 150; // Height of search + filter section

  useEffect(() => {
    fetchWordProgress();
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

  const fetchWordProgress = async () => {
    setIsLoading(true);
    try {
      const response = await authFetch(
        `/users/progress/words?page=${page}&per_page=${perPage}`
      );
      const data = await response.json();

      if (data.success) {
        setWords(data.payload.items);
        setTotalPages(data.payload.pageInfo.totalPages);
      } else {
        console.error("Failed to fetch word progress:", data.message);
      }
    } catch (error) {
      console.error("Error fetching word progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedWords = () => {
    if (!words) return [];

    const filtered = searchQuery
      ? words.filter(
          (word) =>
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.definition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : words;

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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

  const renderWordCard = ({ item, index }: { item: any; index: number }) => {
    return <WordProgressCard item={item} index={index} colors={colors} />;
  };

  const TopUsersSection = () => {
    if (isFetchingTopFiveUsers) {
      return (
        <View style={styles.topUsersLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }

    if (!topFiveUsers || topFiveUsers.length === 0) {
      return null;
    }

    return (
      <View style={styles.topUsersContainer}>
        <Text style={[styles.topUsersTitle, { color: colors.onBackground }]}>
          Top Learners
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topUsersScrollContent}
        >
          {topFiveUsers.map((user, index) => (
            <Animated.View
              key={user.id}
              entering={FadeInRight.delay(index * 100).springify()}
            >
              <Surface
                style={[
                  styles.topUserCard,
                  { backgroundColor: colors.surfaceVariant },
                ]}
                elevation={2}
              >
                <View style={styles.topUserContent}>
                  {user.profilePictureUrl ? (
                    <Avatar.Image
                      size={50}
                      source={{ uri: user.profilePictureUrl }}
                      style={styles.topUserAvatar}
                    />
                  ) : (
                    <Avatar.Icon
                      size={50}
                      icon="account"
                      color={colors.onSurfaceVariant}
                      style={[
                        styles.topUserAvatar,
                        { backgroundColor: colors.primaryContainer },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.topUserName,
                      { color: colors.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {user.username}
                  </Text>
                  <View style={styles.topUserStatsContainer}>
                    <View style={styles.topUserStat}>
                      <MaterialCommunityIcons
                        name="book-open-page-variant"
                        size={14}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          styles.topUserStatText,
                          { color: colors.onSurfaceVariant },
                        ]}
                      >
                        {user.totalWordsLearned}
                      </Text>
                    </View>
                    <View style={styles.topUserStat}>
                      <MaterialCommunityIcons
                        name="timer-outline"
                        size={14}
                        color={colors.secondary}
                      />
                      <Text
                        style={[
                          styles.topUserStatText,
                          { color: colors.onSurfaceVariant },
                        ]}
                      >
                        {user.totalPracticeTime}m
                      </Text>
                    </View>
                    <View style={styles.topUserStat}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={14}
                        color={colors.error}
                      />
                      <Text
                        style={[
                          styles.topUserStatText,
                          { color: colors.onSurfaceVariant },
                        ]}
                      >
                        {user.totalStreak}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={headerAnimatedStyle}>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchOverflowWrapper}>
              <Surface
                style={[
                  styles.searchSurface,
                  { backgroundColor: colors.surfaceVariant },
                ]}
              >
                <View style={styles.searchWrapper}>
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
                </View>
              </Surface>
            </View>
          </View>

          <View style={styles.filterContainer}>
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
                      sortBy === option.value && {
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
                        sortBy === option.value
                          ? colors.onSurface
                          : colors.onSurfaceVariant
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            sortBy === option.value
                              ? colors.onSurface
                              : colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.value && (
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
          </View>
        </View>
      </Animated.View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : sortedWords().length > 0 ? (
        <Animated.FlatList
          data={sortedWords()}
          renderItem={renderWordCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingTop: headerHeight },
          ]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListHeaderComponent={<TopUsersSection />}
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
                Page {page} of {totalPages}
              </Text>
              <IconButton
                icon="chevron-right"
                mode="contained"
                onPress={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                containerColor={colors.primaryContainer}
                iconColor={colors.primary}
              />
            </View>
          }
        />
      ) : (
        <View style={[styles.emptyContainer, { paddingTop: headerHeight }]}>
          <MaterialCommunityIcons
            name="book-open-variant"
            size={64}
            color={colors.onSurfaceVariant}
          />
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No words found
          </Text>
          <Text
            style={[styles.emptySubtext, { color: colors.onSurfaceVariant }]}
          >
            Add words to your lists to start tracking progress
          </Text>
        </View>
      )}
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
  searchContainer: {},
  searchOverflowWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  searchSurface: {
    borderRadius: 12,
  },
  cardWrapper: {
    borderRadius: 16,
  },
  searchWrapper: {
    borderRadius: 12,
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
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  topUsersContainer: {
    marginBottom: 16,
  },
  topUsersLoadingContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  topUsersTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  topUsersScrollContent: {
    paddingBottom: 8,
    gap: 16,
  },
  topUserCard: {
    borderRadius: 16,
    width: 120,
    height: 140,
    marginRight: 12,
    overflow: "hidden",
  },
  topUserContent: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  topUserAvatar: {
    marginBottom: 8,
  },
  topUserName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    width: "100%",
  },
  topUserStatsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  topUserStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  topUserStatText: {
    fontSize: 12,
    fontWeight: "500",
  },
  wordCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  wordCardWrapper: {
    overflow: "hidden",
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
