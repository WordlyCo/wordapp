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
        <Ionicons name="book-outline" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.onSurface }]}>
          WordBird
        </Text>
      </View>

      {/* Right Section: Stats */}
      <View style={styles.rightContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.onSurface }]}>
            67,042
          </Text>
          <MaterialCommunityIcons
            name="diamond"
            size={20}
            color={colors.info}
          />
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.onSurface }]}>
            69
          </Text>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={20}
            color={colors.streak}
          />
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
    marginRight: 5,
  },
});

export default StickyHeader;
