import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Text, Card, ProgressBar } from "react-native-paper";
import useTheme from "@/hooks/useTheme";

type WordData = {
  word: string;
  correct: string;
  options: string[];
};

type OptionButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  showAnswer: boolean;
  colors: any;
  children: string;
};

const OptionButton = ({
  onPress,
  disabled,
  isCorrect,
  isSelected,
  showAnswer,
  colors,
  children,
}: OptionButtonProps) => {
  const getBackgroundColor = () => {
    if (showAnswer && isCorrect) return colors.progress + "20";
    return colors.surface;
  };

  const getBorderColor = () => {
    if (isSelected && !isCorrect) return colors.error;
    return "transparent";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.optionButton,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isSelected ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.optionText, { color: colors.onSurface }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const MultipleChoice = () => {
  const { colors } = useTheme();
  const [questions, setQuestions] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    const shuffledQuestions = shuffleArray([...wordData]);
    setQuestions(shuffledQuestions);
  }, []);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);

    if (answer === currentQuestion.correct) {
      setScore(score + 1);
    } else {
      shakeCard();
    }
  };

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      handleRestart();
    }
  };

  const handleRestart = () => {
    const shuffledQuestions = shuffleArray([...wordData]);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  if (!currentQuestion) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.onBackground }]}>
            Question {currentIndex + 1} of {questions.length}
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

        {/* Question */}
        <Animated.View
          style={[
            styles.questionContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.wordText, { color: colors.primary }]}>
                {currentQuestion.word}
              </Text>
              <Text style={[styles.questionText, { color: colors.onSurface }]}>
                What does this word mean?
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              onPress={() => handleAnswer(option)}
              disabled={showAnswer}
              isCorrect={option === currentQuestion.correct}
              isSelected={selectedAnswer === option}
              showAnswer={showAnswer}
              colors={colors}
            >
              {option}
            </OptionButton>
          ))}
        </View>

        {/* Feedback */}
        {showAnswer && (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.feedbackCard,
                {
                  backgroundColor:
                    selectedAnswer === currentQuestion.correct
                      ? colors.progress
                      : colors.errorContainer,
                },
              ]}
            >
              <Text style={styles.feedbackText}>
                {selectedAnswer === currentQuestion.correct
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer is: ${currentQuestion.correct}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.nextButtonText, { color: colors.onPrimary }]}
              >
                {isLastQuestion ? "Restart Quiz" : "Next Question"}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  nextButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Word data would typically come from an API
const wordData: WordData[] = [
  {
    word: "Ephemeral",
    correct: "Lasting for a very short time",
    options: [
      "Lasting for a very short time",
      "Permanently enduring",
      "Highly controversial",
      "Extremely large",
    ],
  },
  {
    word: "Ubiquitous",
    correct: "Present everywhere",
    options: [
      "Rarely seen",
      "Present everywhere",
      "Uniquely beautiful",
      "Strongly scented",
    ],
  },
  {
    word: "Surreptitious",
    correct: "Kept secret, especially because it would not be approved of",
    options: [
      "Kept secret, especially because it would not be approved of",
      "Done openly and honestly",
      "Extremely loud and noticeable",
      "Carefully planned in advance",
    ],
  },
  {
    word: "Mellifluous",
    correct: "Sweet or musical; pleasant to hear",
    options: [
      "Sweet or musical; pleasant to hear",
      "Harsh and grating to the ears",
      "Silent and peaceful",
      "Loud and chaotic",
    ],
  },
  {
    word: "Paradigm",
    correct: "A typical example or pattern of something",
    options: [
      "A typical example or pattern of something",
      "A rare or unusual occurrence",
      "A mathematical equation",
      "A type of ancient writing",
    ],
  },
  {
    word: "Perfunctory",
    correct: "Done without care or interest, purely as a duty",
    options: [
      "Done without care or interest, purely as a duty",
      "Done with great attention to detail",
      "Performed perfectly",
      "Done with enthusiasm",
    ],
  },
  {
    word: "Equanimity",
    correct: "Mental calmness and composure in difficult situations",
    options: [
      "Mental calmness and composure in difficult situations",
      "Physical balance and coordination",
      "Extreme emotional reactions",
      "Social equality and fairness",
    ],
  },
  {
    word: "Pellucid",
    correct: "Translucently clear and easy to understand",
    options: [
      "Translucently clear and easy to understand",
      "Murky and difficult to comprehend",
      "Beautifully decorated",
      "Mathematically precise",
    ],
  },
  {
    word: "Quotidian",
    correct: "Of or occurring every day; ordinary or everyday",
    options: [
      "Of or occurring every day; ordinary or everyday",
      "Rare and extraordinary",
      "Ancient and historical",
      "Modern and cutting-edge",
    ],
  },
  {
    word: "Ineffable",
    correct: "Too great or extreme to be expressed in words",
    options: [
      "Too great or extreme to be expressed in words",
      "Easy to describe or explain",
      "Completely ineffective",
      "Highly efficient",
    ],
  },
  {
    word: "Perspicacious",
    correct: "Having a ready insight into and understanding of things",
    options: [
      "Having a ready insight into and understanding of things",
      "Being physically perspicuous",
      "Lacking in awareness",
      "Being overly suspicious",
    ],
  },
  {
    word: "Nebulous",
    correct: "Unclear, vague, or ill-defined",
    options: [
      "Unclear, vague, or ill-defined",
      "Perfectly clear and precise",
      "Related to clouds",
      "Scientifically proven",
    ],
  },
  {
    word: "Fastidious",
    correct: "Very attentive to accuracy and detail",
    options: [
      "Very attentive to accuracy and detail",
      "Careless and sloppy",
      "Quick and hasty",
      "Extremely fast",
    ],
  },
  {
    word: "Propitious",
    correct: "Giving or indicating a good chance of success",
    options: [
      "Giving or indicating a good chance of success",
      "Indicating certain failure",
      "Relating to property",
      "Highly ambitious",
    ],
  },
  {
    word: "Truculent",
    correct: "Eager or quick to argue or fight; aggressively defiant",
    options: [
      "Eager or quick to argue or fight; aggressively defiant",
      "Peaceful and agreeable",
      "Slow and methodical",
      "Honest and trustworthy",
    ],
  },
  {
    word: "Insidious",
    correct: "Proceeding in a gradual, subtle way, but with harmful effects",
    options: [
      "Proceeding in a gradual, subtle way, but with harmful effects",
      "Obviously dangerous",
      "Completely harmless",
      "Quick and noticeable",
    ],
  },
  {
    word: "Sagacious",
    correct: "Having or showing keen mental discernment and good judgment",
    options: [
      "Having or showing keen mental discernment and good judgment",
      "Lacking in wisdom",
      "Related to herbs and spices",
      "Physically strong",
    ],
  },
  {
    word: "Mendacious",
    correct: "Not telling the truth; lying",
    options: [
      "Not telling the truth; lying",
      "Completely honest",
      "Helpful and kind",
      "Accidentally incorrect",
    ],
  },
  {
    word: "Laconic",
    correct: "Using few words; concise",
    options: [
      "Using few words; concise",
      "Very talkative",
      "Related to lakes",
      "Extremely detailed",
    ],
  },
  {
    word: "Ephemeral",
    correct: "Lasting for a very short time",
    options: [
      "Lasting for a very short time",
      "Permanent and enduring",
      "Related to elephants",
      "Extremely important",
    ],
  },
  {
    word: "Recalcitrant",
    correct: "Having an obstinately uncooperative attitude",
    options: [
      "Having an obstinately uncooperative attitude",
      "Eager to cooperate",
      "Good at calculations",
      "Frequently recurring",
    ],
  },
  {
    word: "Sycophant",
    correct:
      "A person who acts obsequiously toward someone important to gain advantage",
    options: [
      "A person who acts obsequiously toward someone important to gain advantage",
      "A musical instrument",
      "A type of elephant",
      "A mental illness",
    ],
  },
  {
    word: "Pontificate",
    correct: "Express one's opinions in a pompous way",
    options: [
      "Express one's opinions in a pompous way",
      "Build bridges",
      "Pray in church",
      "Study ancient texts",
    ],
  },
  {
    word: "Inveterate",
    correct:
      "Having a particular habit, activity, or interest that is long-established",
    options: [
      "Having a particular habit, activity, or interest that is long-established",
      "Recently developed",
      "Related to veterinary medicine",
      "Completely changed",
    ],
  },
  {
    word: "Peripatetic",
    correct:
      "Traveling from place to place, especially working or based in various places",
    options: [
      "Traveling from place to place, especially working or based in various places",
      "Staying in one place",
      "Related to diseases",
      "Moving very slowly",
    ],
  },
];

const shuffleArray = (array: WordData[]): WordData[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default MultipleChoice;
