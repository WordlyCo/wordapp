import useTheme from "@/src/hooks/useTheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List } from "react-native-paper";

const HelpCenterScreen = () => {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <List.Section style={styles.list}>
        <List.Item
          title="Frequently Asked Questions"
          left={(props) => <List.Icon icon="frequently-asked-questions" />}
          right={(props) => <List.Icon icon="chevron-right" />}
        />
        <List.Item
          title="Contact Support"
          left={(props) => <List.Icon icon="message" />}
          right={(props) => <List.Icon icon="chevron-right" />}
        />
        <List.Item
          title="Report a Problem"
          left={(props) => <List.Icon icon="alert" />}
          right={(props) => <List.Icon icon="chevron-right" />}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    marginHorizontal: 20,
  },
});

export default HelpCenterScreen;
