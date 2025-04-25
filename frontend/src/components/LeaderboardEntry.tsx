import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, Avatar } from "react-native-paper";
import { useAppTheme } from "@/src/contexts/ThemeContext";

type Props = {
  entry: {
    id: string;
    name: string;
    points: number;
    isCurrentUser?: boolean;
  };
  rank: number;
};

const LeaderboardEntry = ({ entry, rank }: Props) => {
  const { colors } = useAppTheme();

  return (
    <Surface
      style={[
        styles.leaderboardEntry,
        entry.isCurrentUser && {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.primary,
          borderWidth: 1,
        },
      ]}
      elevation={1}
    >
      <View style={styles.rankContainer}>
        <Text
          variant="titleMedium"
          style={[
            styles.rank,
            { color: entry.isCurrentUser ? colors.primary : colors.onSurface },
          ]}
        >
          #{rank}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Avatar.Text
          size={36}
          label={entry.name[0]}
          color={colors.onSurface}
          style={{
            backgroundColor: entry.isCurrentUser
              ? colors.primary + "20"
              : colors.surfaceVariant,
          }}
        />
        <Text
          variant="titleMedium"
          style={[
            styles.userName,
            { color: entry.isCurrentUser ? colors.primary : colors.onSurface },
          ]}
        >
          {entry.name}
        </Text>
      </View>

      <Text
        variant="titleMedium"
        style={[
          styles.points,
          { color: entry.isCurrentUser ? colors.primary : colors.onSurface },
        ]}
      >
        {entry.points}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  leaderboardEntry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  rankContainer: {
    width: 40,
  },
  rank: {
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userName: {
    fontWeight: "500",
  },
  points: {
    fontWeight: "bold",
  },
});

export default LeaderboardEntry;
