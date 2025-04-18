import useTheme from "@/src/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import { useStore } from "@/src/stores/store";

const PrivacyPolicyScreen = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const setHasOnboarded = useStore((state) => state.setHasOnboarded);
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user?.delete();
              setHasOnboarded(false);
              router.replace("/");
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ]
    );
  };

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={styles.section}>Last updated: [04.17.2025]</Text>
        <Text style={styles.paragraph}>
          WordApp collects only what’s needed to run and improve your learning
          experience—your email for account sign‑in and your quiz activity (word
          lists, streaks & diamonds). We never sell or share your personal data.
          You can delete your account at any time from settings and all your
          data will be permanently removed.
        </Text>
        <Text style={styles.paragraph}>
          Questions? Reach us at privacy@wordapp.app.
        </Text>
      </View>
      <View
        style={[
          styles.sectionContainer,
          { backgroundColor: colors.surfaceVariant },
        ]}
      >
        {renderSettingItem(
          "delete",
          "Delete Account",
          handleDeleteAccount,
          colors.error
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
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
  sectionContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default PrivacyPolicyScreen;
