import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useAppTheme } from "@/src/contexts/ThemeContext";

interface LearningInsightsProps {
  streak: number;
  wordsMastered: number;
  accuracy: number;
  diamonds?: number;
  isLoading?: boolean;
  pulsate?: any;
}

const LearningInsights: React.FC<LearningInsightsProps> = ({
  streak = 3,
  wordsMastered = 42,
  accuracy = 85,
  diamonds = 0,
  isLoading = false,
  pulsate = null,
}) => {
  const { colors } = useAppTheme();

  if (isLoading) {
    return <InsightsSkeleton pulsate={pulsate} />;
  }

  return (
    <Animated.View
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
    alignItems: "center",
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

const InsightsSkeleton: React.FC<{ pulsate?: any }> = ({ pulsate }) => {
  const { colors } = useAppTheme();

  return (
    <Animated.View
      style={[
        styles.insightsCard,
        { backgroundColor: colors.surfaceVariant },
        pulsate,
      ]}
    >
      <View style={styles.insightsContent}>
        {[...Array(4)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              {
                width: (Dimensions.get("window").width - 32) / 4 - 8,
                height: 65,
                borderRadius: 8,
                marginBottom: 8,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

export default LearningInsights;
