import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";

const StickyHeader = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface }]}>
      {/* Left Section: Logo and Title */}
      <View style={styles.leftContainer}>
        <Ionicons name="book-outline" size={24} color="#6e85d3" />
        <Text style={styles.title}>WordBird</Text>
      </View>

      {/* Right Section: Stats */}
      <View style={styles.rightContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>69</Text>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={20}
            color="#ffd700"
          />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>67,042</Text>
          <MaterialCommunityIcons name="diamond" size={20} color="#00bcd4" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  statValue: {
    fontSize: 16,
    color: "#fff",
    marginRight: 5,
  },
});

export default StickyHeader;
