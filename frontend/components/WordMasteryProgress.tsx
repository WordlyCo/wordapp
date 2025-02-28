import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar, IconButton } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import { useStore } from "@/stores/store";

type WordMasteryProgressProps = {
  word: string;
};

const LevelDots = ({
  level,
  maxLevel,
  color,
}: {
  level: number;
  maxLevel: number;
  color: string;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.dotsContainer}>
      {[...Array(maxLevel)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index < level ? color : colors.surfaceDisabled,
              borderColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const WordMasteryProgress: React.FC<WordMasteryProgressProps> = () => {
  const { colors } = useTheme();
  const masteryScore = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: colors.onSurface }}>
          Mastery Progress
        </Text>
        <Text variant="titleMedium" style={{ color: colors.onSurface }}>
          {masteryScore}%
        </Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View style={styles.progressLabel}>
            <IconButton
              icon="brain"
              size={20}
              iconColor={colors.primary}
              style={styles.progressIcon}
            />
            <Text variant="bodyMedium">Recognition</Text>
          </View>
          <LevelDots level={0} maxLevel={5} color={colors.primary} />
        </View>
        <ProgressBar
          progress={0 / 5}
          color={colors.primary}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View style={styles.progressLabel}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={colors.secondary}
              style={styles.progressIcon}
            />
            <Text variant="bodyMedium">Usage</Text>
          </View>
          <LevelDots level={0} maxLevel={5} color={colors.secondary} />
        </View>
        <ProgressBar
          progress={0 / 5}
          color={colors.secondary}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.stats}>
        <Text variant="bodySmall" style={styles.statText}>
          Practiced {0} times
        </Text>
        <Text variant="bodySmall" style={styles.statText}>
          Success Rate: {((0 / 0) * 100).toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressSection: {
    gap: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressIcon: {
    margin: 0,
    marginRight: -4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statText: {
    opacity: 0.7,
  },
});

export default WordMasteryProgress;
