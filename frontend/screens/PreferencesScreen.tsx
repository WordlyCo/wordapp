import useTheme from "@/hooks/useTheme";
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <List.Section title="App Preferences">
        <List.Item
          title="Push Notifications"
          description="Receive updates and reminders"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
        <Divider />
        <List.Item
          title="Dark Mode"
          description="Switch between light and dark themes"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
        />
      </List.Section>

      <List.Section title="Quiz Settings">
        <List.Item
          title="Sound Effects"
          description="Play sounds during quiz"
          left={(props) => <List.Icon {...props} icon="volume-high" />}
          right={() => (
            <Switch value={soundEffects} onValueChange={setSoundEffects} />
          )}
        />
        <Divider />
        <List.Item
          title="Auto-Play Next Question"
          description="Automatically proceed to next question"
          left={(props) => <List.Icon {...props} icon="play-circle" />}
          right={() => <Switch value={autoPlay} onValueChange={setAutoPlay} />}
        />
      </List.Section>

      <List.Section title="Data & Storage">
        <List.Item
          title="Clear Cache"
          description="Free up space on your device"
          left={(props) => <List.Icon {...props} icon="trash-can" />}
          onPress={() => {
            /* Handle clear cache */
          }}
        />
        <Divider />
        <List.Item
          title="Download Quality"
          description="Manage content download quality"
          left={(props) => <List.Icon {...props} icon="download" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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
