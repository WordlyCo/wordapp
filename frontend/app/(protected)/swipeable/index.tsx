import { shuffleArray } from "@/lib/utils";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import {
  ProgressTracker,
  SwipeCard,
} from "@/src/features/swipeable/components";
import AnimatedActionButton from "@/src/features/swipeable/components/AnimatedActionButton";
import CongratsCard from "@/src/features/swipeable/components/CongratsCard";
import { useStore } from "@/src/stores/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
} from "react-native-paper";
import { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";
import BackgroundCard from "@/src/features/swipeable/components/BackgroundCard";
import { Ionicons } from "@expo/vector-icons";

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

export type SwipeCardRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type CardData = {
  id: string;
  word: string;
  definition: string;
  isTrue: boolean;
  wordId: string;
};

export default function SwipeGame() {
  const quizWords = useStore((state) => state.quizWords);
  const quizWordsError = useStore((state) => state.quizWordsError);
  const updateWordProgress = useStore((state) => state.updateWordProgress);
  const diamonds = useStore((state) => state.user?.userStats?.diamonds);
  const updateDiamonds = useStore((state) => state.updateDiamonds);
  const fetchDailyQuiz = useStore((state) => state.fetchDailyQuiz);
  const isFetchingDailyQuiz = useStore((state) => state.isFetchingDailyQuiz);
  const initialDeckRef = useRef<CardData[] | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [diamondsEarned, setDiamondsEarned] = useState(0);
  const [initialDiamonds, setInitialDiamonds] = useState(diamonds || 0);
  const [deck, setDeck] = useState<CardData[]>([]);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuizWords() {
      setIsLoading(true);
      if (!quizWords || quizWords.length === 0) {
        await fetchDailyQuiz();
      }
      setIsLoading(false);
    }

    loadQuizWords();
  }, [fetchDailyQuiz, quizWords]);

  const { colors } = useAppTheme();
  const router = useRouter();
  const topCardRef = useRef<SwipeCardRef>(null);

  const totalWords = useMemo(() => quizWords?.length || 0, [quizWords]);
  const currentCard = useMemo(() => deck[0] || null, [deck]);

  useEffect(() => {
    if (diamonds !== undefined) {
      setInitialDiamonds(diamonds);
    }
  }, [diamonds]);

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
  }, [quizWords]);

  useEffect(() => {
    if (quizWords && quizWords.length > 0 && !initialDeckRef.current) {
      const generatedDeck = generateDeck();
      initialDeckRef.current = shuffleArray([...generatedDeck]);
      setDeck(initialDeckRef.current);
    }
  }, [quizWords, generateDeck]);

  const currentIndex = useMemo(
    () => (totalWords > 0 ? totalWords - deck.length : 0),
    [totalWords, deck.length]
  );

  const visibleCards = useMemo(() => {
    return deck.slice(0, Math.min(4, deck.length));
  }, [deck]);

  const translateX = useSharedValue(0);
  const zeroTranslateX = useSharedValue(0);
  const nextCardScale = useSharedValue(0.97);
  const nextCardTranslateY = useSharedValue(12);
  const nextCardRotation = useSharedValue(1.5);

  useEffect(() => {
    translateX.value = 0;
  }, [currentCard]);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (deck.length === 0 || isAnimating) return;

      setIsAnimating(true);

      if (deck.length >= 2) {
        nextCardScale.value = withSpring(1, {
          ...SPRING_CONFIG,
          stiffness: 200,
          damping: 20,
        });

        nextCardTranslateY.value = withSpring(0, {
          ...SPRING_CONFIG,
          stiffness: 200,
          damping: 20,
        });

        nextCardRotation.value = withSpring(0, {
          ...SPRING_CONFIG,
          stiffness: 180,
          damping: 18,
        });
      }

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
          setDiamondsEarned((prev) => prev + 1);
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
      }, 200);
    },
    [
      deck,
      currentIndex,
      isAnimating,
      nextCardScale,
      nextCardTranslateY,
      nextCardRotation,
    ]
  );

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const velocityThreshold = 800;
      const shouldDismissLeft =
        translateX.value < -SWIPE_THRESHOLD ||
        event.velocityX < -velocityThreshold;
      const shouldDismissRight =
        translateX.value > SWIPE_THRESHOLD ||
        event.velocityX > velocityThreshold;

      if (shouldDismissLeft) {
        translateX.value = withSpring(
          -SCREEN_WIDTH * 1.5,
          {
            ...SPRING_CONFIG,
            stiffness: 400,
            damping: 10,
          },
          () => {
            runOnJS(handleSwipe)("left");
          }
        );
      } else if (shouldDismissRight) {
        translateX.value = withSpring(
          SCREEN_WIDTH * 1.5,
          {
            ...SPRING_CONFIG,
            stiffness: 400,
            damping: 10,
          },
          () => {
            runOnJS(handleSwipe)("right");
          }
        );
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  useEffect(() => {
    if (deck.length >= 2) {
      nextCardScale.value = 0.97;
      nextCardScale.value = 0.97;
      nextCardTranslateY.value = 12;
      nextCardRotation.value = 1.5;
    }
  }, [deck]);

  const resetGame = useCallback(() => {
    if (initialDeckRef.current) {
      setDeck([...initialDeckRef.current]);
      setScore(0);
      setResults({});
    }
  }, []);

  const handleActionButton = (direction: "left" | "right") => {
    if (isAnimating || !topCardRef.current) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (direction === "left") {
      topCardRef.current.swipeLeft();
      handleSwipe("left");
    } else {
      topCardRef.current.swipeRight();
      handleSwipe("right");
    }
  };

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

  if (quizWordsError) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.onBackground }]}>
          You don't have any unlearned words yet!
        </Text>
        <Ionicons
          name="sad-outline"
          size={44}
          color={colors.primary}
          style={{ marginVertical: 15 }}
        />
        <Button
          icon="arrow-right"
          onPress={() => router.push("/(protected)/(tabs)/store")}
          mode="contained"
          style={{ marginTop: 10 }}
          contentStyle={{
            flexDirection: "row-reverse",
          }}
        >
          Add New Word Lists
        </Button>
      </View>
    );
  }

  if (deck.length === 0) {
    const totalDiamonds = initialDiamonds + diamondsEarned;
    return (
      <CongratsCard
        score={score}
        totalWords={totalWords}
        diamondsEarned={diamondsEarned}
        totalDiamonds={totalDiamonds}
        onPlayAgain={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          resetGame();
        }}
        onGoHome={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.back();
        }}
        colors={colors}
        router={router}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProgressTracker
        currentIndex={currentIndex}
        totalItems={totalWords}
        score={score}
        results={results}
        colors={colors}
      />

      <View style={styles.cardsStackContainer}>
        {visibleCards
          .slice(1)
          .reverse()
          .map((card, index) => {
            const actualIndex = visibleCards.length - 1 - index;

            return (
              <BackgroundCard
                key={card.id}
                card={card}
                actualIndex={actualIndex}
                isNextCard={actualIndex === 1}
                nextCardScale={nextCardScale}
                nextCardTranslateY={nextCardTranslateY}
                nextCardRotation={nextCardRotation}
                zeroTranslateX={zeroTranslateX}
                colors={colors}
              />
            );
          })}

        {visibleCards.length > 0 && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: 400,
              borderRadius: 16,
              zIndex: 999,
            }}
          >
            <GestureDetector gesture={swipeGesture}>
              <View
                style={[
                  styles.topCardContainer,
                  {
                    pointerEvents: "auto",
                  },
                ]}
              >
                <SwipeCard
                  ref={topCardRef}
                  translateX={translateX}
                  key={visibleCards[0].id}
                  word={visibleCards[0].word}
                  definition={visibleCards[0].definition}
                  colors={colors}
                />
              </View>
            </GestureDetector>
          </View>
        )}
      </View>

      <View style={styles.actionButtonsContainer}>
        <AnimatedActionButton
          onPress={() => handleActionButton("left")}
          gradientColors={["#FF5A5F", "#FF3A3F"]}
          iconName="close-circle-outline"
          label="CAP"
        />

        <AnimatedActionButton
          onPress={() => handleActionButton("right")}
          gradientColors={["#7B61FF", "#4F3CFF"]}
          iconName="check-bold"
          label="LEGIT"
          isRight
        />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardWrapper: {
    flex: 1,
  },
  cardsStackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  topCardContainer: {
    position: "absolute",
    width: "100%",
    height: 400,
    maxHeight: 400,
    borderRadius: 16,
    overflow: "visible",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 32,
  },
});
