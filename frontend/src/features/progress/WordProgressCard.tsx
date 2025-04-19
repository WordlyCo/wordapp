import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, Card, ProgressBar } from "react-native-paper";
import * as Speech from "expo-speech";
import Animated, { FadeInRight } from "react-native-reanimated";
import { getPartOfSpeechColor, getColorWithOpacity } from "@/lib/utils";
export interface WordProgressCardProps {
  item: any;
  index: number;
  colors: any;
}

export const WordProgressCard: React.FC<WordProgressCardProps> = ({
  item,
  index,
  colors,
}) => {
  const [expanded, setExpanded] = useState(true);

  const difficultyColor = (level: string) => {
    switch (level) {
      case "basic":
        return colors.success;
      case "intermediate":
        return colors.warning;
      case "advanced":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const handlePronounce = () => {
    Speech.speak(item.word, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const posColor = getPartOfSpeechColor(item.partOfSpeech, colors.primary);
  const recognitionMastery = item.wordProgress?.recognitionMasteryScore || 0;
  const usageMastery = item.wordProgress?.usageMasteryScore || 0;
  const diffColor = difficultyColor(item.difficultyLevel);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={styles.cardContainer}
    >
      <View style={styles.cardWrapper}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpanded(!expanded)}
            style={styles.cardContent}
          >
            <View style={styles.headerRow}>
              <View style={styles.wordSection}>
                <View style={styles.wordRow}>
                  <Text
                    variant="titleMedium"
                    style={[styles.wordText, { color: colors.onSurface }]}
                  >
                    {item.word}
                  </Text>
                  <TouchableOpacity
                    onPress={handlePronounce}
                    style={styles.pronounceButton}
                  >
                    <MaterialCommunityIcons
                      name="volume-high"
                      size={18}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.posContainer}>
                  <View
                    style={[
                      styles.posTag,
                      { backgroundColor: getColorWithOpacity(posColor, 20) },
                    ]}
                  >
                    <Text style={[styles.posText, { color: posColor }]}>
                      {item.partOfSpeech}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyTag,
                      { backgroundColor: getColorWithOpacity(diffColor, 20) },
                    ]}
                  >
                    <Text style={[styles.posText, { color: "#f3f3f3" }]}>
                      {item.difficultyLevel}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.masterySection}>
                <View style={styles.masteryRow}>
                  <Text
                    style={[
                      styles.masteryLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Recognition
                  </Text>
                  <Text
                    style={[styles.masteryValue, { color: colors.primary }]}
                  >
                    {recognitionMastery}/10
                  </Text>
                </View>
                <ProgressBar
                  progress={recognitionMastery / 10}
                  color={colors.primary}
                  style={styles.progressBar}
                />

                <View style={styles.masteryRow}>
                  <Text
                    style={[
                      styles.masteryLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Usage
                  </Text>
                  <Text
                    style={[styles.masteryValue, { color: colors.tertiary }]}
                  >
                    {usageMastery}/10
                  </Text>
                </View>
                <ProgressBar
                  progress={usageMastery / 10}
                  color={colors.tertiary}
                  style={styles.progressBar}
                />
              </View>
            </View>

            {expanded && (
              <View style={styles.expandedContent}>
                <Text
                  style={[
                    styles.definitionLabel,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  Definition:
                </Text>
                <Text
                  style={[styles.definitionText, { color: colors.onSurface }]}
                >
                  {item.definition}
                </Text>

                {item.example && (
                  <>
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
                      {item.example}
                    </Text>
                  </>
                )}

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="eye"
                      size={16}
                      color={colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.statText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {item.wordProgress?.practiceCount || 0} practices
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={16}
                      color={colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.statText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {item.wordProgress?.numberOfTimesToPractice || 0}{" "}
                      remaining
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={16}
                      color={colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.statText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {new Date(
                        item.wordProgress?.updatedAt
                      ).toLocaleDateString() || "Never"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Card>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
  },
  cardWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wordSection: {
    flex: 1,
    justifyContent: "center",
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordText: {
    fontWeight: "bold",
  },
  pronounceButton: {
    marginLeft: 4,
    padding: 4,
  },
  posContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  posTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  difficultyTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  posText: {
    fontSize: 12,
    fontWeight: "500",
  },
  masterySection: {
    width: "45%",
  },
  masteryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  masteryLabel: {
    fontSize: 12,
  },
  masteryValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginVertical: 4,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  definitionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  definitionText: {
    fontSize: 14,
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
