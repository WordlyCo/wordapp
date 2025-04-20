import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Searchbar, Chip, Surface, Text, Button } from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";
import { useStore } from "@/src/stores/store";
import { WordListCard } from "@/src/components/WordListCard";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const FILTERS = [
  { id: "all", label: "All Lists" },
  { id: "favorites", label: "Favorites" },
  { id: "completed", label: "Completed" },
];

export default function BankScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userLists, fetchUserLists } = useStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollY = useSharedValue(0);
  const headerHeight = 140; // Increased height to account for filters

  useEffect(() => {
    fetchUserLists();
  }, [fetchUserLists]);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={headerAnimatedStyle}>
        <View style={styles.searchContainer}>
          <Animated.View entering={FadeInDown.duration(700).springify()}>
            <Surface
              style={[
                styles.searchSurface,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <View style={styles.searchWrapper}>
                <Searchbar
                  placeholder="Search your word lists..."
                  onChangeText={setSearchQuery}
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
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
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
          </Animated.View>
        </View>

        <View>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {FILTERS.map((filter) => (
                <Chip
                  key={filter.id}
                  selected={activeFilter === filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        activeFilter === filter.id
                          ? colors.primary
                          : colors.surfaceVariant,
                      borderColor: colors.primary,
                      borderWidth: activeFilter === filter.id ? 0 : 1,
                    },
                  ]}
                  textStyle={[
                    styles.chipText,
                    {
                      color:
                        activeFilter === filter.id
                          ? colors.onPrimary
                          : colors.primary,
                    },
                  ]}
                >
                  {filter.label}
                </Chip>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.View>

      {userLists.length > 0 ? (
        <Animated.FlatList
          data={userLists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listsContainer,
            { paddingTop: headerHeight },
          ]}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item, index }) => (
            <View>
              <Animated.View
                entering={FadeInUp.delay(200 + index * 100)
                  .duration(600)
                  .springify()}
              >
                <WordListCard
                  list={item}
                  onPress={() => {
                    router.push(`/(protected)/list/${item.id}`);
                  }}
                />
              </Animated.View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noListsContainer}>
          <Text style={styles.noListsText}>No word lists found.</Text>
          <Button
            mode="contained"
            icon="magnify"
            onPress={() => router.push("/(protected)/(tabs)/store")}
          >
            Explore Word Lists
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filtersContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    height: 36,
    borderRadius: 18,
  },
  chipText: {
    fontWeight: "600",
    fontSize: 13,
  },
  listsContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 140 + 8,
  },
  separator: {
    height: 12,
  },
  noListsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  noListsText: {
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    borderRadius: 15,
  },
});
