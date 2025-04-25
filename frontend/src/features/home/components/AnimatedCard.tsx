import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";
import { CARD_HEIGHT, SCROLL_DISTANCE_PER_CARD } from "@/src/stores/enums";
import { useAppTheme } from "@/src/contexts/ThemeContext";

interface CardData {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const AnimatedCard = ({
  card,
  scrollY,
  index,
}: {
  card: CardData;
  scrollY: Animated.Value;
  index: number;
}) => {
  const { colors } = useAppTheme();
  const animatedValue = scrollY.interpolate({
    inputRange: [
      -SCROLL_DISTANCE_PER_CARD,
      0,
      index * SCROLL_DISTANCE_PER_CARD,
      (index + 1) * SCROLL_DISTANCE_PER_CARD,
    ],
    outputRange: [0, 0, 0, 1],
    extrapolate: "clamp",
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -CARD_HEIGHT],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const animatedCardStyle = {
    opacity,
    transform: [{ translateY }, { scale }, { perspective: 1000 }],
  };

  return (
    <Animated.View style={[styles.animatedCard, animatedCardStyle]}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.categoryHeader}>
            <Avatar.Icon
              size={24}
              icon={card.icon}
              style={[styles.headerIcon, { backgroundColor: colors.primary }]}
            />
            <Text variant="titleLarge" style={{ color: colors.onSurface }}>
              {card.title}
            </Text>
          </View>
          <View
            style={[
              styles.categoryDivider,
              { backgroundColor: colors.primary },
            ]}
          />
          <Text
            variant="bodyLarge"
            style={{ marginTop: 10, color: colors.onSurfaceVariant }}
          >
            {card.content}
          </Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

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
  animatedCard: {
    height: CARD_HEIGHT,
    marginBottom: 15,
  },
  card: {
    height: CARD_HEIGHT,
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
  flashListContainer: {
    height: 400,
    marginTop: 10,
  },
  categoryDivider: {
    marginTop: 10,
    height: 2,
  },
  categoryButton: {
    width: "47%",
    marginHorizontal: "1.5%",
    marginVertical: 8,
    borderRadius: 12,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  categoryIcon: {
    marginBottom: 0,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
});

export default AnimatedCard;
