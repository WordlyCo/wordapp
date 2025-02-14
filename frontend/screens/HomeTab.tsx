import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { Avatar, Text, Divider } from "react-native-paper";
import StickyHeader from "@/components/StickyHeader";
import useTheme from "@/hooks/useTheme";
import CategoryItem from "@/screens/components/CategoryItem";
import AnimatedCard from "@/screens/GameScreens/components/AnimatedCard";
import { SCROLL_DISTANCE_PER_CARD } from "@/stores/enums";
import { useStore } from "@/stores/store";

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
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const { categories, fetchCategories, isLoading } = useStore();

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
    <>
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
                <CategoryItem key={item.id} item={item} />
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#6e85d3",
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
    backgroundColor: "#6e85d3",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
});
