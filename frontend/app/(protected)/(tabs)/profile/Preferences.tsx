import useTheme from "@/src/hooks/useTheme";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, Switch, Divider, Text } from "react-native-paper";

const PreferencesScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
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

        <List.Section title="Quiz Settings">
          <List.Item
            title="Sound Effects"
            description="Play sounds during quiz"
            left={(props) => <List.Icon icon="volume-high" />}
            right={() => (
              <Switch value={soundEffects} onValueChange={setSoundEffects} />
            )}
          />
          <Divider />
          <List.Item
            title="Auto-Play Next Question"
            description="Automatically proceed to next question"
            left={(props) => <List.Icon icon="play-circle" />}
            right={() => (
              <Switch value={autoPlay} onValueChange={setAutoPlay} />
            )}
          />
        </List.Section>

        <List.Section title="Data & Storage">
          <List.Item
            title="Clear Cache"
            description="Free up space on your device"
            left={(props) => <List.Icon icon="trash-can" />}
            onPress={() => {
              /* Handle clear cache */
            }}
          />
          <Divider />
          <List.Item
            title="Download Quality"
            description="Manage content download quality"
            left={(props) => <List.Icon icon="download" />}
            right={(props) => <List.Icon icon="chevron-right" />}
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
