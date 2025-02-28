import React from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { MaterialCommunityIcons as IconType } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

type Props = {
  icon: keyof typeof IconType.glyphMap;
  value: number | string;
  label: string;
  color: string;
};

const StatCard = ({ icon, value, label, color }: Props) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.statCard} mode="elevated" elevation={2}>
      <Card.Content
        style={[
          styles.statCardContent,
          { backgroundColor: colors.surfaceVariant },
        ]}
      >
        <View style={styles.statIconContainer}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
          <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
            {label}
          </Text>
        </View>
        <Text variant="headlineMedium" style={{ color }}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  statCard: {
    width: "100%",
    borderRadius: 12,
  },
  statCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  statIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

export default StatCard;
