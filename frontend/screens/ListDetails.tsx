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
import { RouteProp, useRoute } from "@react-navigation/native";
import StickyHeader from "@/components/StickyHeader";
import useTheme from "@/hooks/useTheme";
import { Word } from "@/types/words";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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

const ListDetails = () => {
  const route = useRoute();
  const { listId } = route.params as { listId: string };
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
    fetchList(listId);
  }, [fetchList, listId]);

  const difficultyColor = getDifficultyColor(
    selectedList?.difficultyLevel || "",
    colors
  );
  const categoryIcon = getCategoryIcon(selectedList?.imageUrl || "");

  if (isFetchingList) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
              style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}
              textStyle={{ color: difficultyColor }}
            >
              {selectedList?.difficultyLevel.toLowerCase()}
            </Chip>
            <Chip
              icon="book-open-page-variant"
              style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}
              textStyle={{ color: colors.secondary }}
            >
              {selectedList?.words.length} words
            </Chip>
            <Chip
              icon="tag"
              style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}
              textStyle={{ color: colors.primary }}
            >
              {selectedList?.categoryId}
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
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              icon="plus"
              onPress={() => console.log("Add to my lists")}
            >
              Add to My Lists
            </Button>
            <Button
              mode="outlined"
              style={[styles.actionButton, { borderColor: colors.outline }]}
              textColor={colors.onSurface}
              icon="play"
              onPress={() => console.log("Practice")}
            >
              Practice
            </Button>
          </View>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        {/* Words Section */}
        <View style={styles.wordsSection}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Words in This List
          </Text>

          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search words..."
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

          <View style={styles.wordsList}>
            {selectedList?.words.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <MaterialCommunityIcons
                  name="file-search-outline"
                  size={50}
                  color={colors.outlineVariant}
                  style={styles.emptyStateIcon}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  No words found
                </Text>
              </View>
            ) : (
              selectedList?.words.map((word, index) => (
                <Card
                  key={word.id}
                  style={[styles.wordCard, { backgroundColor: colors.surface }]}
                  mode="outlined"
                  contentStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
                >
                  <Card.Content style={styles.wordCardContent}>
                    <View style={styles.wordHeader}>
                      <View style={styles.wordTitleContainer}>
                        <Text
                          style={[styles.wordText, { color: colors.primary }]}
                        >
                          {word.word}
                        </Text>
                        <Chip
                          style={[
                            styles.partOfSpeechChip,
                            { backgroundColor: colors.surfaceVariant },
                          ]}
                          textStyle={{
                            color: colors.secondary,
                            fontSize: 12,
                            lineHeight: 16,
                          }}
                        >
                          {word.partOfSpeech.toLowerCase()}
                        </Chip>
                      </View>
                      <View style={styles.wordActions}>
                        <IconButton
                          icon="stairs"
                          iconColor={getDifficultyColor(
                            word.difficultyLevel,
                            colors
                          )}
                          size={22}
                          style={styles.difficultyIcon}
                          onPress={() =>
                            console.log(`Difficulty: ${word.difficultyLevel}`)
                          }
                        />
                        <IconButton
                          icon="volume-high"
                          iconColor={colors.secondary}
                          size={20}
                          onPress={() => pronounceWord(word.word)}
                        />
                      </View>
                    </View>

                    <Text
                      style={[styles.definition, { color: colors.onSurface }]}
                    >
                      {word.definition}
                    </Text>

                    {word.examples && word.examples.length > 0 && (
                      <View style={styles.exampleContainer}>
                        <Text
                          style={[
                            styles.exampleLabel,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          Example:
                        </Text>
                        <Text
                          style={[
                            styles.exampleText,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          "{word.examples[0]}"
                        </Text>
                      </View>
                    )}

                    {word.synonyms && word.synonyms.length > 0 && (
                      <View style={styles.synonymContainer}>
                        <Text
                          style={[
                            styles.synonymLabel,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          Synonyms:
                        </Text>
                        <View style={styles.wordTags}>
                          {word.synonyms.slice(0, 3).map((synonym, idx) => (
                            <Chip
                              key={idx}
                              style={[
                                styles.tagChip,
                                { backgroundColor: colors.surfaceVariant },
                              ]}
                              textStyle={{
                                color: colors.onSurfaceVariant,
                                fontSize: 11,
                                lineHeight: 14,
                              }}
                            >
                              {synonym}
                            </Chip>
                          ))}
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSection: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  listImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  wordsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 12,
    elevation: 0,
  },
  wordsList: {
    gap: 12,
  },
  wordCard: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 2,
    overflow: "visible",
  },
  wordCardContent: {
    paddingVertical: 16,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  wordTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
    gap: 8,
    marginRight: 8,
  },
  wordActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyIcon: {
    margin: 0,
    padding: 0,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  partOfSpeechChip: {
    height: 28,
    marginVertical: 2,
    paddingVertical: 2,
  },
  definition: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  exampleContainer: {
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  wordTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 6,
    paddingBottom: 4,
  },
  tagChip: {
    height: 28,
    marginVertical: 2,
    paddingVertical: 2,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  synonymContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  synonymLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ListDetails;
