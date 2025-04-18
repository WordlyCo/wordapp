import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";

import useTheme from "@/src/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "@/src/contexts/AuthContext";
import { useStore } from "@/src/stores/store";

const SettingsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const setHasOnboarded = useStore((state) => state.setHasOnboarded);

  const renderSettingItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    title: string,
    onPress: () => void,
    iconColor = colors.primary
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={[styles.settingText, { color: colors.onSurface }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleResetOnboarding = async () => {
    try {
      setHasOnboarded(false);
      handleLogout();
    } catch (error) {
      console.error("Reset onboarding failed:", error);
    }
  };

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        {renderSectionTitle("Account")}
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          {renderSettingItem("account", "Edit profile", () =>
            router.push("/(protected)/(tabs)/profile/AccountSettings")
          )}
          {renderSettingItem(
            "bell",
            "Notifications",
            () => {
              Alert.alert("Coming soon!");
            } // Add navigation to Notifications screen when available
          )}
          {renderSettingItem("lock", "Privacy", () =>
            router.push("/(protected)/(tabs)/profile/PrivacyPolicy")
          )}
        </View>

        {/* Support & About Section */}
        {renderSectionTitle("Support & About")}
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          {renderSettingItem(
            "credit-card",
            "My Subscription",
            () => {
              Alert.alert("Coming soon!");
            } // Add navigation to Subscription screen when available
          )}
        </View>

        {/* Actions Section */}
        {renderSectionTitle("Actions")}
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          {renderSettingItem(
            "flag",
            "Report a problem",
            () => {
              Alert.alert("Coming soon!");
            } // Add functionality to report a problem
          )}
          {renderSettingItem(
            "restart",
            "Reset Onboarding",
            handleResetOnboarding,
            colors.tertiary
          )}

          {renderSettingItem("logout", "Log out", handleLogout, colors.error)}
        </View>

        {/* Add some space at the bottom for better UX */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
  },
  bottomSpace: {
    height: 80,
  },
});

export default SettingsScreen;
