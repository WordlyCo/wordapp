import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Avatar, Text, Divider, Searchbar, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import StickyHeader from "@/src/components/StickyHeader";
import useTheme from "@/src/hooks/useTheme";

import { useStore } from "@/stores/store";
import { WordListCard } from "@/src/components/WordListCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ViewMode = "browse" | "search";

export default function StoreScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const { wordLists, wordListPageInfo, fetchWordLists, isFetchingWordLists } =
    useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const searchFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchWordLists(wordListPageInfo.page, wordListPageInfo.perPage);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0 && viewMode !== "search") {
      switchToSearchMode();
    } else if (text.length === 0 && viewMode === "search") {
      switchToBrowseMode();
    }
  };

  const switchToSearchMode = () => {
    setViewMode("search");

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const switchToBrowseMode = () => {
    setViewMode("browse");

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
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

    // Previous button
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

    // Page numbers
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
              color: colors.onPrimary,
              fontWeight: currentPage === i ? "bold" : "normal",
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // Next button
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
      <StickyHeader />

      <View style={styles.container}>
        {isFetchingWordLists ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scrollViewContainer,
              { paddingBottom: 20 },
            ]}
            scrollEventThrottle={16}
            bounces={true}
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            <View style={styles.searchBarContainer}>
              <Searchbar
                placeholder="Search word lists..."
                onChangeText={handleSearch}
                value={searchQuery}
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}
                elevation={0}
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

            <View style={styles.recommendedHeader}>
              <Avatar.Icon
                size={36}
                icon="star"
                style={[styles.headerIcon, { backgroundColor: colors.primary }]}
                color={colors.onSurface}
              />
              <Text style={styles.heading}>Word Lists</Text>
            </View>
            {/* <Divider
              style={[
                styles.recommendedDivider,
                { backgroundColor: colors.primary },
              ]}
            /> */}

            <View style={styles.contentContainer}>
              <Animated.View
                style={[
                  styles.browseContainer,
                  {
                    opacity: fadeAnim,
                    position: viewMode === "search" ? "absolute" : "relative",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: viewMode === "browse" ? 1 : 0,
                  },
                ]}
                pointerEvents={viewMode === "browse" ? "auto" : "none"}
              >
                <View style={styles.recommendedContainer}>
                  <View style={styles.recommendedLists}>
                    {wordLists.map((list) => (
                      <WordListCard
                        key={list.id}
                        list={list}
                        onPress={() =>
                          router.push(`/(protected)/list/${list.id}`)
                        }
                      />
                    ))}
                  </View>

                  {/* Pagination Controls */}
                  <View style={styles.paginationContainer}>
                    {renderPaginationControls()}
                  </View>
                </View>
              </Animated.View>

              {/* Search Results */}
              <Animated.View
                style={[
                  styles.searchResultsContainer,
                  {
                    opacity: searchFadeAnim,
                    position: viewMode === "browse" ? "absolute" : "relative",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: viewMode === "search" ? 1 : 0,
                  },
                ]}
                pointerEvents={viewMode === "search" ? "auto" : "none"}
              >
                <Text style={styles.searchResultsText}>
                  {wordLists.length === 0
                    ? "No results found"
                    : `${wordLists.length} results found`}
                </Text>
                <View style={styles.searchResults}>
                  {wordLists.map((list) => (
                    <WordListCard
                      key={list.id}
                      list={list}
                      onPress={() =>
                        router.push(`/(protected)/list/${list.id}`)
                      }
                    />
                  ))}
                </View>

                {/* Pagination Controls for Search Results */}
                <View style={styles.paginationContainer}>
                  {renderPaginationControls()}
                </View>
              </Animated.View>
            </View>
          </Animated.ScrollView>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  searchBarContainer: {
    marginBottom: 15,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  browseContainer: {
    flex: 1,
    gap: 20,
  },
  categoryContainer: {
    borderRadius: 15,
    elevation: 2,
    padding: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  headerIcon: {
    marginRight: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 25,
  },
  categoryDivider: {
    height: 2,
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 15,
  },
  recommendedContainer: {
    borderRadius: 15,
    elevation: 2,
  },
  recommendedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  recommendedDivider: {
    height: 2,
    marginBottom: 15,
  },
  recommendedLists: {
    gap: 10,
  },
  allListsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  allListsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchResultsContainer: {
    flex: 1,
    gap: 10,
  },
  searchResultsText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  searchResults: {
    gap: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  paginationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  paginationButtonActive: {
    backgroundColor: "#007AFF",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
});
