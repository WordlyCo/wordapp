import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";

type Level = {
  level: number;
  minPoints: number;
  title: string;
};

const levels: Level[] = [
  { level: 1, minPoints: 0, title: "Beginner" },
  { level: 2, minPoints: 500, title: "Intermediate" },
  { level: 3, minPoints: 1000, title: "Advanced" },
  { level: 4, minPoints: 1500, title: "Expert" },
  { level: 5, minPoints: 2000, title: "Master" },
];

type Props = {
  points: number;
};

const LevelProgress = ({ points }: Props) => {
  const { colors } = useTheme();
  const currentLevel =
    levels.findLast((level) => points >= level.minPoints) || levels[0];
  const nextLevel = levels.find((level) => points < level.minPoints);

  const progress = nextLevel
    ? (points - currentLevel.minPoints) /
      (nextLevel.minPoints - currentLevel.minPoints)
    : 1;

  return (
    <Card style={styles.levelCard}>
      <Card.Content>
        <View style={styles.levelHeader}>
          <View>
            <Text variant="titleMedium" style={{ color: colors.primary }}>
              Level {currentLevel.level}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              {currentLevel.title}
            </Text>
          </View>
          {nextLevel && (
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              {nextLevel.minPoints - points} points to Level {nextLevel.level}
            </Text>
          )}
        </View>
        <ProgressBar
          progress={progress}
          color={colors.primary}
          style={styles.progressBar}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default LevelProgress;
