import { SwipeCard } from "@/src/features/swipeable/components";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type CardData = {
  id: string;
  word: string;
  definition: string;
  isTrue: boolean;
  wordId: string;
};

interface BackgroundCardProps {
  card: CardData;
  actualIndex: number;
  isNextCard: boolean;
  nextCardScale: SharedValue<number>;
  nextCardTranslateY: SharedValue<number>;
  nextCardRotation: SharedValue<number>;
  zeroTranslateX: SharedValue<number>;
  colors: any;
}

// This is the card right below the top card
const BackgroundCard = ({
  card,
  actualIndex,
  isNextCard,
  nextCardScale,
  nextCardTranslateY,
  nextCardRotation,
  zeroTranslateX,
  colors,
}: BackgroundCardProps) => {
  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (isNextCard) {
      return {
        transform: [
          { translateY: nextCardTranslateY.value },
          { scale: nextCardScale.value },
          { rotateZ: `${nextCardRotation.value}deg` },
        ],
        shadowOpacity: interpolate(
          nextCardScale.value,
          [0.97, 1],
          [0.2, 0.3],
          Extrapolate.CLAMP
        ),
        shadowRadius: interpolate(
          nextCardScale.value,
          [0.97, 1],
          [4, 8],
          Extrapolate.CLAMP
        ),
        elevation: interpolate(
          nextCardScale.value,
          [0.97, 1],
          [3, 5],
          Extrapolate.CLAMP
        ),
      };
    }

    const distanceFromTop = actualIndex - 1;

    return {
      transform: [
        { translateY: distanceFromTop * 15 },
        { scale: Math.max(0.85, 1 - distanceFromTop * 0.035) },
        { rotateZ: `${distanceFromTop * 0.5}deg` },
      ],
      shadowOpacity: Math.max(0.1, 0.25 - distanceFromTop * 0.05),
      shadowRadius: Math.max(2, 5 - distanceFromTop),
      elevation: Math.max(1, 4 - distanceFromTop),
    };
  });

  return (
    <Animated.View
      style={[
        styles.stackedCardContainer,
        {
          zIndex: 10 - actualIndex,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.surfaceVariant + (isNextCard ? "40" : "20"),
        },
        cardAnimatedStyle,
      ]}
    >
      <SwipeCard
        translateX={zeroTranslateX}
        word={card.word}
        definition={card.definition}
        colors={colors}
      />
    </Animated.View>
  );
};

export default BackgroundCard;

const styles = StyleSheet.create({
  stackedCardContainer: {
    position: "absolute",
    width: "100%",
    height: 400,
    alignSelf: "center",
    borderRadius: 16,
  },
});
