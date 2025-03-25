import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  PrivacyPolicy: undefined;
  HelpCenter: undefined;
  Preferences: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors } = useTheme();

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

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons 
            name="chevron-left" 
            size={30} 
            color={colors.onSurface} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          Settings
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        {renderSectionTitle("Account")}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surfaceVariant }]}>
          {renderSettingItem(
            "account",
            "Edit profile",
            () => navigation.navigate("AccountSettings")
          )}
          {renderSettingItem(
            "shield-account",
            "Security",
            () => {} // Add navigation to Security screen when available
          )}
          {renderSettingItem(
            "bell",
            "Notifications",
            () => {} // Add navigation to Notifications screen when available
          )}
          {renderSettingItem(
            "lock",
            "Privacy",
            () => navigation.navigate("PrivacyPolicy")
          )}
        </View>
        
        {/* Support & About Section */}
        {renderSectionTitle("Support & About")}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surfaceVariant }]}>
          {renderSettingItem(
            "credit-card",
            "My Subscription",
            () => {} // Add navigation to Subscription screen when available
          )}
          {renderSettingItem(
            "help-circle",
            "Help & Support",
            () => navigation.navigate("HelpCenter")
          )}
          {renderSettingItem(
            "file-document",
            "Terms and Policies",
            () => navigation.navigate("PrivacyPolicy")
          )}
        </View>
        
        {/* Cache & Cellular Section */}
        {renderSectionTitle("Cache & Cellular")}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surfaceVariant }]}>
          {renderSettingItem(
            "trash-can",
            "Free up space",
            () => {} // Add functionality to free up space
          )}
          {renderSettingItem(
            "data-matrix",
            "Data Saver",
            () => navigation.navigate("Preferences")
          )}
        </View>
        
        {/* Actions Section */}
        {renderSectionTitle("Actions")}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surfaceVariant }]}>
          {renderSettingItem(
            "flag",
            "Report a problem",
            () => {} // Add functionality to report a problem
          )}
          {renderSettingItem(
            "account-plus",
            "Add account",
            () => {} // Add functionality to add account
          )}
          {renderSettingItem(
            "logout",
            "Log out",
            () => {}, // Add functionality to log out
            colors.error
          )}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    overflow: "hidden",
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
  }
});

export default SettingsScreen; 