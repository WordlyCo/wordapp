import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { Avatar, Text, Divider, Button } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import StickyHeader from "@/src/components/StickyHeader";
import useTheme from "@/src/hooks/useTheme";
import CategoryItem from "@/src/components/CategoryItem";
import AnimatedCard from "@/src/features/home/components/AnimatedCard";
import { SCROLL_DISTANCE_PER_CARD } from "@/stores/enums";
import { useStore } from "@/stores/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CardData {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const CARDS: CardData[] = [
  {
    id: "1",
    title: "Today's Learning Goals",
    content: "Master 5 new words and complete the flashcard challenge!",
    icon: "calendar",
  },
  {
    id: "2",
    title: "Motivation for You",
    content: '"The more you learn, the more places you\'ll go." - Dr. Seuss',
    icon: "rocket",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const { categories, fetchCategories, isLoading } = useStore();

  const statColors = {
    goal: colors.goal,
    streak: colors.streak,
    time: colors.timer,
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function for navigation with proper route types
  const navigateTo = (path: string) => {
    try {
      router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scrollViewContainer,
              { paddingBottom: 20 },
            ]}
            scrollEventThrottle={16}
            bounces={true}
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          >
            <View
              style={[
                styles.cardsContainer,
                { minHeight: SCROLL_DISTANCE_PER_CARD * CARDS.length },
              ]}
            >
              {CARDS.map((card, index) => (
                <AnimatedCard
                  key={card.id}
                  card={card}
                  scrollY={scrollY}
                  index={index}
                />
              ))}
            </View>

            <View
              style={[
                styles.practiceCardContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <View style={styles.practiceHeader}>
                <Avatar.Icon
                  size={36}
                  icon="brain"
                  style={[
                    styles.headerIcon,
                    { backgroundColor: statColors.time },
                  ]}
                  color={colors.onSurface}
                />
                <Text style={styles.heading}>Daily Practice</Text>
              </View>
              <Divider
                style={[styles.divider, { backgroundColor: statColors.time }]}
              />

              <View style={styles.practiceStats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name="target"
                    size={24}
                    color={statColors.goal}
                  />
                  <Text style={[styles.statValue, { color: statColors.goal }]}>
                    5/10
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Daily Goal
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name="fire"
                    size={24}
                    color={statColors.streak}
                  />
                  <Text
                    style={[styles.statValue, { color: statColors.streak }]}
                  >
                    3
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Day Streak
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color={statColors.time}
                  />
                  <Text style={[styles.statValue, { color: statColors.time }]}>
                    15
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Minutes Today
                  </Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => navigateTo("/(app)/games/multiple-choice")}
                style={[
                  styles.practiceButton,
                  { backgroundColor: statColors.time },
                ]}
                icon="play"
              >
                Start Practice
              </Button>
            </View>

            <View style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Avatar.Icon
                  size={36}
                  icon="shape"
                  style={[
                    styles.headerIcon,
                    { backgroundColor: colors.primary },
                  ]}
                  color={colors.onSurface}
                />
                <Text style={styles.heading}>Word Categories</Text>
              </View>
              <Divider
                style={[
                  styles.categoryDivider,
                  { backgroundColor: colors.primary },
                ]}
              />

              <View style={styles.categoriesGrid}>
                {categories.map((item) => (
                  <CategoryItem
                    onPress={() => navigateTo("/(app)/home/categories")}
                    key={item.id}
                    item={item}
                  />
                ))}
              </View>
            </View>
          </Animated.ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  cardsContainer: {
    gap: 15,
  },
  categoryContainer: {
    borderRadius: 15,
    elevation: 2,
    minHeight: 400,
    marginTop: 15,
    padding: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  headerIcon: {
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  categoryDivider: {
    height: 2,
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 15,
  },
  practiceCardContainer: {
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    marginTop: 15,
  },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 2,
    marginVertical: 10,
  },
  practiceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  practiceButton: {
    marginTop: 20,
    paddingVertical: 6,
  },
});
