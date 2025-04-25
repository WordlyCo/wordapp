import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useAppTheme } from "@/src/contexts/ThemeContext";

interface DailyProgressProps {
  wordsLearned: number;
  totalWordsGoal: number;
  practiceTime: number;
  practiceTimeGoal: number;
  isLoading: boolean;
  pulsate?: any;
}

const DailyProgress: React.FC<DailyProgressProps> = ({
  wordsLearned = 5,
  totalWordsGoal = 10,
  practiceTime = 15,
  practiceTimeGoal = 30,
  isLoading = false,
  pulsate = null,
}) => {
  const { colors } = useAppTheme();
  const wordsPracticed = wordsLearned;

  if (isLoading) {
    return <DailyProgressSkeleton pulsate={pulsate} />;
  }

  return (
    <Animated.View
      style={[styles.progressCard, { backgroundColor: colors.surfaceVariant }]}
    >
      <View style={styles.progressHeader}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={24}
          color={colors.primary}
        />
        <Text style={[styles.progressTitle, { color: colors.onSurface }]}>
          Today's Progress
        </Text>
      </View>

      <View style={styles.progressContent}>
        <View style={styles.progressItem}>
          <Text
            style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}
          >
            Words Practiced
          </Text>
          <Text style={[styles.progressValue, { color: colors.onSurface }]}>
            {wordsPracticed}/{totalWordsGoal}
          </Text>
          <ProgressBar
            progress={
              totalWordsGoal > 0
                ? Math.min(wordsPracticed / totalWordsGoal, 1)
                : 0
            }
            color={colors.primary}
            style={styles.progressBar}
          />
        </View>

        <View style={styles.progressItem}>
          <Text
            style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}
          >
            Practice Time
          </Text>
          <Text style={[styles.progressValue, { color: colors.onSurface }]}>
            {practiceTime}/{practiceTimeGoal} min
          </Text>
          <ProgressBar
            progress={
              practiceTimeGoal > 0
                ? Math.min(practiceTime / practiceTimeGoal, 1)
                : 0
            }
            color={colors.secondary}
            style={styles.progressBar}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const DailyProgressSkeleton: React.FC<{ pulsate?: any }> = ({ pulsate }) => {
  const { colors } = useAppTheme();

  return (
    <Animated.View
      style={[
        styles.progressCard,
        { backgroundColor: colors.surfaceVariant },
        pulsate,
      ]}
    >
      <View style={styles.progressContent}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={styles.progressItem}>
            <View style={styles.progressBar} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressCard: {
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressContent: {
    gap: 16,
  },
  progressItem: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default DailyProgress;
