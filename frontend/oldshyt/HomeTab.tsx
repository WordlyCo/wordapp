import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { Avatar, Text, Divider, Button } from "react-native-paper";
import StickyHeader from "@/src/components/StickyHeader";
import useTheme from "@/src/hooks/useTheme";
import CategoryItem from "@/src/components/CategoryItem";
import AnimatedCard from "@/screens/GameScreens/components/AnimatedCard";
import { SCROLL_DISTANCE_PER_CARD } from "@/stores/enums";
import { useStore } from "@/stores/store";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type HomeStackParamList = {
  HomeMain: undefined;
  CategoryList: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList>;

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

const HomeTab = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      <View style={styles.container}>
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
                  style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
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
                <Text style={[styles.statValue, { color: statColors.streak }]}>
                  3
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
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
                  style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
                >
                  Minutes Today
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => navigation.navigate("MultipleChoice" as never)}
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
                style={[styles.headerIcon, { backgroundColor: colors.primary }]}
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
                  onPress={() => navigation.navigate("CategoryList")}
                  key={item.id}
                  item={item}
                />
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
    height: 2,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 10,
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
    marginBottom: 5,
  },
  divider: {
    marginVertical: 10,
    height: 2,
  },
  practiceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  practiceButton: {
    marginTop: 10,
  },
});
