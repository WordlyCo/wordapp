import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useStore } from "@/src/stores/store";
import {
  SettingSection,
  SettingButton,
  SettingSwitch,
} from "@/src/features/profile/components";
import { CustomSnackbar } from "@/src/components/CustomSnackbar";

const SettingsScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { logout } = useAuth();
  const { user } = useUser();
  const preferences = useStore((state) => state.user?.preferences);
  const updatePreferences = useStore((state) => state.updatePreferences);
  const setHasOnboarded = useStore((state) => state.setHasOnboarded);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUpdatePreferences = async () => {
    try {
      updatePreferences({
        theme: preferences?.theme === "dark" ? "light" : "dark",
      });

      const oldPreferences = Object.assign(
        {},
        user?.unsafeMetadata.preferences
      );

      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: {
            ...oldPreferences,
            theme: preferences?.theme === "dark" ? "light" : "dark",
          },
        },
      });
    } catch (error) {
      console.error("Update preferences failed:", error);
    }
  };

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
              router.push("/(protected)/(tabs)/profile/account-settings")
            }
            iconColor={colors.primary}
          />
          <SettingButton
            icon="cog"
            title="Preferences"
            titleColor={colors.onSurface}
            iconColor={colors.primary}
            onPress={() =>
              router.push("/(protected)/(tabs)/profile/preferences")
            }
          />
          <SettingButton
            icon="lock"
            title="Privacy"
            titleColor={colors.onSurface}
            iconColor={colors.primary}
            onPress={() =>
              router.push("/(protected)/(tabs)/profile/privacy-policy")
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

        <SettingSection title="Appearance" colors={colors}>
          <SettingSwitch
            icon={
              preferences?.theme === "dark"
                ? "moon-waning-crescent"
                : "white-balance-sunny"
            }
            iconColor={colors.primary}
            title={preferences?.theme === "dark" ? "Dark" : "Light"}
            titleColor={colors.onSurface}
            value={preferences?.theme === "dark"}
            onValueChange={handleUpdatePreferences}
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
            onPress={() => {
              setSnackbarMessage("Long press to view diagnostics");
              setSnackbarVisible(true);
            }}
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
      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type="info"
        onDismiss={() => setSnackbarVisible(false)}
      />
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
