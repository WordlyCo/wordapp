import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";

import useTheme from "@/src/hooks/useTheme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useStore } from "@/src/stores/store";
import {
  SettingSection,
  SettingButton,
} from "@/src/features/profile/components";

const SettingsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const setHasOnboarded = useStore((state) => state.setHasOnboarded);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <SettingSection title="Account" colors={colors}>
          <SettingButton
            icon="account"
            title="Edit profile"
            titleColor={colors.onSurface}
            onPress={() =>
              router.push("/(protected)/(tabs)/profile/AccountSettings")
            }
            iconColor={colors.primary}
          />
          <SettingButton
            icon="bell"
            title="Notifications"
            titleColor={colors.onSurface}
            onPress={() => {
              Alert.alert("Coming soon!");
            }}
            iconColor={colors.primary}
          />
          <SettingButton
            icon="lock"
            title="Privacy"
            titleColor={colors.onSurface}
            iconColor={colors.primary}
            onPress={() =>
              router.push("/(protected)/(tabs)/profile/PrivacyPolicy")
            }
          />
        </SettingSection>

        <SettingSection title="Support & About" colors={colors}>
          <SettingButton
            icon="credit-card"
            title="My Subscription"
            titleColor={colors.onSurface}
            onPress={() => {
              Alert.alert("Coming soon!");
            }}
            iconColor={colors.primary}
          />
        </SettingSection>

        <SettingSection title="Actions" colors={colors}>
          <SettingButton
            icon="flag"
            title="Report a problem"
            titleColor={colors.onSurface}
            onPress={() => {
              Alert.alert("Coming soon!");
            }}
            iconColor={colors.primary}
          />

          <SettingButton
            icon="dev-to"
            title="Diagnostics"
            titleColor={colors.onSurface}
            onLongPress={() => {
              router.push("/diagnostics" as any);
            }}
            iconColor={colors.primary}
          />

          <SettingButton
            icon="restart"
            title="Reset Onboarding"
            titleColor={colors.onSurface}
            onPress={handleResetOnboarding}
            iconColor={colors.tertiary}
          />

          <SettingButton
            icon="logout"
            title="Log out"
            titleColor={colors.onSurface}
            onPress={handleLogout}
            iconColor={colors.error}
          />
        </SettingSection>
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
  bottomSpace: {
    height: 80,
  },
  topSpace: {
    height: 10,
  },
});

export default SettingsScreen;
