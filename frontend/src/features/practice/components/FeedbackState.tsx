import { Button, Text } from "react-native-paper";
import { Animated, View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Question, Quiz } from "@/src/types/quiz";
import { IconButton } from "react-native-paper";
import WordMasteryProgress from "@/src/components/WordMasteryProgress";

type FeedbackStateProps = {
  currentQuestion: Question | null;
  score: number;
  currentQuiz: Quiz;
  colors: any;
  fadeAnim: any;
  scaleAnim: any;
  slideAnim: any;
  selectedAnswerId: number;
  currentIndex: number;
  handleNext: () => void;
};

const FeedbackState = ({
  currentQuestion,
  score,
  currentQuiz,
  colors,
  fadeAnim,
  scaleAnim,
  slideAnim,
  selectedAnswerId,
  currentIndex,
  handleNext,
}: FeedbackStateProps) => {
  return (
    <Animated.View
      style={[
        styles.feedbackContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
        },
      ]}
    >
      <Card
        style={[
          styles.feedbackCard,
          {
            backgroundColor: colors.surface,
            borderTopWidth: 6,
            borderTopColor: currentQuestion?.correctAnswerIds.includes(
              selectedAnswerId
            )
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
                  currentQuestion?.correctAnswerIds.includes(selectedAnswerId)
                    ? "check-circle"
                    : "close-circle"
                }
                iconColor={
                  currentQuestion?.correctAnswerIds.includes(selectedAnswerId)
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
                    color: currentQuestion?.correctAnswerIds.includes(
                      selectedAnswerId
                    )
                      ? colors.progress
                      : colors.error,
                  },
                ]}
              >
                {currentQuestion?.correctAnswerIds.includes(selectedAnswerId)
                  ? "Correct!"
                  : "Incorrect"}
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.feedbackMessage, { color: colors.onSurface }]}
              >
                {currentQuestion?.correctAnswerIds.includes(selectedAnswerId)
                  ? "Well done! Keep up the good work."
                  : `The correct answer is: ${currentQuestion?.correctAnswerIds[0]}`}
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
                Word: {currentQuestion?.word.word}
              </Text>
            </View>
          </View>

          {currentQuestion && (
            <WordMasteryProgress word={currentQuestion.word.word} />
          )}

          {currentQuestion?.correctAnswerIds.includes(selectedAnswerId) && (
            <View style={styles.sentencePromptContainer}>
              <Text variant="titleMedium" style={styles.promptTitle}>
                Want to practice in a sentence?
              </Text>
              <View style={styles.sentencePromptButtons}>
                <Button
                  mode="contained"
                  onPress={() => {
                    () => {
                      console.log("WILL IMPLEMENT ");
                    };
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
            {currentIndex === currentQuiz?.questions?.length - 1
              ? "See Summary"
              : "Next Question"}
          </Button>
        </Card.Actions>
      </Card>
    </Animated.View>
  );
};

export default FeedbackState;

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
