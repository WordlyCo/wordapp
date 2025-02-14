import { Animated, StyleSheet } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";
import { CARD_HEIGHT, SCROLL_DISTANCE_PER_CARD } from "@/stores/enums";
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

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity,
          transform: [{ translateY }, { scale }, { perspective: 1000 }],
        },
      ]}
    >
      <Card elevation={2} style={styles.card}>
        <Card.Title
          title={card.title}
          titleStyle={{ fontSize: 24 }}
          left={(props: any) => (
            <Avatar.Icon size={props.size} icon={card.icon} />
          )}
        />
        <Card.Content>
          <Text variant="bodyLarge">{card.content}</Text>
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
  cardContainer: {
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
    backgroundColor: "#6e85d3",
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
    backgroundColor: "#6e85d3",
  },
  categoryButton: {
    width: "47%",
    marginHorizontal: "1.5%",
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
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
