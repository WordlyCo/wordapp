import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card, ProgressBar } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { SessionWord } from "@/stores/types";
import OptionButton from "./OptionButton";
import { shuffleArray } from "@/utils";

type QuestionCardProps = {
  word: SessionWord;
  wordCount: number;
  currentIndex: number;
  progress: number;
  score: number;
  colors: any;
  handleAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
};

const QuestionCard = ({
  word,
  wordCount,
  currentIndex,
  progress,
  score,
  colors,
  handleAnswer,
  selectedAnswer,
  setSelectedAnswer,
}: QuestionCardProps) => {
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (word && word.options) {
      setRandomizedOptions(shuffleArray(word.options));
    }
  }, [word, currentIndex]);

  return (
    <>
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.onBackground }]}>
          Word {currentIndex + 1} of {wordCount}
        </Text>
        <ProgressBar
          progress={progress}
          color={colors.progress}
          style={styles.progressBar}
        />
        <Text style={[styles.scoreText, { color: colors.onBackground }]}>
          Score: {score}/{currentIndex + 1}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.questionContainer,
        ]}
      >
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text style={[styles.wordText, { color: colors.primary }]}>
              {word.word}
            </Text>
            <Text style={[styles.questionText, { color: colors.onSurface }]}>
              What does this word mean?
            </Text>
          </Card.Content>
        </Card>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {randomizedOptions.map((option: string, index: number) => (
          <OptionButton
            key={index}
            onPress={() => handleAnswer(option)}
            disabled={false}
            isCorrect={option === word.definition}
            isSelected={selectedAnswer === option}
            showAnswer={false}
            colors={colors}
          >
            {option}
          </OptionButton>
        ))}
      </View>
    </>
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

export default QuestionCard;
