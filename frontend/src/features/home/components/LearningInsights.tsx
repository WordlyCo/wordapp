import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

interface LearningInsightsProps {
  colors: any;
  streak: number;
  wordsMastered: number;
  accuracy: number;
  diamonds?: number;
}

const LearningInsights: React.FC<LearningInsightsProps> = ({
  colors,
  streak = 3,
  wordsMastered = 42,
  accuracy = 85,
  diamonds = 0,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(600).springify()}
      style={[styles.insightsCard, { backgroundColor: colors.surfaceVariant }]}
    >
      <View style={styles.insightsContent}>
        <InsightItem
          label="Streak"
          value={streak !== 1 ? `${streak} days` : `1 day`}
          icon="fire"
          iconColor={colors.streak || colors.tertiary}
          colors={colors}
        />

        <InsightItem
          label="Aced Words"
          value={wordsMastered.toString()}
          icon="trophy"
          iconColor={colors.secondary}
          colors={colors}
        />

        <InsightItem
          label="Diamonds"
          value={diamonds.toLocaleString()}
          icon="diamond"
          iconColor={colors.info}
          colors={colors}
        />

        <InsightItem
          label="Accuracy"
          value={`${accuracy}%`}
          icon="target"
          iconColor={colors.primary}
          colors={colors}
        />
      </View>
    </Animated.View>
  );
};

interface InsightItemProps {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  colors: any;
}

const InsightItem: React.FC<InsightItemProps> = ({
  label,
  value,
  icon,
  iconColor,
  colors,
}) => {
  return (
    <View style={styles.insightItem}>
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={iconColor || colors.primary}
          style={styles.insightIcon}
        />
      )}
      <Text style={[styles.insightLabel, { color: colors.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text style={[styles.insightValue, { color: colors.onSurface }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  insightsCard: {
    borderRadius: 16,
    padding: 16,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  insightsContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  insightItem: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    width: "25%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  insightIcon: {
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 13,
    textAlign: "center",
  },
  insightValue: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LearningInsights;
