import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Searchbar, FAB } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/src/hooks/useTheme";
import StickyHeader from "@/src/components/StickyHeader";
import { WordList } from "@/stores/types";
import { wordLists } from "@/stores/mockData";
import { WordListCard } from "@/src/components/WordListCard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type WordListStackParamList = {
  CategoryList: undefined;
  ListDetails: { listId: string };
};

type Props = {
  navigation: StackNavigationProp<WordListStackParamList>;
};

const Bank = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLists] = useState<WordList[]>(wordLists);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const filteredLists = userLists.filter(
    (list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
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

          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.onSurface, borderColor: colors.primary },
              ]}
            >
              Your Word Bank
            </Text>
          </View>

          <View style={styles.listsContainer}>
            {filteredLists.length === 0 ? (
              <View style={styles.emptyState}>
                <Text>No word lists found</Text>
              </View>
            ) : (
              filteredLists.map((list) => (
                <WordListCard
                  key={list.id}
                  list={list}
                  onPress={() =>
                    navigation.navigate("ListDetails", { listId: list.id })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        <FAB.Group
          open={isFabOpen}
          visible
          icon={isFabOpen ? "close" : "plus"}
          actions={[
            {
              icon: "filter-variant",
              label: "Filters",
              onPress: () => console.log("Show filters"),
              labelStyle: { backgroundColor: colors.surface },
              style: { backgroundColor: colors.surface },
            },
            {
              icon: "playlist-plus",
              label: "Add List",
              onPress: () => navigation.navigate("CategoryList"),
              labelStyle: { backgroundColor: colors.surface },
              style: { backgroundColor: colors.surface },
            },
          ]}
          onStateChange={({ open }) => setIsFabOpen(open)}
          onPress={() => setIsFabOpen(!isFabOpen)}
          fabStyle={{ backgroundColor: colors.primary }}
          style={{ paddingBottom: 5 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 12,
    elevation: 0,
  },
  scrollViewContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  listsContainer: {
    gap: 15,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
});

export default Bank;
