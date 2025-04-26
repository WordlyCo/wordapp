import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import EmojiExplosion from "./EmojiExplosion";

interface CongratsCardProps {
  score: number;
  totalWords: number;
  diamondsEarned: number;
  totalDiamonds: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  colors: any;
  router: any;
}

const CongratsCard: React.FC<CongratsCardProps> = ({
  score,
  totalWords,
  diamondsEarned,
  totalDiamonds,
  onPlayAgain,
  onGoHome,
  colors,
  router,
}) => {
  const [emojiExplosion, setEmojiExplosion] = useState<{
    isExploding: boolean;
    emojis: string[];
  }>({
    isExploding: false,
    emojis: ["🔥", "💯", "🎯", "🏆", "👑", "💎", "⚡️", "🌟", "✨"],
  });

  const diamondRotation = useSharedValue(0);
  const diamondScale = useSharedValue(1);

  const isPerfectScore = score === totalWords;

  useEffect(() => {
    diamondRotation.value = 0;
    const rotationInterval = setInterval(() => {
      diamondRotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    }, 0);

    diamondScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    if (isPerfectScore) {
      setTimeout(() => {
        setEmojiExplosion((prev) => ({ ...prev, isExploding: true }));
      }, 800);
    }

    return () => clearInterval(rotationInterval);
  }, []);

  const animatedDiamondStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${diamondRotation.value}deg` },
        { scale: diamondScale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.centered, { backgroundColor: colors.background }]}
      entering={FadeIn.duration(500)}
      exiting={FadeOut}
    >
      <View style={styles.gameCompleteContainer}>
        <Animated.View
          entering={FadeIn.delay(300).duration(800)}
          style={styles.completionHeaderContainer}
        >
          <LinearGradient
            colors={
              isPerfectScore ? ["#FF8A00", "#FF0080"] : ["#7B61FF", "#00C6FF"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completionGradient}
          >
            <Text variant="headlineLarge" style={styles.completionHeader}>
              {isPerfectScore ? "FLAWLESS VICTORY! 🔥" : "GAME COMPLETE!"}
            </Text>

            <View style={styles.completionScoreRow}>
              <Text style={styles.completionScore}>
                {score}/{totalWords}
              </Text>
              {score > totalWords * 0.7 && (
                <Text style={styles.scoreComment}>
                  {isPerfectScore
                    ? "ABSOLUTELY GOATED!"
                    : "LOW-KEY IMPRESSIVE!"}
                </Text>
              )}
              {score <= totalWords * 0.7 && score > totalWords * 0.4 && (
                <Text style={styles.scoreComment}>NOT BAD, STILL VALID</Text>
              )}
              {score <= totalWords * 0.4 && (
                <Text style={styles.scoreComment}>MAYBE NEXT TIME FR</Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(600).duration(800)}
          style={styles.diamondContainer}
        >
          <View style={styles.diamondReward}>
            <Animated.View style={animatedDiamondStyle}>
              <MaterialCommunityIcons
                name="diamond-stone"
                size={44}
                color={isPerfectScore ? "#00FFFF" : "#00C6FF"}
              />
            </Animated.View>
            <View style={styles.diamondTextContainer}>
              <Text variant="titleMedium" style={styles.diamondText}>
                DIAMONDS EARNED
              </Text>
              <View style={styles.diamondCountRow}>
                <Text
                  variant="headlineMedium"
                  style={[
                    styles.diamondCount,
                    isPerfectScore && {
                      color: "#00FFFF",
                      textShadowColor: "rgba(0,255,255,0.5)",
                      textShadowRadius: 10,
                    },
                  ]}
                >
                  +{diamondsEarned}
                </Text>
                <Animated.View
                  entering={FadeIn.delay(1200)}
                  style={styles.totalDiamondsContainer}
                >
                  <Text style={styles.totalDiamonds}>
                    TOTAL: {totalDiamonds}
                  </Text>
                </Animated.View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(900).duration(800)}
          style={styles.actionButtonsRow}
        >
          <Pressable
            style={[styles.actionButton, styles.playAgainButton]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onPlayAgain();
            }}
          >
            <LinearGradient
              colors={
                isPerfectScore ? ["#FF8A00", "#FF0080"] : ["#7B61FF", "#4F3CFF"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>RUN IT BACK</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.homeButton]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onGoHome();
            }}
          >
            <Text style={styles.homeButtonText}>DIP OUT</Text>
          </Pressable>
        </Animated.View>

        {score >= totalWords * 0.8 && (
          <Animated.View
            entering={FadeIn.delay(1200).duration(800)}
            style={styles.achievementTagsContainer}
          >
            <View style={styles.achievementTag}>
              <Text style={styles.achievementTagText}>VOCABULARY GOAT 🐐</Text>
            </View>

            {isPerfectScore && (
              <View style={[styles.achievementTag, styles.perfectTag]}>
                <Text style={styles.achievementTagText}>
                  NO CAP DETECTOR 💯
                </Text>
              </View>
            )}

            {isPerfectScore && diamondsEarned > 5 && (
              <View
                style={[
                  styles.achievementTag,
                  { backgroundColor: "rgba(255, 126, 0, 0.8)" },
                ]}
              >
                <Text style={styles.achievementTagText}>
                  DIAMOND HUSTLER 💎
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
      <EmojiExplosion
        isExploding={emojiExplosion.isExploding}
        emojis={emojiExplosion.emojis}
        count={isPerfectScore ? 120 : 75}
        onComplete={() => {
          setEmojiExplosion((prev) => ({ ...prev, isExploding: false }));
        }}
      />
    </Animated.View>
  );
};

export default CongratsCard;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  actionButton: {
    margin: 10,
    minWidth: 120,
  },
  gameCompleteContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  completionHeaderContainer: {
    width: "100%",
    marginBottom: 24,
  },
  completionGradient: {
    padding: 24,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  completionHeader: {
    color: "white",
    fontWeight: "900",
    fontSize: 32,
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  completionScoreRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  completionScore: {
    color: "white",
    fontWeight: "800",
    fontSize: 42,
    marginBottom: 15,
  },
  scoreComment: {
    color: "white",
    fontWeight: "800",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  diamondContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 20,
    borderRadius: 20,
    marginVertical: 20,
    width: "100%",
  },
  diamondReward: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  diamondTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  diamondText: {
    color: "#E0E0E0",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 14,
    marginBottom: 4,
  },
  diamondCountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  diamondCount: {
    color: "#00C6FF",
    fontWeight: "900",
    fontSize: 32,
  },
  totalDiamondsContainer: {
    marginLeft: 16,
    backgroundColor: "rgba(0, 198, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalDiamonds: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  playAgainButton: {
    flex: 1,
    marginRight: 8,
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  homeButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  homeButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  achievementTagsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 30,
    width: "100%",
  },
  achievementTag: {
    backgroundColor: "rgba(123, 97, 255, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementTagText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },
  perfectTag: {
    backgroundColor: "rgba(0, 198, 255, 0.8)",
  },
});
