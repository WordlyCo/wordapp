import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { Text, Card, Button, IconButton } from "react-native-paper";
import useTheme from "@/hooks/useTheme";
import WordMasteryProgress from "@/components/WordMasteryProgress";
import { useNavigation } from "@react-navigation/native";
import type { SessionWord } from "@/stores/types";
import QuestionCard from "./components/QuestionCard";
import { useStore } from "@/stores/store";
import { SESSION_TYPES } from "@/stores/enums";
type CardState = "playing" | "review" | "summary";

type GameStats = {
  correctAnswers: number;
  totalTime: number;
  masteryGained: number;
};

const MultipleChoice = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const startSession = useStore((state) => state.startSession);
  const currentSession = useStore((state) => state.currentSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<SessionWord | null>(null);
  const [score, setScore] = useState(0);
  const [cardState, setCardState] = useState<CardState>("playing");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    correctAnswers: 0,
    totalTime: 0,
    masteryGained: 0,
  });
  const [startTime, setStartGame] = useState<number>(Date.now());

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const prevStateRef = useRef<CardState>("playing");

  const progress =
    (currentIndex + 1) / (currentSession?.sessionWords?.length || 0);
  const isLastQuestion =
    currentIndex === (currentSession?.sessionWords?.length || 0) - 1;

  useEffect(() => {
    startSession(SESSION_TYPES.MCQ);
  }, []);

  useEffect(() => {
    setCurrentWord(currentSession?.sessionWords?.[currentIndex] || null);
  }, [currentIndex]);

  // Animation when state changes - only handle summary state transition here
  // since other transitions are managed in their respective handlers
  useEffect(() => {
    if (cardState !== prevStateRef.current) {
      // Only animate automatically if we're not in the middle of a managed transition
      // (meaning we're not transitioning from playing→review or review→playing)
      const isUnmanagedTransition =
        !(prevStateRef.current === "playing" && cardState === "review") &&
        !(prevStateRef.current === "review" && cardState === "playing");

      if (isUnmanagedTransition) {
        // Animate out
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Reset animation values for animating in
          slideAnim.setValue(30);

          // Animate in
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }

      // Always update the previous state reference
      prevStateRef.current = cardState;
    }
  }, [cardState, fadeAnim, scaleAnim, slideAnim]);

  const handleNext = () => {
    if (isLastQuestion) {
      setGameStats((prev) => ({
        ...prev,
        totalTime: (Date.now() - startTime) / 1000,
      }));
      setCardState("summary");
    } else {
      // Animate out current state
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setCardState("playing");

        // Reset animation values for next question
        slideAnim.setValue(50);

        // Animate in next question
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentWord?.correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(answer);

    // Start fade-out animation first
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Only change state after the fade-out is complete
      setCardState("review");

      // Reset animation values for the review state to animate in
      slideAnim.setValue(20);

      // Animate in the review state
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const playAgain = () => {
    // Animate out summary
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(0);
      setScore(0);
      setCardState("playing");
      setStartGame(Date.now());

      // Reset animation values for new game
      slideAnim.setValue(30);

      // Animate in new game
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  if (!currentWord) return null;

  const renderGameContent = () => {
    switch (cardState) {
      case "playing":
        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateX: slideAnim }
              ],
            }}
          >
            <QuestionCard
              currentIndex={currentIndex}
              word={currentWord}
              wordCount={currentSession?.sessionWords?.length || 0}
              progress={progress}
              score={score}
              colors={colors}
              handleAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
            />
          </Animated.View>
        );

      case "review":
        return (
          <Animated.View
            style={[
              styles.feedbackContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateX: slideAnim }
                ],
              }
            ]}
          >
            <Card
              style={[
                styles.feedbackCard,
                {
                  backgroundColor: colors.surface,
                  borderTopWidth: 6,
                  borderTopColor:
                    selectedAnswer === currentWord?.correctAnswer
                      ? colors.progress
                      : colors.error,
                },
              ]}
            >
              <Card.Content>
                <View style={styles.feedbackContentContainer}>
                  <View style={styles.feedbackIconContainer}>
                    <IconButton
                      icon={
                        selectedAnswer === currentWord?.correctAnswer
                          ? "check-circle"
                          : "close-circle"
                      }
                      iconColor={
                        selectedAnswer === currentWord?.correctAnswer
                          ? colors.progress
                          : colors.error
                      }
                      size={32}
                    />
                  </View>
                  <View style={styles.feedbackTextContainer}>
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.feedbackTitle,
                        {
                          color:
                            selectedAnswer === currentWord?.correctAnswer
                              ? colors.progress
                              : colors.error,
                        },
                      ]}
                    >
                      {selectedAnswer === currentWord?.correctAnswer
                        ? "Correct!"
                        : "Incorrect"}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.feedbackMessage,
                        { color: colors.onSurface },
                      ]}
                    >
                      {selectedAnswer === currentWord?.correctAnswer
                        ? "Well done! Keep up the good work."
                        : `The correct answer is: ${currentWord?.correctAnswer}`}
                    </Text>

                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.feedbackMessage,
                        {
                          color: colors.onSurface,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginTop: 12,
                        },
                      ]}
                    >
                      Word: {currentWord?.word}
                    </Text>
                  </View>
                </View>

                {currentWord && <WordMasteryProgress word={currentWord.word} />}

                {selectedAnswer === currentWord?.correctAnswer && (
                  <View style={styles.sentencePromptContainer}>
                    <Text variant="titleMedium" style={styles.promptTitle}>
                      Want to practice in a sentence?
                    </Text>
                    <View style={styles.sentencePromptButtons}>
                      <Button
                        mode="contained"
                        onPress={() => {
                          navigation.navigate("SentenceSage" as never);
                        }}
                        style={styles.sentencePromptButton}
                      >
                        Practice Now
                      </Button>
                    </View>
                  </View>
                )}
              </Card.Content>
              <Card.Actions
                style={{
                  marginTop: 16,
                  marginBottom: 8,
                  marginLeft: 8,
                  marginRight: 8,
                }}
              >
                <Button
                  mode="contained"
                  onPress={handleNext}
                  style={[styles.nextButton]}
                  contentStyle={{ height: 48 }}
                >
                  {isLastQuestion ? "See Summary" : "Next Question"}
                </Button>
              </Card.Actions>
            </Card>
          </Animated.View>
        );

      case "summary":
        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateX: slideAnim }
              ],
            }}
          >
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.summaryTitle}>
                  Quiz Complete!
                </Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text variant="titleMedium">Score</Text>
                    <Text
                      variant="headlineSmall"
                      style={{ color: colors.primary }}
                    >
                      {score}/{currentSession?.sessionWords?.length || 0}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text variant="titleMedium">Time</Text>
                    <Text
                      variant="headlineSmall"
                      style={{ color: colors.primary }}
                    >
                      {Math.round(gameStats.totalTime)}s
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text variant="titleMedium">Mastery Gained</Text>
                    <Text
                      variant="headlineSmall"
                      style={{ color: colors.primary }}
                    >
                      +{Math.round(gameStats.masteryGained)}%
                    </Text>
                  </View>
                </View>
                <Button
                  mode="contained"
                  onPress={playAgain}
                  style={styles.restartButton}
                >
                  Play Again
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: "100%", justifyContent: "center" },
        ]}
      >
        {renderGameContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    textAlign: "center",
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scoreText: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 20,
  },
  card: {
    elevation: 4,
  },
  wordText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    minHeight: 50,
    justifyContent: "center",
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    flexWrap: "wrap",
  },
  feedbackContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  feedbackCard: {
    width: "100%",
    borderRadius: 12,
  },
  feedbackContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  feedbackIconContainer: {
    marginRight: 12,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  feedbackMessage: {
    opacity: 0.87,
  },
  nextButton: {
    borderRadius: 8,
  },
  sentencePromptContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  sentencePromptButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  sentencePromptButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  promptTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  summaryCard: {
    padding: 16,
    margin: 16,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  restartButton: {
    marginTop: 16,
  },
});

export default MultipleChoice;
