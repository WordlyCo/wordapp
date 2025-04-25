import { Button, Text, IconButton, Card } from "react-native-paper";
import { Animated, StyleSheet, View } from "react-native";
import { useStore } from "@/src/stores/store";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { DIFFICULTY_LEVELS } from "@/src/stores/enums";
import * as Haptics from "expo-haptics";

type TimeType = {
  seconds: number;
  minutes: number;
};

const SummaryScreen = () => {
  const { colors } = useAppTheme();
  const score = useStore((state) => state.quizStats.score);
  const quizWords = useStore((state) => state.quizWords);
  const isFetchingDailyQuiz = useStore((state) => state.isFetchingDailyQuiz);
  const fetchDailyQuiz = useStore((state) => state.fetchDailyQuiz);
  const setQuizStats = useStore((state) => state.setQuizStats);
  const totalTime = useStore((state) => state.quizStats.totalTime);
  const answerResults = useStore((state) => state.quizStats.answerResults);
  const userStats = useStore((state) => state.user?.userStats);
  const updatePracticeTime = useStore((state) => state.updatePracticeTime);
  const [diamondsEarned, setDiamondsEarned] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const numberOfWords = quizWords.length || 0;
  const [scorePercentage, setScorePercentage] = useState(
    (score / numberOfWords) * 100
  );

  useEffect(() => {
    if (totalTime > 0) {
      const practiceMinutes = Math.ceil(totalTime / 60);
      updatePracticeTime(practiceMinutes);
    }

    let totalDiamonds = 0;
    quizWords.forEach((word, index) => {
      if (answerResults[index]) {
        switch (word.difficultyLevel) {
          case DIFFICULTY_LEVELS.BEGINNER:
            totalDiamonds += 1;
            break;
          case DIFFICULTY_LEVELS.INTERMEDIATE:
            totalDiamonds += 2;
            break;
          case DIFFICULTY_LEVELS.ADVANCED:
            totalDiamonds += 3;
            break;
          default:
            totalDiamonds += 1;
        }
      }
    });
    setDiamondsEarned(totalDiamonds);

    const actualScore = Object.values(
      useStore.getState().quizStats.answerResults
    ).filter((result) => result === true).length;

    if (actualScore !== score) {
      setQuizStats({
        ...useStore.getState().quizStats,
        score: actualScore,
      });
      setScorePercentage((actualScore / numberOfWords) * 100);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: (actualScore / numberOfWords) * 100,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    // Cleanup function that runs when component unmounts
    return () => {
      setQuizStats({
        score: 0,
        totalTime: 0,
        correctAnswers: 0,
        currentIndex: 0,
        selectedAnswer: "",
        startTime: Date.now(),
        answerResults: {},
      });
    };
  }, []);

  const playAgain = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await fetchDailyQuiz();
    setQuizStats({
      score: 0,
      totalTime: 0,
      correctAnswers: 0,
      currentIndex: 0,
      selectedAnswer: "",
      startTime: Date.now(),
      answerResults: {},
    });
    router.replace({
      pathname: "/(protected)/quiz",
    });
  };

  const goHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace({
      pathname: "/(protected)/(tabs)/home",
    });
  };

  const convertSecondsToMinutes = (seconds: number): TimeType => {
    if (seconds < 60) {
      return { seconds: 0, minutes: 1 };
    }

    const minutes = seconds / 60;
    const final_seconds = seconds % 60;

    return {
      seconds: final_seconds,
      minutes,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <View style={styles.cardWrapper}>
          <Card
            style={[styles.summaryCard, { backgroundColor: colors.background }]}
            elevation={4}
          >
            <View style={styles.confettiContainer}>
              <IconButton
                icon="party-popper"
                size={32}
                iconColor={colors.secondary}
              />
            </View>

            <Card.Content style={styles.cardContent}>
              <Text
                variant="headlineMedium"
                style={[styles.summaryTitle, { color: colors.onSurface }]}
              >
                Quiz Complete!
              </Text>

              <View style={styles.scoreCircleContainer}>
                <View
                  style={[
                    styles.scoreCircle,
                    {
                      borderColor:
                        scorePercentage > 70
                          ? colors.primary
                          : colors.secondary,
                    },
                  ]}
                >
                  <Text style={[styles.scoreText, { color: colors.onSurface }]}>
                    {score}/{numberOfWords}
                  </Text>
                  <Text
                    style={[
                      styles.scoreLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Score
                  </Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <IconButton
                    icon="clock-outline"
                    size={28}
                    iconColor={colors.primary}
                    style={styles.statIcon}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Time
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: colors.primary }}
                  >
                    {Math.round(convertSecondsToMinutes(totalTime).minutes)}m{" "}
                    {Math.round(convertSecondsToMinutes(totalTime).seconds)}s
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <IconButton
                    icon="diamond"
                    size={28}
                    iconColor={colors.info}
                    style={styles.statIcon}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Diamonds
                  </Text>
                  <Text variant="headlineSmall" style={{ color: colors.info }}>
                    +{diamondsEarned}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <IconButton
                    icon="lightning-bolt"
                    size={28}
                    iconColor={colors.streak}
                    style={styles.statIcon}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Streak
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: colors.streak }}
                  >
                    {userStats?.streak}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  mode="contained"
                  onPress={playAgain}
                  style={[styles.button, styles.primaryButton]}
                  contentStyle={styles.buttonContent}
                  icon="replay"
                  loading={isFetchingDailyQuiz}
                >
                  Play Again
                </Button>

                <Button
                  mode="outlined"
                  onPress={goHome}
                  style={[styles.button, { borderColor: colors.outline }]}
                  contentStyle={styles.buttonContent}
                  icon="home"
                  textColor={colors.primary}
                >
                  Home
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  contentContainer: {
    justifyContent: "center",
  },
  summaryCard: {
    width: "100%",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  confettiContainer: {
    position: "absolute",
    top: 4,
    right: 0,
    zIndex: 1,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scoreCircleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  statIcon: {
    margin: 0,
    marginBottom: 4,
  },
  actionButtons: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    borderRadius: 12,
  },
  primaryButton: {
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cardWrapper: {
    overflow: "hidden",
    borderRadius: 16,
  },
});

export default SummaryScreen;
