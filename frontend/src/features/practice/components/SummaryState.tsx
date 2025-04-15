import { Button, Text } from "react-native-paper";
import { Animated, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

type GameStats = {
  correctAnswers: number;
  totalTime: number;
  masteryGained: number;
};

export type FeedbackStateProps = {
  score: number;
  numberOfWords: number;
  colors: any;
  gameStats: GameStats;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  slideAnim: Animated.Value;
  playAgain: () => void;
};

const SummaryState = ({
  score,
  numberOfWords,
  colors,
  gameStats,
  fadeAnim,
  scaleAnim,
  slideAnim,
  playAgain,
}: FeedbackStateProps) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
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
              <Text variant="headlineSmall" style={{ color: colors.primary }}>
                {score}/{numberOfWords}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleMedium">Time</Text>
              <Text variant="headlineSmall" style={{ color: colors.primary }}>
                {Math.round(gameStats.totalTime)}s
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleMedium">Mastery Gained</Text>
              <Text variant="headlineSmall" style={{ color: colors.primary }}>
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
};

export default SummaryState;
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
