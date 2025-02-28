import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Searchbar, FAB, Chip } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/hooks/useTheme";
import StickyHeader from "@/components/StickyHeader";
import { WordList } from "@/stores/types";
import { wordLists } from "@/stores/mockData";
import { WordListCard } from "@/components/WordListCard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DIFFICULTY_LEVELS } from "@/stores/enums";

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string, colors: any) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return colors.difficulty.beginner;
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return colors.difficulty.intermediate;
    case DIFFICULTY_LEVELS.ADVANCED:
      return colors.difficulty.advanced;
    default:
      return colors.difficulty.default;
  }
};

// Helper function to get appropriate icon for category
const getCategoryIcon = (
  category: string
): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (category.toLowerCase()) {
    case "education":
      return "school";
    case "business":
      return "briefcase";
    case "medical":
      return "medical-bag";
    case "technology":
      return "laptop";
    case "literature":
      return "book-open-page-variant";
    case "legal":
      return "scale-balance";
    case "general":
      return "comment-text-outline";
    case "academic":
      return "school";
    case "creative":
      return "brush";
    default:
      return "book-open-variant";
  }
};

// MetadataItem component
const MetadataItem = ({
  icon,
  color,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  text: string;
}) => (
  <View style={styles.metadataItem}>
    <MaterialCommunityIcons name={icon} size={16} color={color} />
    <Text style={[styles.metadataText, { color }]}>{text}</Text>
  </View>
);

type WordListStackParamList = {
  CategoryList: undefined;
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <Searchbar
            placeholder="Search word lists..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { borderColor: colors.outline }]}
          />

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
                  onPress={() => navigation.navigate("CategoryList")}
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
  searchBar: {
    marginBottom: 15,
    elevation: 0,
    borderWidth: 1,
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
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
});

export default Bank;
