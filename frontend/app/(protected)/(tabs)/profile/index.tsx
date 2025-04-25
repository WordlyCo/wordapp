import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { Text, Button, IconButton, Card } from "react-native-paper";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useStore } from "@/src/stores/store";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";
import { useRouter } from "expo-router";
import { LearningInsights } from "@/src/features/home/components";
import { useUser } from "@clerk/clerk-expo";

const ProfileScreen = () => {
  const { user: clerkUser } = useUser();
  const user = useStore((state) => state.user);
  const getMe = useStore((state) => state.getMe);
  const isFetchingUser = useStore((state) => state.isFetchingUser);
  const router = useRouter();
  const { colors } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const userStats = useStore((state) => state.user?.userStats);

  useEffect(() => {
    if (!isFetchingUser) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      await getMe();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserData();
    } finally {
      setRefreshing(false);
    }
  };

  const profileBackgroundColorIndex = useStore(
    (state) => state.user?.preferences?.profileBackgroundColorIndex ?? 0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <View style={styles.cardWrapper}>
              {/* Profile Background */}
              <View
                style={[
                  styles.profileBackground,
                  {
                    backgroundColor:
                      PROFILE_BACKGROUND_COLORS[profileBackgroundColorIndex],
                  },
                ]}
              >
                <View style={styles.profileHeader}>
                  <View style={{ flex: 1 }} />
                  <IconButton
                    icon="cog"
                    size={24}
                    iconColor="white"
                    onPress={() =>
                      router.push("/(protected)/(tabs)/profile/settings")
                    }
                    style={styles.settingsButton}
                  />
                </View>
              </View>

              <View style={styles.profileCard}>
                <View
                  style={[
                    styles.avatarContainer,
                    {
                      backgroundColor: "white",
                      marginTop: -60,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: clerkUser?.imageUrl }}
                    style={styles.avatar}
                  />
                </View>

                <Text style={[styles.userName, { color: colors.onSurface }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text
                  style={[styles.userTitle, { color: colors.onSurfaceVariant }]}
                >
                  @{user?.username}
                </Text>
                <Text
                  style={[
                    styles.userLocation,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {user?.email}
                </Text>

                {/* User Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text
                      style={[styles.statNumber, { color: colors.primary }]}
                    >
                      0
                    </Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      Followers
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text
                      style={[styles.statNumber, { color: colors.primary }]}
                    >
                      0
                    </Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      Following
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                  <Button
                    mode="contained"
                    icon="pencil"
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.primary },
                    ]}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() =>
                      router.push(
                        "/(protected)/(tabs)/profile/account-settings"
                      )
                    }
                  >
                    Edit Profile
                  </Button>
                </View>
                <LearningInsights
                  streak={userStats?.streak ?? 0}
                  wordsMastered={
                    userStats?.learningInsights?.wordsMastered ?? 0
                  }
                  diamonds={userStats?.diamonds ?? 0}
                  accuracy={userStats?.learningInsights?.accuracy ?? 0}
                />
              </View>
            </View>
          </Card>
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
  },
  profileBackground: {
    height: 150,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    padding: 10,
  },
  settingsButton: {
    margin: 0,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: -40,
  },
  avatarContainer: {
    marginBottom: 15,
    borderRadius: 100,
    padding: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  actionButtonLabel: {
    color: "white",
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  contentArea: {
    width: "100%",
    minHeight: 300,
  },
  cardContainer: {
    borderRadius: 15,
  },
  cardWrapper: {
    borderRadius: 15,
    overflow: "hidden",
  },
  card: {
    paddingBottom: 10,
  },
});

export default ProfileScreen;
