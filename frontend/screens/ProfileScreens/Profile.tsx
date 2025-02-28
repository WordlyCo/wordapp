import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, List, Divider, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/hooks/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StickyHeader from "@/components/StickyHeader";
import { useStore } from "@/stores/store";

type ProfileStackParamList = {
  ProfileMain: undefined;
  UserSettingsScreen: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  PrivacyPolicy: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const logout = useStore((state) => state.logout);
  const { colors } = useTheme();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <ScrollView>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <FontAwesome
            name="user-circle"
            color={colors.onSurface}
            size={120}
            style={styles.profileHeader}
          />
          <Text style={[styles.userName, { color: colors.onSurface }]}>
            John Doe
          </Text>
          <Text style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>
            john.doe@example.com
          </Text>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: colors.outline }]}
        />

        {/* Menu Items */}
        <List.Section style={styles.listContainer}>
          <List.Item
            title="Account Settings"
            left={(props) => <List.Icon icon="account-cog" />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate("AccountSettings" as never)}
          />
          <List.Item
            title="Preferences"
            left={(props) => <List.Icon icon="cog" />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate("Preferences" as never)}
          />
          <List.Item
            title="Payment Methods"
            left={(props) => <List.Icon icon="credit-card" />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => {
              /* Handle navigation */
            }}
          />
          <List.Item
            title="Help Center"
            left={(props) => <List.Icon icon="help-circle" />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon icon="shield-account" />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />
        </List.Section>
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            icon="logout"
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            Log Out
          </Button>
        </View>
        <Divider style={styles.divider} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    marginVertical: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {},
  listContainer: {
    paddingHorizontal: 20,
  },
  logoutButtonContent: {
    height: 48,
  },
  logoutButtonLabel: {
    color: "white",
  },
});

export default ProfileScreen;
