import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Text, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useTheme from "@/src/hooks/useTheme";
import StickyHeader from "@/src/components/StickyHeader";
import { useStore } from "@/src/stores/store";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";

// Import local headshot image
const headshotImage = require("@/assets/images/headshot.png");

type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  AccountSettings: undefined;
};

const ProfileScreen = () => {
  const user = useStore((state) => state.user);
  const getMe = useStore((state) => state.getMe);
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("Stats");
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileBackgroundColorIndex = useStore(
    (state) => state.preferences?.profileBackgroundColorIndex ?? 0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                router.push("/(protected)/(tabs)/profile/Settings")
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
                backgroundColor: colors.primaryContainer,
                marginTop: -60,
              },
            ]}
          >
            <Image source={headshotImage} style={styles.avatar} />
          </View>

          <Text style={[styles.userName, { color: colors.onSurface }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userTitle, { color: colors.onSurfaceVariant }]}>
            @{user?.username}
          </Text>
          <Text
            style={[styles.userLocation, { color: colors.onSurfaceVariant }]}
          >
            {user?.email}
          </Text>

          {/* User Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                0
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                Followers
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                0
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                Following
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.actionButtonLabel}
              onPress={() =>
                router.push("/(protected)/(tabs)/profile/AccountSettings")
              }
            >
              Edit Profile
            </Button>
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.actionButtonLabel}
            >
              Add Friends
            </Button>
          </View>

          {/* Tab Selection */}
          <View
            style={[styles.tabContainer, { borderBottomColor: colors.outline }]}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "Stats" && styles.activeTab,
                activeTab === "Stats" && { borderBottomColor: colors.primary },
              ]}
              onPress={() => setActiveTab("Stats")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.onSurfaceVariant },
                  activeTab === "Stats" && styles.activeTabText,
                  activeTab === "Stats" && { color: colors.primary },
                ]}
              >
                Stats
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {/* Content will be added here */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileBackground: {
    height: 150,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)", // Subtle border at the bottom
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)", // Subtle border at the top
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
    marginTop: -40, // Pull card up to overlap with background
  },
  avatarContainer: {
    marginBottom: 15,
    borderRadius: 100,
    padding: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  activeTab: {
    // Color will be set dynamically
  },
  tabText: {
    // Color will be set dynamically
  },
  activeTabText: {
    fontWeight: "bold",
  },
  contentArea: {
    width: "100%",
    minHeight: 300,
  },
});

export default ProfileScreen;
