import { Animated, View, Text, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  IconButton,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import React, { useEffect, useState, useRef } from "react";
import { OptionButton, ProgressDots } from "@/src/features/quiz/components";
import { shuffleArray } from "@/lib/utils";
import { useStore } from "@/src/stores/store";
import useTheme from "@/src/hooks/useTheme";
import { router } from "expo-router";
import { Word } from "@/src/types/words";
import { DIFFICULTY_LEVELS } from "@/src/stores/enums";
import Ionicons from "@expo/vector-icons/Ionicons";

const QuestionScreen: React.FC = () => {
  const { colors } = useTheme();
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotsScrollViewRef = useRef<ScrollView>(null);

  const quizWords = useStore((state) => state.quizWords);
  const quizWordsError = useStore((state) => state.quizWordsError);
  const quizStats = useStore((state) => state.quizStats);
  const setQuizStats = useStore((state) => state.setQuizStats);
  const currentIndex = useStore((state) => state.quizStats.currentIndex);
  const score = useStore((state) => state.quizStats.score);
  const selectedAnswer = useStore((state) => state.quizStats.selectedAnswer);
  const answerResults = useStore((state) => state.quizStats.answerResults);
  const updateWordProgress = useStore((state) => state.updateWordProgress);
  const updateDiamonds = useStore((state) => state.updateDiamonds);
  const updateStreak = useStore((state) => state.updateStreak);
  const updateAccuracy = useStore((state) => state.updateAccuracy);
  const fetchMe = useStore((state) => state.getMe);

  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  const [, setQuizStartTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentWord(quizWords.find((_, index) => index === currentIndex));
  }, [currentIndex, quizWords]);

  useEffect(() => {
    fetchMe();
    setQuizStartTime(Date.now());
  }, [fetchMe, setQuizStartTime]);

  const wordCount = quizWords.length;

  useEffect(() => {
    if (currentWord && currentWord.quiz?.options) {
      setRandomizedOptions(shuffleArray(currentWord.quiz.options));

      fadeAnim.setValue(0);
      slideAnim.setValue(20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentWord, currentIndex, setRandomizedOptions]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (quizWordsError) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorText, { color: colors.onBackground }]}>
          You don't have any word lists yet!
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
          Add Word Lists
        </Button>
      </View>
    );
  }

  if (!currentWord) {
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

  const handleAnswer = async (answer: string) => {
    const isCorrect = !!currentWord?.quiz?.correctOptions.includes(answer);

    const updatedAnswerResults = { ...answerResults };
    updatedAnswerResults[currentIndex] = isCorrect;

    setQuizStats({
      ...quizStats,
      selectedAnswer: answer,
      answerResults: updatedAnswerResults,
      ...(isCorrect && {
        score: score + 1,
        correctAnswers: quizStats.correctAnswers + 1,
      }),
    });

    updateAccuracy(isCorrect);

    if (isCorrect) {
      let diamondReward = 0;
      switch (currentWord.difficultyLevel) {
        case DIFFICULTY_LEVELS.BEGINNER:
          diamondReward = 1;
          break;
        case DIFFICULTY_LEVELS.INTERMEDIATE:
          diamondReward = 2;
          break;
        case DIFFICULTY_LEVELS.ADVANCED:
          diamondReward = 3;
          break;
        default:
          diamondReward = 1;
      }

      updateDiamonds(diamondReward);
    }

    const wordProgressUpdate = {
      wordId: currentWord.id,
      practiceCount: (currentWord.wordProgress?.practiceCount || 0) + 1,
      lastPracticed: new Date(),
      successCount: isCorrect
        ? (currentWord.wordProgress?.successCount || 0) + 1
        : currentWord.wordProgress?.successCount || 0,
      recognitionMasteryScore: isCorrect
        ? (currentWord.wordProgress?.recognitionMasteryScore || 0) + 1
        : currentWord.wordProgress?.recognitionMasteryScore || 0,
      usageMasteryScore: isCorrect
        ? (currentWord.wordProgress?.usageMasteryScore || 0) + 1
        : currentWord.wordProgress?.usageMasteryScore || 0,
      numberOfTimesToPractice:
        currentWord.wordProgress?.numberOfTimesToPractice || 0,
    };

    if (isCorrect && wordProgressUpdate.numberOfTimesToPractice > 0) {
      wordProgressUpdate.numberOfTimesToPractice -= 1;
    }

    await updateWordProgress(wordProgressUpdate);
    updateStreak();

    router.replace("/(protected)/quiz/feedback");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <View style={styles.progressInfoContainer}>
          <Text style={[styles.progressText, { color: colors.onBackground }]}>
            Word {currentIndex + 1} of {wordCount}
          </Text>
          <Text style={[styles.scoreText, { color: colors.primary }]}>
            Score: {score}/{wordCount}
          </Text>
        </View>

        <ProgressDots
          totalDots={wordCount}
          currentIndex={currentIndex}
          answerResults={answerResults}
          dotsScrollViewRef={dotsScrollViewRef}
          pulseAnim={pulseAnim}
          colors={colors}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  shadowColor: colors.primary,
                },
              ]}
              elevation={4}
            >
              <View style={styles.cardWrapper}>
                <View style={styles.questionIconContainer}>
                  <IconButton
                    icon="help-circle"
                    iconColor={colors.primary}
                    size={28}
                  />
                </View>
                <Card.Content style={styles.questionContent}>
                  <Text
                    style={[styles.questionLabel, { color: colors.primary }]}
                  >
                    Question:
                  </Text>
                  <Text
                    style={[styles.questionText, { color: colors.onSurface }]}
                  >
                    {currentWord.quiz?.question}
                  </Text>
                </Card.Content>
              </View>
            </Card>

            <View style={styles.optionsContainer}>
              {randomizedOptions.map((option: string, index: number) => (
                <View key={index}>
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: Animated.multiply(
                            slideAnim,
                            new Animated.Value(1 + index * 0.3)
                          ),
                        },
                      ],
                    }}
                  >
                    <OptionButton
                      onPress={() => handleAnswer(option)}
                      disabled={false}
                      isCorrect={
                        currentWord.quiz?.correctOptions.includes(option) ||
                        false
                      }
                      isSelected={selectedAnswer === option}
                      showAnswer={false}
                      colors={colors}
                    >
                      {option}
                    </OptionButton>
                  </Animated.View>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  progressInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 16,
  },
  progressText: {
    fontSize: 15,
    fontWeight: "500",
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  questionContainer: {
    gap: 46,
    paddingHorizontal: 16,
    marginTop: 46,
    justifyContent: "center",
  },
  card: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionIconContainer: {
    position: "absolute",
    right: 5,
    zIndex: 1,
  },
  questionContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  questionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  wordText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 14,
    marginTop: 40,
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
  cardWrapper: {
    overflow: "hidden",
    borderRadius: 16,
  },
});

export default QuestionScreen;
