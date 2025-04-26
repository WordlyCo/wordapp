import React, { useMemo, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  SharedValue,
} from "react-native-reanimated";
import { CAP_EMOJIS, LEGIT_EMOJIS } from "./EmojiExplosion";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2; // Reduce threshold for faster swiping

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
  mass: 0.2,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

type SwipeCardProps = {
  word: string;
  definition: string;
  translateX: SharedValue<number>;
  colors: any;
};

export type SwipeCardRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ word, definition, colors, translateX }, ref) => {
    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {
          ...SPRING_CONFIG,
          stiffness: 400,
          damping: 10,
        });
      },
      swipeRight: () => {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {
          ...SPRING_CONFIG,
          stiffness: 400,
          damping: 10,
        });
      },
    }));

    const randomEmojis = useMemo(() => {
      const getRandomEmoji = (emojiList: string[]) => {
        const randomIndex = Math.floor(Math.random() * emojiList.length);
        return emojiList[randomIndex];
      };

      return {
        cap: getRandomEmoji(CAP_EMOJIS),
        legit: getRandomEmoji(LEGIT_EMOJIS),
      };
    }, [word]);

    const leftIndicatorStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [0, -SWIPE_THRESHOLD / 2],
        [0, 1],
        Extrapolate.CLAMP
      );
      return { opacity };
    });

    const rightIndicatorStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD / 2],
        [0, 1],
        Extrapolate.CLAMP
      );
      return { opacity };
    });

    const cardAnimatedStyle = useAnimatedStyle(() => {
      const rotation = (translateX.value / SCREEN_WIDTH) * 15;

      const scale = interpolate(
        Math.abs(translateX.value),
        [0, SWIPE_THRESHOLD],
        [1, 1.05],
        Extrapolate.CLAMP
      );

      return {
        transform: [
          { translateX: translateX.value },
          { rotate: `${rotation}deg` },
          { scale },
        ],
      };
    });

    return (
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        <Card
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={5}
        >
          <Card.Content
            style={[styles.cardContent, { backgroundColor: colors.surface }]}
          >
            <Text
              variant="headlineMedium"
              style={[styles.word, { color: colors.primary }]}
            >
              {word}
            </Text>
            <View
              style={[
                styles.definitionContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.definition, { color: colors.onSurface }]}>
                {definition}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.indicatorsContainer}>
            <Animated.View
              style={[
                styles.indicator,
                leftIndicatorStyle,
                { backgroundColor: colors.error + "20" },
              ]}
            >
              <Text style={[styles.indicatorText, { color: colors.onSurface }]}>
                {randomEmojis.cap} Cap
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.indicator,
                rightIndicatorStyle,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.indicatorText, { color: colors.onSurface }]}>
                Legit {randomEmojis.legit}
              </Text>
            </Animated.View>
          </View>
        </Card>
      </Animated.View>
    );
  }
);

SwipeCard.displayName = "SwipeCard";

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 400,
    maxHeight: 400,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    height: "100%",
  },
  cardContent: {
    justifyContent: "space-between",
    padding: 20,
    height: "100%",
  },
  word: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  definitionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  definition: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  indicatorsContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    bottom: 5,
    height: 50,
    overflow: "visible",
    zIndex: 10,
  },
  indicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  indicatorText: {
    fontWeight: "700",
    fontSize: 16,
  },
});

export default SwipeCard;
