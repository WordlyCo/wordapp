import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "@/src/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "@/src/stores/store";

const StickyHeader = () => {
  const { colors } = useTheme();
  const userStats = useStore((state) => state.userStats);

  return (
    <View>
      <SafeAreaView
        style={[styles.safeAreaView, { backgroundColor: colors.surface }]}
        edges={["top"]}
      />
      <View
        style={[styles.headerContainer, { backgroundColor: colors.surface }]}
      >
        <View style={styles.leftContainer}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.onSurface }]}>
            WordBird
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>
              {userStats.diamonds.toLocaleString()}
            </Text>
            <MaterialCommunityIcons
              name="diamond"
              size={20}
              color={colors.info}
            />
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>
              {userStats.streak}
            </Text>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={20}
              color={colors.streak}
            />
          </View>
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
  safeAreaView: {
    flex: 1,
  },
});

export default StickyHeader;
