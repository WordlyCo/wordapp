import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Text,
  Chip,
  Divider,
  Card,
  Searchbar,
  Button,
  IconButton,
} from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import StickyHeader from "@/src/components/StickyHeader";
import useTheme from "@/src/hooks/useTheme";
import { Word } from "@/types/words";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DIFFICULTY_LEVELS } from "@/types/enums";
import * as Speech from "expo-speech";
import { useStore } from "@/stores/store";

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

const getSpacing = (hasImage: boolean) => {
  return {
    descriptionMargin: hasImage ? 20 : 10,
    actionsMargin: hasImage ? 0 : 10,
  };
};

export default function ListDetailsScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedList, fetchList, isFetchingList } = useStore();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const pronounceWord = (word: string) => {
    Speech.speak(word, {
      language: "en",
      voice: "Samantha",
      pitch: 1.3,
      rate: 1,
      volume: 1,
    });
  };

  useEffect(() => {
    if (listId) {
      fetchList(listId);
    }
  }, [fetchList, listId]);

  const difficultyColor = getDifficultyColor(
    selectedList?.difficultyLevel || "",
    colors
  );
  const categoryIcon = getCategoryIcon(selectedList?.imageUrl || "");

  if (!listId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>No list ID provided</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isFetchingList ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <StickyHeader />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Word List Header */}
            <View style={styles.headerSection}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons
                  name={categoryIcon}
                  size={32}
                  color={colors.primary}
                  style={styles.headerIcon}
                />
                <Text style={[styles.title, { color: colors.onSurface }]}>
                  {selectedList?.name}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <Chip
                  icon="stairs"
                  style={[
                    styles.chip,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                  textStyle={{ color: difficultyColor }}
                >
                  {selectedList?.difficultyLevel.toLowerCase()}
                </Chip>
                <Chip
                  icon="book-open-page-variant"
                  style={[
                    styles.chip,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                  textStyle={{ color: colors.secondary }}
                >
                  {selectedList?.words.length} words
                </Chip>
                <Chip
                  icon="tag"
                  style={[
                    styles.chip,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                  textStyle={{ color: colors.primary }}
                >
                  {selectedList?.categories.join(", ")}
                </Chip>
              </View>

              <Text
                style={[
                  styles.description,
                  {
                    color: colors.onSurfaceVariant,
                    marginBottom: getSpacing(Boolean(selectedList?.imageUrl))
                      .descriptionMargin,
                  },
                ]}
              >
                {selectedList?.description}
              </Text>

              {selectedList?.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedList?.imageUrl }}
                    style={styles.listImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              <View
                style={[
                  styles.actionButtons,
                  {
                    marginTop: getSpacing(Boolean(selectedList?.imageUrl))
                      .actionsMargin,
                  },
                ]}
              >
                <Button
                  mode="contained"
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  icon="plus"
                  onPress={() => console.log("Add to my lists")}
                >
                  Add to My Lists
                </Button>

                <Button
                  mode="outlined"
                  style={[
                    styles.actionButton,
                    { borderColor: colors.primary, marginTop: 10 },
                  ]}
                  icon="play"
                  onPress={() => console.log("Start learning")}
                >
                  Start Learning
                </Button>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Words Search */}
            <View style={styles.searchContainer}>
              <Searchbar
                placeholder="Search words in this list..."
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

            {/* Words List */}
            <View style={styles.wordsListContainer}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Words in This List
              </Text>

              {selectedList?.words
                .filter((word) =>
                  word.word.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((word, index) => (
                  <Card
                    key={word.id || index}
                    style={[
                      styles.wordCard,
                      {
                        backgroundColor: colors.surface,
                        borderLeftColor: colors.primary,
                      },
                    ]}
                    elevation={2}
                  >
                    <Card.Content style={styles.wordCardContent}>
                      <View style={styles.wordHeader}>
                        <View style={styles.wordTitleContainer}>
                          <Text
                            style={[styles.wordTerm, { color: colors.primary }]}
                          >
                            {word.word}
                          </Text>
                          <View
                            style={[
                              styles.wordTypeBadge,
                              { backgroundColor: colors.primary },
                            ]}
                          >
                            <Text
                              style={[
                                styles.wordType,
                                { color: colors.background },
                              ]}
                            >
                              {word.partOfSpeech}
                            </Text>
                          </View>
                        </View>
                        <IconButton
                          icon="volume-high"
                          size={22}
                          iconColor={colors.primary}
                          onPress={() => pronounceWord(word.word)}
                          style={[
                            styles.pronounceButton,
                            { backgroundColor: colors.surfaceVariant + "40" },
                          ]}
                        />
                      </View>

                      <View
                        style={[
                          styles.definitionContainer,
                          { backgroundColor: colors.surfaceVariant + "15" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.wordDefinition,
                            { color: colors.onSurface },
                          ]}
                        >
                          {word.definition}
                        </Text>
                      </View>

                      {word.examples.length > 0 && (
                        <View
                          style={[
                            styles.examplesContainer,
                            { backgroundColor: colors.surfaceVariant + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.examplesTitle,
                              { color: colors.onSurfaceVariant },
                            ]}
                          >
                            Examples:
                          </Text>
                          {word.examples.map((example, index) => (
                            <View key={index} style={styles.exampleItem}>
                              <MaterialCommunityIcons
                                name="minus"
                                size={14}
                                color={colors.primary}
                                style={styles.exampleBullet}
                              />
                              <Text
                                style={[
                                  styles.exampleText,
                                  { color: colors.onSurfaceVariant },
                                ]}
                              >
                                {example}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </Card.Content>
                  </Card>
                ))}
            </View>
          </ScrollView>
        </>
      )}
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
    maxWidth: "70%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  chip: {
    height: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 20,
  },
  listImage: {
    width: "100%",
    height: "100%",
  },
  actionButtons: {
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
  },
  divider: {
    marginVertical: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
  },
  wordsListContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  wordCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderLeftWidth: 4,
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
  },
  wordTerm: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 12,
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
  wordDefinition: {
    fontSize: 15,
    lineHeight: 22,
  },
  wordExample: {
    fontSize: 14,
    lineHeight: 20,
  },
  examplesContainer: {
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  examplesTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  exampleBullet: {
    marginTop: 3,
    marginRight: 8,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
