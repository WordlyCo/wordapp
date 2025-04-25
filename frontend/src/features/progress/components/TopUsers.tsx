import { TopFiveUser } from "@/src/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Surface, Text } from "react-native-paper";
import Animated, { FadeInRight } from "react-native-reanimated";

export interface TopUsersProps {
  topFiveUsers: any[];
  isFetchingTopFiveUsers: boolean;
  colors: any;
}

export const TopUsers: React.FC<TopUsersProps> = ({
  topFiveUsers,
  isFetchingTopFiveUsers,
  colors,
}) => {
  if (isFetchingTopFiveUsers) {
    return (
      <View style={styles.topUsersLoadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (!topFiveUsers || topFiveUsers.length === 0) {
    return null;
  }

  return (
    <View style={styles.topUsersContainer}>
      <Text style={[styles.topUsersTitle, { color: colors.onBackground }]}>
        Top Learners
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topUsersScrollContent}
      >
        {topFiveUsers.map((user: TopFiveUser, index: number) => (
          <Animated.View
            key={user.id}
            entering={FadeInRight.delay(index * 100).springify()}
          >
            <Surface
              style={[
                styles.topUserCard,
                { backgroundColor: colors.surfaceVariant },
              ]}
              elevation={2}
            >
              <View style={styles.topUserContent}>
                {user.profilePictureUrl ? (
                  <Avatar.Image
                    size={50}
                    source={{ uri: user.profilePictureUrl }}
                    style={styles.topUserAvatar}
                  />
                ) : (
                  <Avatar.Icon
                    size={50}
                    icon="account"
                    color={colors.onSurfaceVariant}
                    style={[
                      styles.topUserAvatar,
                      { backgroundColor: colors.primaryContainer },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.topUserName,
                    { color: colors.onSurfaceVariant },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.username}
                </Text>
                <View style={styles.topUserStatsContainer}>
                  <View style={styles.topUserStat}>
                    <MaterialCommunityIcons
                      name="trophy-variant"
                      size={14}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.topUserStatText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {user.totalWordsLearned}
                    </Text>
                  </View>
                  <View style={styles.topUserStat}>
                    <MaterialCommunityIcons
                      name="timer-outline"
                      size={14}
                      color={colors.error}
                    />
                    <Text
                      style={[
                        styles.topUserStatText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {user.totalPracticeTime}m
                    </Text>
                  </View>
                  <View style={styles.topUserStat}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={14}
                      color={colors.tertiary}
                    />
                    <Text
                      style={[
                        styles.topUserStatText,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {user.totalStreak}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topUsersContainer: {
    marginBottom: 8,
  },
  topUsersLoadingContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  topUsersTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 16,
  },
  topUsersScrollContent: {
    paddingVertical: 8,
    gap: 16,
    marginLeft: 16,
  },
  topUserCard: {
    borderRadius: 16,
    width: 120,
    height: 140,
    marginRight: 12,
  },
  topUserContent: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  topUserAvatar: {
    marginBottom: 8,
  },
  topUserName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    width: "100%",
  },
  topUserStatsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  topUserStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  topUserStatText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
