import useTheme from "@/src/hooks/useTheme";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, Switch, Divider } from "react-native-paper";

const PreferencesScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[
          styles.scrollViewContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <List.Section title="App Preferences">
          <List.Item
            title="Push Notifications"
            description="Receive updates and reminders"
            left={(props) => <List.Icon icon="bell" />}
            right={() => (
              <Switch value={notifications} onValueChange={setNotifications} />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch value={darkMode} onValueChange={setDarkMode} />
            )}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollViewContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PreferencesScreen;
