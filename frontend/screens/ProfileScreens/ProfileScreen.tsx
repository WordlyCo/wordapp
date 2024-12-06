import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, List, Avatar, Divider, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import useTheme from "@/hooks/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StickyHeader from "@/components/StickyHeader";

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
  const { logout } = useContext(AuthContext);
  const { colors } = useTheme();
  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StickyHeader />
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <FontAwesome
            name="user-circle"
            color={colors.onSurface}
            size={120}
            style={styles.profileHeader}
          />
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        <Divider style={styles.divider} />

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
            icon="logout"
            mode="contained"
            onPress={logout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </View>
        <Divider style={styles.divider} />
      </ScrollView>
    </>
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
    color: "#666",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: "#5856D6",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
});

export default ProfileScreen;
