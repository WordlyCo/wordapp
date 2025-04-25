import React, {
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  useDerivedValue,
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
  onSwipe: (direction: "left" | "right") => void;
  colors: any;
};

export type SwipeCardRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ word, definition, onSwipe, colors }, ref) => {
    const translateX = useSharedValue(0);

    useEffect(() => {
      translateX.value = 0;
    }, [word, definition]);

    const rotation = useDerivedValue(() => {
      return (translateX.value / SCREEN_WIDTH) * 15;
    });

    const randomEmojis = useMemo(() => {
      const getRandomEmoji = (emojiList: string[]) => {
        const randomIndex = Math.floor(Math.random() * emojiList.length);
        return emojiList[randomIndex];
      };

      return {
        cap: getRandomEmoji(CAP_EMOJIS),
        legit: getRandomEmoji(LEGIT_EMOJIS),
      };
    }, [word]); // Re-randomize when word changes

    const animateSwipe = (direction: "left" | "right") => {
      const toX = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
      translateX.value = withSpring(toX, SPRING_CONFIG, () => {
        runOnJS(onSwipe)(direction);
      });
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      swipeLeft: () => animateSwipe("left"),
      swipeRight: () => animateSwipe("right"),
    }));

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx: any) => {
        ctx.startX = translateX.value;
      },
      onActive: (event, ctx: any) => {
        translateX.value = ctx.startX + event.translationX;
      },
      onEnd: (event) => {
        // Check velocity for more responsive swipes
        const shouldDismissLeft =
          translateX.value < -SWIPE_THRESHOLD || event.velocityX < -800;

        const shouldDismissRight =
          translateX.value > SWIPE_THRESHOLD || event.velocityX > 800;

        if (shouldDismissLeft || shouldDismissRight) {
          const toX = shouldDismissRight ? SCREEN_WIDTH : -SCREEN_WIDTH;
          translateX.value = withSpring(toX, SPRING_CONFIG, () => {
            runOnJS(onSwipe)(shouldDismissRight ? "right" : "left");
          });
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
        }
      },
    });

    const cardStyle = useAnimatedStyle(() => {
      const rotateValue = `${rotation.value}deg`;
      const scale = interpolate(
        Math.abs(translateX.value),
        [0, SWIPE_THRESHOLD],
        [1, 1.05],
        Extrapolate.CLAMP
      );

      return {
        transform: [
          { translateX: translateX.value },
          { rotate: rotateValue },
          { scale },
        ],
      };
    });

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

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, cardStyle]}>
          <Card
            style={[styles.card, { backgroundColor: colors.surface }]}
            elevation={5}
          >
            <Card.Content style={styles.cardContent}>
              <Text
                variant="headlineMedium"
                style={[styles.word, { color: colors.primary }]}
              >
                {word}
              </Text>
              <View style={styles.definitionContainer}>
                <Text style={[styles.definition, { color: colors.onSurface }]}>
                  {definition}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Swipe direction indicators */}
          <View style={styles.indicatorsContainer}>
            <Animated.View
              style={[
                styles.indicator,
                styles.leftIndicator,
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
                styles.rightIndicator,
                rightIndicatorStyle,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.indicatorText, { color: colors.onSurface }]}>
                Legit {randomEmojis.legit}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

SwipeCard.displayName = "SwipeCard";

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 400,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    justifyContent: "space-between",
    padding: 20,
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
  },
  definition: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  indicatorsContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    height: 50,
  },
  indicator: {
    position: "absolute",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  leftIndicator: {
    left: 0,
  },
  rightIndicator: {
    right: 0,
  },
  indicatorText: {
    fontWeight: "700",
    fontSize: 16,
  },
});

export default SwipeCard;
