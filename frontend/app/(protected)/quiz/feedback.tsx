import {
  Button,
  Text,
  Divider,
  Chip,
  FAB,
  Card,
  IconButton,
  Portal,
} from "react-native-paper";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated as RNAnimated,
} from "react-native";
import { DifficultyLevel, DIFFICULTY_LEVELS } from "@/src/types/enums";
import { useStore } from "@/src/stores/store";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Word } from "@/src/types/words";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getDifficultyColor = (difficulty: DifficultyLevel, colors: any) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return colors.beginner || "#4CAF50"; // Green
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return colors.intermediate || "#2196F3"; // Blue
    case DIFFICULTY_LEVELS.ADVANCED:
      return colors.advanced || "#FF9800"; // Orange
    default:
      return colors.beginner || "#4CAF50";
  }
};

const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return "Beginner";
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return "Intermediate";
    case DIFFICULTY_LEVELS.ADVANCED:
      return "Advanced";
    default:
      return "Beginner";
  }
};

const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith("rgba")) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }

  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
  }

  if (color.startsWith("#")) {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  return `rgba(0, 0, 0, ${opacity})`;
};

const getDifficultyIcon = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.BEGINNER:
      return "signal-cellular-1";
    case DIFFICULTY_LEVELS.INTERMEDIATE:
      return "signal-cellular-2";
    case DIFFICULTY_LEVELS.ADVANCED:
      return "signal-cellular-3";
    default:
      return "signal-cellular-1";
  }
};

const FeedbackScreen = () => {
  const { colors } = useAppTheme();
  const quizWords = useStore((state) => state.quizWords);
  const currentIndex = useStore((state) => state.quizStats.currentIndex);
  const selectedAnswer = useStore((state) => state.quizStats.selectedAnswer);
  const quizStats = useStore((state) => state.quizStats);
  const startTime = useStore((state) => state.quizStats.startTime);
  const setQuizStats = useStore((state) => state.setQuizStats);
  const correctAnswers = useStore(
    (state) => state.quizStats.correctAnswers || 0
  );
  const isFirstCorrectAnswer = correctAnswers === 1;

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [currentDiamonds, setCurrentDiamonds] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [diamondReward, setDiamondReward] = useState(0);
  const [streakIncreased, setStreakIncreased] = useState(false);
  const [showDiamondReward, setShowDiamondReward] = useState(false);
  const [showStreakReward, setShowStreakReward] = useState(false);

  const diamondScaleAnim = useRef(new RNAnimated.Value(1)).current;
  const streakScaleAnim = useRef(new RNAnimated.Value(1)).current;
  const rewardScaleAnim = useRef(new RNAnimated.Value(0)).current;
  const streakIncrementAnim = useRef(new RNAnimated.Value(0)).current;

  const hapticTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const numberOfWords = quizWords.length || 0;

  const scheduleHapticFeedback = (
    feedbackFunction: () => Promise<void>,
    delay: number
  ) => {
    const timeout = setTimeout(() => {
      feedbackFunction();
    }, delay);

    hapticTimeoutsRef.current.push(timeout);
    return timeout;
  };

  useEffect(() => {
    return () => {
      hapticTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      hapticTimeoutsRef.current = [];
    };
  }, []);

  const checkStreakUpdatedToday = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const lastStreakUpdate = await AsyncStorage.getItem("lastStreakUpdate");

      if (lastStreakUpdate === today) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error checking streak update:", error);
      return false;
    }
  };

  const markStreakAsUpdated = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem("lastStreakUpdate", today);
    } catch (error) {
      console.log("Error setting streak update:", error);
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      const word = quizWords.find((w, index) => index === currentIndex);
      if (word) {
        setCurrentWord(word);
      } else {
        console.error("Word not found for currentIndex:", currentIndex);
      }

      const userStats = useStore.getState().user?.userStats;
      const diamonds = userStats?.diamonds || 0;
      const streak = userStats?.streak || 0;

      setCurrentDiamonds(diamonds);
      setCurrentStreak(streak);

      const isCorrect =
        word?.quiz?.correctOptions.includes(selectedAnswer) || false;

      if (isCorrect && word) {
        let reward = 0;
        switch (word.difficultyLevel) {
          case DIFFICULTY_LEVELS.BEGINNER:
            reward = 1;
            break;
          case DIFFICULTY_LEVELS.INTERMEDIATE:
            reward = 2;
            break;
          case DIFFICULTY_LEVELS.ADVANCED:
            reward = 3;
            break;
          default:
            reward = 1;
        }
        setDiamondReward(reward);

        if (isFirstCorrectAnswer) {
          const alreadyUpdated = await checkStreakUpdatedToday();
          if (!alreadyUpdated) {
            setStreakIncreased(true);
            markStreakAsUpdated();
          } else {
            setStreakIncreased(false);
          }
        } else {
          setStreakIncreased(false);
        }
      }

      const animationTimeout = setTimeout(() => {
        setShowAnimation(true);

        if (isCorrect) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          if (diamondReward > 0) {
            setShowDiamondReward(true);

            scheduleHapticFeedback(
              () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
              200
            );
          }

          RNAnimated.sequence([
            RNAnimated.timing(diamondScaleAnim, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            RNAnimated.timing(diamondScaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();

          RNAnimated.sequence([
            RNAnimated.timing(rewardScaleAnim, {
              toValue: 1.3,
              duration: 300,
              useNativeDriver: true,
            }),
            RNAnimated.timing(rewardScaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            const hideTimeout = setTimeout(() => {
              setShowDiamondReward(false);
            }, 800);
            hapticTimeoutsRef.current.push(hideTimeout);
          });

          if (streakIncreased) {
            setShowStreakReward(true);

            const streakAnimTimeout = setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

              RNAnimated.sequence([
                RNAnimated.timing(streakScaleAnim, {
                  toValue: 1.2,
                  duration: 200,
                  useNativeDriver: true,
                }),
                RNAnimated.timing(streakScaleAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();

              RNAnimated.sequence([
                RNAnimated.timing(streakIncrementAnim, {
                  toValue: 1.3,
                  duration: 300,
                  useNativeDriver: true,
                }),
                RNAnimated.timing(streakIncrementAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                const hideStreakTimeout = setTimeout(() => {
                  setShowStreakReward(false);
                }, 800);
                hapticTimeoutsRef.current.push(hideStreakTimeout);
              });
            }, 600);

            hapticTimeoutsRef.current.push(streakAnimTimeout);
          }
        }
      }, 400);

      hapticTimeoutsRef.current.push(animationTimeout);
    };

    initializeComponent();
  }, [currentIndex, quizWords]);

  if (!currentWord) return null;

  const isCorrect =
    currentWord?.quiz?.correctOptions.includes(selectedAnswer) || false;
  const difficultyColor = getDifficultyColor(
    currentWord.difficultyLevel,
    colors
  );

  const handleNext = async () => {
    const isLastQuestion = currentIndex === quizWords.length - 1;

    if (isLastQuestion) {
      setQuizStats({
        ...quizStats,
        totalTime: (Date.now() - startTime) / 1000,
      });
      router.replace("/(protected)/quiz/summary");
    } else {
      setQuizStats({
        ...quizStats,
        currentIndex: currentIndex + 1,
        selectedAnswer: "",
      });
      router.replace("/(protected)/quiz");
    }
  };

  return (
    <ScrollView style={[styles.container]}>
      {/* Stats header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <IconButton
            icon="diamond"
            size={20}
            iconColor={colors.info}
            style={styles.statIcon}
          />
          <RNAnimated.View
            style={[
              styles.valueContainer,
              { transform: [{ scale: diamondScaleAnim }] },
              showAnimation && isCorrect ? styles.glowInfo : {},
            ]}
          >
            <Text style={[styles.statValue, { color: colors.info }]}>
              {currentDiamonds}
            </Text>

            {showAnimation &&
              isCorrect &&
              diamondReward > 0 &&
              showDiamondReward && (
                <RNAnimated.View
                  style={[
                    styles.rewardContainer,
                    {
                      opacity: rewardScaleAnim,
                      transform: [{ scale: rewardScaleAnim }],
                    },
                  ]}
                >
                  <Text style={[styles.statIncrement, { color: colors.info }]}>
                    +{diamondReward}
                  </Text>
                </RNAnimated.View>
              )}
          </RNAnimated.View>
        </View>

        <View style={styles.statItem}>
          <IconButton
            icon="lightning-bolt"
            size={20}
            iconColor={colors.streak}
            style={styles.statIcon}
          />
          <RNAnimated.View
            style={[
              styles.valueContainer,
              { transform: [{ scale: streakScaleAnim }] },
              showAnimation && isCorrect && streakIncreased
                ? styles.glowStreak
                : {},
            ]}
          >
            <Text style={[styles.statValue, { color: colors.streak }]}>
              {currentStreak}
            </Text>

            {showAnimation &&
              isCorrect &&
              streakIncreased &&
              showStreakReward && (
                <RNAnimated.View
                  style={[
                    styles.rewardContainer,
                    {
                      opacity: streakIncrementAnim,
                      transform: [{ scale: streakIncrementAnim }],
                    },
                  ]}
                >
                  <Text
                    style={[styles.statIncrement, { color: colors.streak }]}
                  >
                    +1
                  </Text>
                </RNAnimated.View>
              )}
          </RNAnimated.View>
        </View>
      </View>

      <View style={{ paddingBottom: 80 }}>
        <View style={styles.cardWrapper}>
          <Card
            style={[
              styles.feedbackCard,
              {
                backgroundColor: colors.surface,
                borderTopWidth: 0,
              },
            ]}
            elevation={2}
          >
            <Card.Content>
              <View style={styles.feedbackContentContainer}>
                <View style={styles.feedbackIconContainer}>
                  <View
                    style={[
                      styles.iconSurface,
                      {
                        backgroundColor: isCorrect
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                      },
                    ]}
                  >
                    <IconButton
                      icon={isCorrect ? "check-circle" : "close-circle"}
                      iconColor={isCorrect ? colors.secondary : colors.error}
                      size={36}
                    />
                  </View>
                </View>
                <View style={styles.feedbackTextContainer}>
                  <Text
                    variant="headlineSmall"
                    style={[
                      styles.feedbackTitle,
                      { color: isCorrect ? colors.secondary : colors.error },
                    ]}
                  >
                    {isCorrect ? "Excellent!" : "Not Quite"}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.feedbackMessage,
                      { color: colors.onSurface },
                    ]}
                  >
                    {isCorrect
                      ? "Well done! Keep up the good work."
                      : `The correct answer is: ${currentWord?.quiz?.correctOptions[0]}`}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <Card
          style={[styles.wordInfoCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardWrapper}>
            <Card.Content style={styles.wordInfoContent}>
              <View style={styles.wordTitleRow}>
                <View style={styles.wordHeaderContainer}>
                  <Text variant="headlineSmall" style={styles.wordTitle}>
                    {currentWord.word}
                  </Text>
                  <View style={styles.difficultyContainer}>
                    <IconButton
                      icon={getDifficultyIcon(currentWord.difficultyLevel)}
                      size={16}
                      iconColor={difficultyColor}
                      style={styles.difficultyIcon}
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.difficultyText,
                        { color: difficultyColor },
                      ]}
                    >
                      {getDifficultyLabel(currentWord.difficultyLevel)}
                    </Text>
                  </View>
                </View>

                <Chip
                  style={[
                    styles.partOfSpeechChip,
                    { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                  ]}
                  textStyle={{ fontStyle: "italic" }}
                >
                  {currentWord.partOfSpeech}
                </Chip>
              </View>

              <View style={styles.masteryProgressContainer}>
                {
                  <View style={styles.simpleMasteryContainer}>
                    <View style={styles.masteryLevelContainer}>
                      <Text variant="labelMedium" style={styles.masteryLabel}>
                        Recognition
                      </Text>
                      <View style={styles.levelIndicatorRow}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <View
                            key={`recognition-${level}`}
                            style={[
                              styles.levelDot,
                              {
                                backgroundColor:
                                  level <=
                                  (currentWord.wordProgress
                                    ?.recognitionMasteryScore || 0)
                                    ? colors.primary
                                    : withOpacity(colors.primary, 0.2),
                              },
                            ]}
                          />
                        ))}
                        <Text
                          variant="titleSmall"
                          style={{ color: colors.primary, marginLeft: 8 }}
                        >
                          {currentWord.wordProgress?.recognitionMasteryScore ||
                            0}
                          /5
                        </Text>
                      </View>
                    </View>

                    <View style={styles.masteryLevelContainer}>
                      <Text variant="labelMedium" style={styles.masteryLabel}>
                        Usage
                      </Text>
                      <View style={styles.levelIndicatorRow}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <View
                            key={`usage-${level}`}
                            style={[
                              styles.levelDot,
                              {
                                backgroundColor:
                                  level <=
                                  (currentWord.wordProgress
                                    ?.usageMasteryScore || 0)
                                    ? colors.secondary
                                    : withOpacity(colors.secondary, 0.2),
                              },
                            ]}
                          />
                        ))}
                        <Text
                          variant="titleSmall"
                          style={{ color: colors.secondary, marginLeft: 8 }}
                        >
                          {currentWord.wordProgress?.usageMasteryScore || 0}/5
                        </Text>
                      </View>
                    </View>
                  </View>
                }
              </View>

              <Divider style={styles.divider} />

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Definition
              </Text>
              <View
                style={[
                  styles.definitionContainer,
                  { backgroundColor: withOpacity(colors.onSurface, 0.05) },
                ]}
              >
                <Text variant="bodyMedium" style={styles.definitionText}>
                  {currentWord.definition}
                </Text>
              </View>

              {currentWord.examples && currentWord.examples.length > 0 && (
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Examples
                  </Text>
                  {currentWord.examples.slice(0, 2).map((example, index) => (
                    <View
                      key={index}
                      style={[
                        styles.exampleSurface,
                        {
                          backgroundColor: withOpacity(colors.onSurface, 0.05),
                        },
                      ]}
                    >
                      <Text variant="bodyMedium" style={styles.exampleText}>
                        "{example}"
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.wordRelationshipsContainer}>
                {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                  <View style={[styles.section, styles.halfSection]}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Synonyms
                    </Text>
                    <View style={styles.pillsContainer}>
                      {currentWord.synonyms
                        .slice(0, 5)
                        .map((synonym, index) => (
                          <Chip
                            key={index}
                            style={[
                              styles.wordPill,
                              {
                                backgroundColor: withOpacity(
                                  colors.secondary,
                                  0.15
                                ),
                              },
                            ]}
                            textStyle={{ color: colors.secondary }}
                          >
                            {synonym}
                          </Chip>
                        ))}
                    </View>
                  </View>
                )}

                {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                  <View style={[styles.section, styles.halfSection]}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Antonyms
                    </Text>
                    <View style={styles.pillsContainer}>
                      {currentWord.antonyms
                        .slice(0, 5)
                        .map((antonym, index) => (
                          <Chip
                            key={index}
                            style={[
                              styles.wordPill,
                              {
                                backgroundColor: withOpacity(
                                  colors.error,
                                  0.15
                                ),
                              },
                            ]}
                            textStyle={{ color: colors.error }}
                          >
                            {antonym}
                          </Chip>
                        ))}
                    </View>
                  </View>
                )}
              </View>

              {currentWord.etymology && (
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Etymology
                  </Text>
                  <View
                    style={[
                      styles.etymologySurface,
                      { backgroundColor: withOpacity(colors.onSurface, 0.05) },
                    ]}
                  >
                    <Text variant="bodyMedium" style={styles.etymologyText}>
                      {currentWord.etymology}
                    </Text>
                  </View>
                </View>
              )}
            </Card.Content>
          </View>
        </Card>

        {isCorrect && (
          <Card
            style={[styles.practiceCard, { backgroundColor: colors.surface }]}
          >
            <Card.Content>
              <View style={styles.sentencePromptContainer}>
                <Text
                  variant="titleMedium"
                  style={[styles.promptTitle, { color: colors.primary }]}
                >
                  Want to practice in a sentence?
                </Text>
                <View style={styles.sentencePromptButtons}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      console.log("WILL IMPLEMENT");
                    }}
                    style={styles.sentencePromptButton}
                    buttonColor={colors.primary}
                    contentStyle={{ height: 48 }}
                    icon="pencil"
                  >
                    Practice Now
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>

      <Portal>
        <FAB
          icon={
            currentIndex === numberOfWords - 1
              ? "flag-checkered"
              : "arrow-right"
          }
          label={
            currentIndex === numberOfWords - 1 ? "See Summary" : "Next Question"
          }
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={handleNext}
          color="#fff"
          uppercase={false}
        />
      </Portal>
    </ScrollView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    paddingTop: 5,
    flex: 1,
  },
  feedbackCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
  },
  wordInfoCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  progressCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  practiceCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  actionsCard: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  feedbackContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  feedbackIconContainer: {
    marginRight: 16,
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
    borderRadius: 24,
    flex: 1,
    elevation: 2,
  },
  sentencePromptContainer: {
    marginVertical: 8,
  },
  sentencePromptButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  sentencePromptButton: {
    flex: 1,
    borderRadius: 24,
    elevation: 2,
  },
  promptTitle: {
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  restartButton: {
    marginTop: 16,
  },
  wordTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  partOfSpeech: {
    fontStyle: "italic",
    fontWeight: "normal",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  section: {
    marginTop: 16,
  },
  halfSection: {
    width: "48%",
  },
  definitionText: {
    lineHeight: 22,
  },
  exampleText: {
    fontStyle: "italic",
    lineHeight: 20,
  },
  wordListText: {
    lineHeight: 20,
  },
  etymologyText: {
    lineHeight: 20,
    fontStyle: "italic",
  },
  divider: {
    marginVertical: 12,
  },
  progressStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "space-between",
  },
  progressStat: {
    width: "48%",
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  statLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  wordHeaderContainer: {
    flex: 1,
  },
  wordMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  partOfSpeechText: {
    fontStyle: "italic",
    opacity: 0.7,
    marginRight: 12,
  },
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyIcon: {
    margin: 0,
    padding: 0,
    marginLeft: -8,
  },
  difficultyText: {
    marginLeft: -4,
    fontSize: 12,
  },
  definitionContainer: {
    padding: 12,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  tagChip: {
    height: 24,
    marginRight: 4,
    marginBottom: 4,
  },
  wordInfoContent: {
    paddingVertical: 16,
  },
  exampleSurface: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  etymologySurface: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  iconSurface: {
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  wordRelationshipsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordPill: {
    marginRight: 4,
    marginBottom: 4,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 16,
    bottom: 16,
    borderRadius: 28,
    elevation: 8,
    zIndex: 999,
  },
  masteryProgressContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  simpleMasteryContainer: {
    flexDirection: "column",
    gap: 8,
  },
  masteryLevelContainer: {
    flexDirection: "column",
  },
  masteryLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  levelIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  partOfSpeechChip: {
    height: 28,
    marginLeft: 8,
  },
  cardWrapper: {
    borderRadius: 12,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    position: "relative",
  },
  rewardContainer: {
    position: "absolute",
    right: -24,
    top: -2,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  statIncrement: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.9,
  },
  glowInfo: {
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  glowStreak: {
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
