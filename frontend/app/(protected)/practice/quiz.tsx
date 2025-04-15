import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, ScrollView, StyleSheet, Animated} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Button, IconButton } from "react-native-paper";
import useTheme from "@/src/hooks/useTheme";
import QuestionCard from "@/src/components/QuestionCard";
import { useStore } from "@/src/stores/store";
import { Word } from "@/src/types/words";
import SummaryState from "@/src/features/practice/components/SummaryState";
import FeedbackState from "@/src/features/practice/components/FeedbackState";
import useQuizTransition from "@/src/features/practice/hooks/useQuizTransition";

type CardState = "question" | "feedback" | "summary";

type GameStats = {
  correctAnswers: number;
  totalTime: number;
  masteryGained: number;
};

const Quiz = () => {
  const { colors } = useTheme();
  const { slideAnim, animateOut, animateIn, resetAnimations } =
    useQuizTransition();

  const quizWords: Word[] = useStore((state) => state.quizWords);
  const fetchDailyQuiz = useStore((state) => state.fetchDailyQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [cardState, setCardState] = useState<CardState>("question");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameStats, setGameStats] = useState<GameStats>({
    correctAnswers: 0,
    totalTime: 0,
    masteryGained: 0,
  });

  const staticAnimValues = useMemo(
    () => ({
      fadeAnim: new Animated.Value(1),
      scaleAnim: new Animated.Value(1),
    }),
    []
  );

  const progress = 5;

  console.log("quizWords", JSON.stringify(quizWords, null, 2));

  useEffect(() => {
    fetchDailyQuiz();
  }, [fetchDailyQuiz]);

  useEffect(() => {
    setCurrentWord(quizWords?.[currentIndex] || null);
  }, [currentIndex, quizWords]);

  if (!quizWords || !currentWord) return null;

  const handleNext = () => {
    const isLastQuestion = currentIndex === quizWords.length - 1;

    animateOut(() => {
      resetAnimations();

      if (isLastQuestion) {
        setGameStats((prev) => ({
          ...prev,
          correctAnswers: score,
          totalTime: (Date.now() - startTime) / 1000,
        }));
        setCardState("summary");
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer("");
        setCardState("question");
      }

      setTimeout(() => {
        slideAnim.setValue(20);
        animateIn();
      }, 50);
    });
  };

  const handleAnswer = (answer: string) => {
    if (currentWord?.quiz?.correctOptions.includes(answer)) {
      setScore(score + 1);
    }
    setSelectedAnswer(answer);

    animateOut(() => {
      resetAnimations();
      setCardState("feedback");
      setTimeout(() => {
        slideAnim.setValue(20);
        animateIn();
      }, 50);
    });
  };

  const playAgain = () => {
    animateOut(
      () => {
        resetAnimations();

        setCurrentIndex(0);
        setScore(0);
        setCardState("question");
        setStartTime(Date.now());

        setTimeout(() => {
          slideAnim.setValue(20);
          animateIn();
        }, 50);
      },
      {
        duration: 300,
        fadeValue: 0,
        slideValue: -30,
      }
    );
  };

  const commonProps = {
    colors,
    currentWord,
    quizWords,
  };

  if (!quizWords || quizWords.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.headerText}>No quiz words available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
         <SafeAreaView
        style={[styles.safeAreaView, { backgroundColor: colors.background }]}
        edges={["top"]}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: "100%", justifyContent: "center" },
        ]}
      >
        {cardState === "question" && (
          <QuestionCard
            currentIndex={currentIndex}
            word={currentWord}
            wordCount={quizWords.length}
            progress={progress}
            score={score}
            colors={colors}
            handleAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
          />
        )}
        {cardState === "feedback" && (
          <FeedbackState
            {...commonProps}
            fadeAnim={staticAnimValues.fadeAnim}
            scaleAnim={staticAnimValues.scaleAnim}
            slideAnim={slideAnim}
            selectedAnswer={selectedAnswer}
            currentIndex={currentIndex}
            numberOfWords={quizWords.length}
            handleNext={handleNext}
          />
        )}
        {cardState === "summary" && (
          <SummaryState
            {...commonProps}
            numberOfWords={quizWords.length}
            score={score}
            gameStats={gameStats}
            fadeAnim={staticAnimValues.fadeAnim}
            scaleAnim={staticAnimValues.scaleAnim}
            slideAnim={slideAnim}
            playAgain={playAgain}
          />
        )}
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
  safeAreaView: {
    flex: 1,
  },
});

export default Quiz;
