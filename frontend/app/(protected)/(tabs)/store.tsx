import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  Text,
  Searchbar,
  Surface,
  ActivityIndicator,
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
  withTiming,
  FadeInUp,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

type ViewMode = "browse" | "search";

export default function StoreScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { colors } = useTheme();
  const { wordLists, wordListPageInfo, fetchWordLists, isFetchingWordLists } =
    useStore();
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

  useEffect(() => {
    fetchWordLists(wordListPageInfo.page, wordListPageInfo.perPage);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0 && viewMode !== "search") {
      setViewMode("search");
    } else if (text.length === 0 && viewMode === "search") {
      setViewMode("browse");
    }
  };

  const handlePageChange = (page: number) => {
    fetchWordLists(page, wordListPageInfo.perPage);
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {isFetchingWordLists ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Animated.View
              entering={FadeInDown.duration(700).springify()}
              style={[styles.searchBarContainer, headerAnimatedStyle]}
            >
              <Surface
                style={[
                  styles.searchSurface,
                  { backgroundColor: colors.surfaceVariant },
                ]}
              >
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
                    clearIcon={() =>
                      searchQuery ? (
                        <TouchableOpacity onPress={() => handleSearch("")}>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      ) : null
                    }
                  />
                </View>
              </Surface>
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
                  <Animated.View
                    entering={FadeInDown.duration(800).springify()}
                    style={styles.browseContainer}
                  >
                    <View style={styles.recommendedContainer}>
                      <View style={styles.recommendedLists}>
                        {wordLists.map((list, index) => (
                          <Animated.View
                            key={list.id}
                            entering={FadeInUp.delay(200 + index * 100)
                              .duration(600)
                              .springify()}
                          >
                            <WordListCard
                              list={list}
                              onPress={() =>
                                router.push(`/(protected)/list/${list.id}`)
                              }
                            />
                          </Animated.View>
                        ))}
                      </View>
                    </View>
                  </Animated.View>
                ) : (
                  <Animated.View
                    entering={FadeInDown.duration(800).springify()}
                    style={styles.searchResultsContainer}
                  >
                    <Text
                      style={[
                        styles.searchResultsText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {wordLists.length === 0
                        ? "No results found"
                        : `${wordLists.length} results found`}
                    </Text>
                    <View style={styles.searchResults}>
                      {wordLists.map((list, index) => (
                        <Animated.View
                          key={list.id}
                          entering={FadeInUp.delay(200 + index * 100)
                            .duration(600)
                            .springify()}
                        >
                          <WordListCard
                            list={list}
                            onPress={() =>
                              router.push(`/(protected)/list/${list.id}`)
                            }
                          />
                        </Animated.View>
                      ))}
                    </View>
                  </Animated.View>
                )}

                {/* Pagination Controls */}
                <Animated.View
                  entering={FadeInDown.duration(900).springify()}
                  style={styles.paginationContainer}
                >
                  {renderPaginationControls()}
                </Animated.View>
              </View>
            </Animated.ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
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
});
