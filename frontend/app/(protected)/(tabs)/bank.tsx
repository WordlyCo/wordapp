import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, Searchbar, Chip, Card, Button } from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";
import StickyHeader from "@/src/components/StickyHeader";
import { useStore } from "@/stores/store";
import { wordLists } from "@/stores/mockData";

// Define filter options
const FILTERS = [
  { id: "all", label: "All Lists" },
  { id: "favorites", label: "Favorites" },
  { id: "custom", label: "My Lists" },
  { id: "completed", label: "Completed" },
];

export default function BankScreen() {
  // const router = useRouter();
  const { colors } = useTheme();
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeFilter, setActiveFilter] = useState("all");

  // // Get user's saved lists
  // const { savedLists } = useStore();

  // // Combine with some sample lists for the demo
  // const myLists = [...savedLists, ...wordLists.slice(0, 3)].map((list) => ({
  //   ...list,
  //   isFavorite: Math.random() > 0.5,
  //   isCompleted: Math.random() > 0.7,
  // }));

  // // Filter lists based on search query and active filter
  // const filteredLists = myLists.filter((list) => {
  //   // First check search query
  //   const matchesSearch =
  //     list.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     list.categoryId?.toLowerCase().includes(searchQuery.toLowerCase());

  //   // Then check active filter
  //   let matchesFilter = true;
  //   if (activeFilter === "favorites") {
  //     matchesFilter = list.isFavorite;
  //   } else if (activeFilter === "completed") {
  //     matchesFilter = list.isCompleted;
  //   } else if (activeFilter === "custom") {
  //     matchesFilter = savedLists.some((saved) => saved.id === list.id);
  //   }

  //   return matchesSearch && matchesFilter;
  // });

  // const handleToggleFavorite = (listId: string) => {
  //   // This would update the store in a real app
  //   console.log(`Toggle favorite for list: ${listId}`);
  // };

  // // Helper function for navigation with proper route types
  // const navigateTo = (path: string) => {
  //   try {
  //     router.push(path as any);
  //   } catch (error) {
  //     console.error("Navigation error:", error);
  //   }
  // };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <StickyHeader />

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search your word lists..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[
              styles.searchBar,
              { backgroundColor: colors.surface, borderColor: colors.outline },
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
                <TouchableOpacity onPress={() => setSearchQuery("")}>
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
                activeFilter === filter.id && {
                  backgroundColor: colors.primary,
                },
              ]}
              textStyle={[
                styles.chipText,
                activeFilter === filter.id && { color: colors.onPrimary },
              ]}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <Text style={styles.resultsCount}>
            {filteredLists.length}{" "}
            {filteredLists.length === 1 ? "list" : "lists"} found
          </Text>
          <Button
            mode="contained"
            compact
            icon="plus"
            onPress={() => console.log("Create new list")}
            style={[styles.createButton, { backgroundColor: colors.primary }]}
          >
            Create List
          </Button>
        </View>

        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listsContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Card
              style={[styles.listCard, { backgroundColor: colors.surface }]}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name="book-open-variant"
                    size={24}
                    color={colors.primary}
                    style={styles.cardIcon}
                  />
                  <View style={styles.cardTitleContainer}>
                    <Text
                      style={[styles.cardTitle, { color: colors.onSurface }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.cardCategory,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {item.categoryId}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleFavorite(item.id)}
                  >
                    <MaterialCommunityIcons
                      name={item.isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={
                        item.isFavorite ? colors.error : colors.onSurfaceVariant
                      }
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {item.description?.substring(0, 80)}
                  {(item.description?.length || 0) > 80 ? "..." : ""}
                </Text>

                <View style={styles.cardFooter}>
                  <Chip
                    style={[
                      styles.smallChip,
                      { backgroundColor: colors.surfaceVariant },
                    ]}
                    textStyle={{ fontSize: 12 }}
                  >
                    {item.words?.length || 0} words
                  </Chip>

                  <TouchableOpacity
                    style={[
                      styles.viewButton,
                      { backgroundColor: colors.primaryContainer },
                    ]}
                    onPress={() => navigateTo(`/(app)/store/lists/${item.id}`)}
                  >
                    <Text
                      style={[
                        styles.viewButtonText,
                        { color: colors.onPrimaryContainer },
                      ]}
                    >
                      View
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colors.onPrimaryContainer}
                    />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          )}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
  },
  filtersContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  chipText: {
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontStyle: "italic",
  },
  createButton: {
    borderRadius: 20,
  },
  listsContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  listCard: {
    borderRadius: 10,
  },
  cardContent: {
    padding: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardCategory: {
    fontSize: 12,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallChip: {
    height: 24,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
});
