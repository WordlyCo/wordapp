import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Avatar, Text, Divider, Searchbar } from "react-native-paper";
import StickyHeader from "@/components/StickyHeader";
import useTheme from "@/hooks/useTheme";
import CategoryItem from "@/components/CategoryItem";
import { useStore } from "@/stores/store";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WordListCard } from "@/components/WordListCard";
import { wordLists } from "@/stores/mockData";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export type HomeStackParamList = {
  HomeMain: undefined;
  WordLists: { categoryId: string };
  ListDetails: { listId: string };
};

export type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList>;

type ViewMode = "browse" | "search";

const StoreTab = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const { categories, fetchCategories, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const searchFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get random word lists for "You might like" section
  const getRandomWordLists = (count: number = 3) => {
    const shuffled = [...wordLists].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Filter word lists based on search query
  const filteredLists = wordLists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0 && viewMode !== "search") {
      switchToSearchMode();
    } else if (text.length === 0 && viewMode === "search") {
      switchToBrowseMode();
    }
  };

  const switchToSearchMode = () => {
    // Set view mode first to immediately enable touch events
    setViewMode("search");

    // Then run the animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200, // Slightly faster for better responsiveness
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 1,
        duration: 200, // Slightly faster for better responsiveness
        useNativeDriver: true,
      }),
    ]).start();
  };

  const switchToBrowseMode = () => {
    // Set view mode first to immediately enable touch events
    setViewMode("browse");

    // Then run the animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200, // Slightly faster for better responsiveness
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 200, // Slightly faster for better responsiveness
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <View style={styles.container}>
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

          {/* Main content that switches between browse and search */}
          <View style={styles.contentContainer}>
            {/* Browse View - Categories and Recommended */}
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
              {/* Categories Section */}
              <View style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <Avatar.Icon
                    size={36}
                    icon="shape"
                    style={[
                      styles.headerIcon,
                      { backgroundColor: colors.primary },
                    ]}
                    color={colors.onSurface}
                  />
                  <Text style={styles.heading}>Categories</Text>
                </View>
                <Divider
                  style={[
                    styles.categoryDivider,
                    { backgroundColor: colors.primary },
                  ]}
                />

                <View style={styles.categoriesGrid}>
                  {categories.map((item) => (
                    <CategoryItem
                      onPress={() =>
                        navigation.navigate("WordLists", {
                          categoryId: item.id,
                        })
                      }
                      key={item.id}
                      item={item}
                    />
                  ))}
                </View>
              </View>

              {/* You might like section */}
              <View style={styles.recommendedContainer}>
                <View style={styles.recommendedHeader}>
                  <Avatar.Icon
                    size={36}
                    icon="star"
                    style={[
                      styles.headerIcon,
                      { backgroundColor: colors.tertiary },
                    ]}
                    color={colors.onSurface}
                  />
                  <Text style={styles.heading}>You might like</Text>
                </View>
                <Divider
                  style={[
                    styles.categoryDivider,
                    { backgroundColor: colors.tertiary },
                  ]}
                />
                <View style={styles.recommendedLists}>
                  {getRandomWordLists().map((list) => (
                    <WordListCard
                      key={list.id}
                      list={list}
                      onPress={() =>
                        navigation.navigate("ListDetails", { listId: list.id })
                      }
                    />
                  ))}
                </View>
              </View>
            </Animated.View>

            {/* Search Results View */}
            <Animated.View
              style={[
                styles.searchResultsContainer,
                {
                  opacity: searchFadeAnim,
                  position: viewMode === "search" ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: viewMode === "search" ? 1 : 0,
                },
              ]}
              pointerEvents={viewMode === "search" ? "auto" : "none"}
            >
              {filteredLists.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <MaterialCommunityIcons
                    name="file-search-outline"
                    size={64}
                    color={colors.onSurfaceVariant}
                    style={styles.noResultsIcon}
                  />
                  <Text style={styles.noResults}>No word lists found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try searching for different keywords
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.searchResultsTitle}>
                    Search Results ({filteredLists.length})
                  </Text>
                  <View style={styles.searchResults}>
                    {filteredLists.map((list) => (
                      <WordListCard
                        key={list.id}
                        list={list}
                        onPress={() => {
                          console.log("Navigating to list:", list.id);
                          navigation.navigate("ListDetails", {
                            listId: list.id,
                          });
                        }}
                      />
                    ))}
                  </View>
                </>
              )}
            </Animated.View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default StoreTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  searchBarContainer: {
    marginBottom: 15,
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
    borderRadius: 12,
  },
  contentContainer: {
    position: "relative",
  },
  browseContainer: {
    width: "100%",
  },
  searchResultsContainer: {
    width: "100%",
  },
  searchResults: {
    gap: 12,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResults: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noResultsSubtext: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.7,
  },
  categoryContainer: {
    borderRadius: 15,
    elevation: 2,
    marginTop: 15,
    padding: 15,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  headerIcon: {
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  categoryDivider: {
    marginTop: 10,
    marginBottom: 20,
    height: 2,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  recommendedContainer: {
    borderRadius: 15,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
  },
  recommendedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  recommendedLists: {
    gap: 12,
    paddingTop: 10,
  },
  practiceCardContainer: {
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    marginTop: 15,
  },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  divider: {
    marginVertical: 10,
    height: 2,
  },
  practiceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  practiceButton: {
    marginTop: 10,
  },
});
