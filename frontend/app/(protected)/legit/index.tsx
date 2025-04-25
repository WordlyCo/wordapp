import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
} from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "@/src/contexts/ThemeContext";
import { SwipeCard, ProgressTracker } from "@/src/features/legit/components";
import EmojiExplosion, {
  CAP_EMOJIS,
  LEGIT_EMOJIS,
} from "@/src/features/legit/components/EmojiExplosion";
import type { SwipeCardRef } from "@/src/features/legit/components/SwipeCard";
import { useStore } from "@/src/stores/store";
import { shuffleArray } from "@/lib/utils";

type CardData = {
  id: string;
  word: string;
  definition: string;
  isTrue: boolean;
  wordId: string;
};

interface AnimatedActionButtonProps {
  onPress: () => void;
  gradientColors: [string, string];
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  icon?: React.ReactNode;
  isRight?: boolean;
}

const AnimatedActionButton = ({
  onPress,
  icon,
  gradientColors,
  iconName,
  label,
  isRight = false,
}: AnimatedActionButtonProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    scale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 100 })
    );

    rotation.value = withSequence(
      withTiming(isRight ? 15 : -15, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.animatedButtonContainer, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.buttonPressable}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name={iconName} size={32} color="white" />
            {icon}
            <Text style={styles.buttonLabel}>{label}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const COMPLETION_EMOJIS = [...LEGIT_EMOJIS, ...CAP_EMOJIS];

export default function SwipeGame() {
  const quizWords = useStore((state) => state.quizWords);
  const updateWordProgress = useStore((state) => state.updateWordProgress);
  const updateDiamonds = useStore((state) => state.updateDiamonds);
  const fetchDailyQuiz = useStore((state) => state.fetchDailyQuiz);
  const isFetchingDailyQuiz = useStore((state) => state.isFetchingDailyQuiz);

  const initialDeckRef = useRef<CardData[] | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const generateDeck = useCallback(() => {
    if (!quizWords || quizWords.length === 0) return [];

    const allDefinitions = quizWords.map((word) => word.definition);

    return quizWords.map((word, index) => {
      const isTrue = Math.random() > 0.5;

      let definition = word.definition;
      if (!isTrue) {
        const otherDefinitions = allDefinitions.filter(
          (def) => def !== word.definition
        );
        definition =
          otherDefinitions[Math.floor(Math.random() * otherDefinitions.length)];
      }

      return {
        id: String(index),
        word: word.word,
        definition: definition,
        isTrue: isTrue,
        wordId: word.id,
      };
    });
  }, []);

  const [deck, setDeck] = useState<CardData[]>([]);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emojiExplosion, setEmojiExplosion] = useState<{
    isExploding: boolean;
    emojis: string[];
  }>({
    isExploding: false,
    emojis: COMPLETION_EMOJIS,
  });

  const { colors } = useAppTheme();
  const router = useRouter();
  const topCardRef = useRef<SwipeCardRef>(null);
  const leftButtonRef = useRef<{ x: number; y: number } | null>({ x: 0, y: 0 });
  const rightButtonRef = useRef<{ x: number; y: number } | null>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    async function loadQuizWords() {
      setIsLoading(true);
      if (!quizWords || quizWords.length === 0) {
        await fetchDailyQuiz();
      }
      setIsLoading(false);
    }

    loadQuizWords();
  }, []);

  useEffect(() => {
    if (quizWords && quizWords.length > 0 && !initialDeckRef.current) {
      console.log(`Generating deck with ${quizWords.length} quiz words`);
      const generatedDeck = generateDeck();
      initialDeckRef.current = shuffleArray([...generatedDeck]);
      setDeck(initialDeckRef.current);
    }
  }, [quizWords, generateDeck]);

  const totalWords = useMemo(() => quizWords?.length || 0, [quizWords]);

  const currentIndex = useMemo(
    () => (totalWords > 0 ? totalWords - deck.length : 0),
    [totalWords, deck.length]
  );

  const resetGame = useCallback(() => {
    if (initialDeckRef.current) {
      setDeck([...initialDeckRef.current]);
      setScore(0);
      setResults({});
    }
  }, []);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (deck.length === 0 || isAnimating) return;

      setIsAnimating(true);

      setTimeout(() => {
        const topCard = deck[0];
        const originalWordProgress = quizWords.find(
          (word) => word.id === topCard.wordId
        )?.wordProgress;
        const isCorrect =
          (direction === "right" && topCard.isTrue) ||
          (direction === "left" && !topCard.isTrue);

        if (isCorrect) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          updateDiamonds(1);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        updateWordProgress({
          wordId: topCard.wordId,
          lastPracticed: new Date(),
          practiceCount: originalWordProgress?.practiceCount || 0,
          successCount: originalWordProgress?.successCount || 0,
          recognitionMasteryScore:
            originalWordProgress?.recognitionMasteryScore || 0,
          usageMasteryScore: originalWordProgress?.usageMasteryScore || 0,
          numberOfTimesToPractice:
            originalWordProgress?.numberOfTimesToPractice || 0,
        });

        if (isCorrect) {
          setScore((prev) => prev + 1);
        }

        setResults((prev) => ({
          ...prev,
          [currentIndex]: isCorrect,
        }));

        setDeck((prev) => prev.slice(1));
        setIsAnimating(false);
      }, 300);
    },
    [deck, currentIndex, isAnimating]
  );

  const handleActionButton = (
    direction: "left" | "right",
    buttonPosition: { x: number; y: number }
  ) => {
    if (isAnimating) return;

    if (direction === "left") {
      topCardRef.current?.swipeLeft();
    } else {
      topCardRef.current?.swipeRight();
    }
  };

  const cardsToShow = useMemo(() => {
    return deck.slice(0, Math.min(3, deck.length));
  }, [deck]);

  useEffect(() => {
    if (deck.length === 0) {
      setEmojiExplosion({
        isExploding: true,
        emojis: COMPLETION_EMOJIS,
      });
    }
  }, [deck.length]);

  useEffect(() => {
    async function checkDisclaimerShown() {
      try {
        const hasShownDisclaimer = await AsyncStorage.getItem(
          "legit_disclaimer_shown"
        );
        if (hasShownDisclaimer !== "true") {
          setShowDisclaimer(true);
        }
      } catch (error) {
        console.error("Error checking disclaimer status:", error);
      }
    }

    checkDisclaimerShown();
  }, []);

  const handleCloseDisclaimer = async () => {
    try {
      await AsyncStorage.setItem("legit_disclaimer_shown", "true");
      setShowDisclaimer(false);
    } catch (error) {
      console.error("Error saving disclaimer status:", error);
      setShowDisclaimer(false);
    }
  };

  if (isLoading || isFetchingDailyQuiz) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.onBackground }]}>
          Loading words...
        </Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
          contentStyle={{
            flexDirection: "row-reverse",
          }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  if (deck.length === 0) {
    return (
      <Animated.View
        style={[styles.centered, { backgroundColor: colors.background }]}
        entering={FadeIn.duration(500)}
        exiting={FadeOut}
      >
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 16, color: colors.onBackground }}
        >
          🎉 Game Complete!
        </Text>
        <Text
          variant="titleLarge"
          style={{ marginBottom: 24, color: colors.primary }}
        >
          Score: {score}/{totalWords}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={resetGame}
            style={styles.actionButton}
          >
            Play Again
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.actionButton}
          >
            Home
          </Button>
        </View>

        {emojiExplosion.isExploding && (
          <View style={styles.completionEmojiContainer}>
            <EmojiExplosion
              isExploding={emojiExplosion.isExploding}
              emojis={emojiExplosion.emojis}
              count={75}
              onComplete={() => {
                setEmojiExplosion((prev) => ({ ...prev, isExploding: false }));
              }}
            />
          </View>
        )}
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Legit or Not?",
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.onSurface,
          headerShadowVisible: false,
        }}
      />

      <Portal>
        <Modal
          visible={showDisclaimer}
          onDismiss={handleCloseDisclaimer}
          contentContainerStyle={[
            styles.disclaimerModal,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text
            variant="titleLarge"
            style={{ color: colors.primary, marginBottom: 16 }}
          >
            💎 Game Info
          </Text>
          <Text
            style={{
              color: colors.onSurface,
              marginBottom: 16,
              lineHeight: 22,
            }}
          >
            The "Cap or No Cap?" game rewards you with diamonds for correct
            answers, but doesn't affect your word mastery scores.
          </Text>
          <Text
            style={{
              color: colors.onSurface,
              marginBottom: 24,
              lineHeight: 22,
            }}
          >
            It's a fun way to test your knowledge while earning diamonds for the
            store!
          </Text>
          <Button mode="contained" onPress={handleCloseDisclaimer}>
            Got it!
          </Button>
        </Modal>
      </Portal>

      <ProgressTracker
        currentIndex={currentIndex}
        totalItems={totalWords}
        score={score}
        results={results}
        colors={colors}
      />

      <View style={styles.cardWrapper}>
        {cardsToShow.map((card, index) => {
          const isTopCard = index === 0;

          if (isTopCard) {
            return (
              <SwipeCard
                ref={topCardRef}
                key={card.id}
                word={card.word}
                definition={card.definition}
                onSwipe={handleSwipe}
                colors={colors}
              />
            );
          }

          const stackedCardStyle: ViewStyle = {
            position: "absolute",
            zIndex: -index,
            opacity: 1 - index * 0.2,
            transform: [
              { scale: 1 - index * 0.05 },
              { translateY: index * 10 },
            ],
            backgroundColor: colors.surface,
          };

          return (
            <View key={card.id} style={[styles.stackedCard, stackedCardStyle]}>
              <View style={styles.stackedCardInner}>
                <Text
                  style={[styles.stackedCardWord, { color: colors.primary }]}
                >
                  {card.word}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <View
          onLayout={(event) => {
            const { x, y } = event.nativeEvent.layout;
            leftButtonRef.current = { x, y };
          }}
          style={{ zIndex: 10000 }}
        >
          <AnimatedActionButton
            onPress={() =>
              handleActionButton(
                "left",
                leftButtonRef.current || { x: 0, y: 0 }
              )
            }
            gradientColors={["#FF5A5F", "#FF3A3F"]}
            iconName="close-circle-outline"
            label="CAP"
          />
        </View>

        <View
          onLayout={(event) => {
            const { x, y } = event.nativeEvent.layout;
            rightButtonRef.current = { x, y };
          }}
          style={{ zIndex: 10000 }}
        >
          <AnimatedActionButton
            onPress={() =>
              handleActionButton(
                "right",
                rightButtonRef.current || { x: 0, y: 0 }
              )
            }
            gradientColors={["#7B61FF", "#4F3CFF"]}
            iconName="check-bold"
            label="LEGIT"
            isRight
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    position: "relative",
  },
  stackedCard: {
    width: "100%",
    height: 400,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stackedCardInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
  },
  stackedCardWord: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  cardUnderlay: {
    position: "absolute",
    width: "95%",
    height: 380,
    borderRadius: 16,
    elevation: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
    transform: [{ scale: 0.95 }],
    opacity: 0.6,
  },
  underlayWord: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  animatedButtonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
  },
  buttonPressable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientButton: {
    height: 80,
    width: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 14,
  },
  actionIconButton: {
    marginHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  actionButton: {
    margin: 10,
    minWidth: 120,
  },
  completionEmojiContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "none",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  disclaimerModal: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    maxWidth: 400,
    alignSelf: "center",
  },
});
