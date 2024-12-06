import useTheme from "@/hooks/useTheme";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";

const PrivacyPolicyScreen = () => {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={styles.section}>Last updated: [Date]</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy describes our policies and procedures on the
          collection, use and disclosure of your information when you use our
          service.
        </Text>
        {/* Add more privacy policy content as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});

export default PrivacyPolicyScreen;
