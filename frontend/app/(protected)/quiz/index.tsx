import {
  Animated as RNAnimated,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Card,
  IconButton,
  Button,
  ActivityIndicator,
  FAB,
} from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import React, { useEffect, useState, useRef } from "react";
import { OptionButton, ProgressDots } from "@/src/features/quiz/components";
import { shuffleArray } from "@/lib/utils";
import { useStore } from "@/src/stores/store";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { router } from "expo-router";
import { Word } from "@/src/types/words";
import { DIFFICULTY_LEVELS } from "@/src/stores/enums";
import Ionicons from "@expo/vector-icons/Ionicons";

const QuestionScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(20)).current;
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
  const updateAccuracy = useStore((state) => state.updateAccuracy);
  const fetchMe = useStore((state) => state.getMe);
  const isFetchingUser = useStore((state) => state.isFetchingUser);

  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  const [, setQuizStartTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentWord(quizWords.find((_, index) => index === currentIndex));
  }, [currentIndex, quizWords]);

  useEffect(() => {
    if (!isFetchingUser) {
      fetchMe();
    }
    setQuizStartTime(Date.now());
  }, [fetchMe, setQuizStartTime]);

  const wordCount = quizWords.length;

  useEffect(() => {
    if (currentWord && currentWord.quiz?.options) {
      setRandomizedOptions(shuffleArray(currentWord.quiz.options));

      fadeAnim.setValue(0);
      slideAnim.setValue(20);

      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentWord, currentIndex, setRandomizedOptions]);

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

    if (isCorrect) {
      // no haptic feedback for correct answers here, instead
      // we'll provide haptic feedback for rewards in the feedback screen
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

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
      let diamonds = 0;
      switch (currentWord.difficultyLevel) {
        case DIFFICULTY_LEVELS.BEGINNER:
          diamonds = 1;
          break;
        case DIFFICULTY_LEVELS.INTERMEDIATE:
          diamonds = 2;
          break;
        case DIFFICULTY_LEVELS.ADVANCED:
          diamonds = 3;
          break;
        default:
          diamonds = 1;
      }

      updateDiamonds(diamonds);
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

    updateWordProgress(wordProgressUpdate);

    router.replace("/(protected)/quiz/feedback");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <View style={styles.progressInfoContainer}>
          <Text style={[styles.progressText, { color: colors.onBackground }]}>
            Word {currentIndex + 1} of {wordCount}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <IconButton
                icon="diamond"
                size={20}
                iconColor={colors.info}
                style={styles.statIcon}
              />
              <View style={styles.valueContainer}>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  {useStore.getState().user?.userStats?.diamonds || 0}
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <IconButton
                icon="lightning-bolt"
                size={20}
                iconColor={colors.streak}
                style={styles.statIcon}
              />
              <View style={styles.valueContainer}>
                <Text style={[styles.statValue, { color: colors.streak }]}>
                  {useStore.getState().user?.userStats?.streak || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ProgressDots
          totalDots={wordCount}
          currentIndex={currentIndex}
          answerResults={answerResults}
          dotsScrollViewRef={dotsScrollViewRef}
          pulseAnim={new RNAnimated.Value(1)}
          colors={colors}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>
          <RNAnimated.View
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
                },
              ]}
              elevation={2}
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
                    Question
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
                  <RNAnimated.View
                    style={{
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: RNAnimated.multiply(
                            slideAnim,
                            new RNAnimated.Value(1 + index * 0.3)
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
                  </RNAnimated.View>
                </View>
              ))}
            </View>
          </RNAnimated.View>
        </View>
      </ScrollView>

      <Animated.View
        style={styles.fab}
        entering={FadeIn.duration(400).springify()}
        exiting={FadeOut.duration(20).springify()}
      >
        <FAB
          icon="arrow-left"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          color={"white"}
          uppercase={false}
        />
      </Animated.View>
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24, // Fixed height to prevent layout shifts
  },
  statValue: {
    fontSize: 16,
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
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 16,
    borderRadius: 28,
    elevation: 1,
    zIndex: 999,
  },
});

export default QuestionScreen;
